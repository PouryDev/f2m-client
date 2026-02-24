<?php

namespace App\Http\Controllers;

use App\Models\DownloadLink;
use App\Models\MediaItem;
use App\Models\MediaProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use GuzzleHttp\Client;

class MediaController extends Controller
{
    public function index(): JsonResponse
    {
        $items = MediaItem::query()
            ->select(['id', 'type', 'title', 'slug', 'poster_url', 'year', 'imdb_rating', 'synopsis'])
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'data' => $items,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $media = MediaItem::query()->where('id', $id)->first();
        if (! $media) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $media->load([
            'downloads' => fn ($q) => $q->orderBy('quality'),
            'seasons' => fn ($q) => $q->orderBy('number'),
            'seasons.episodes' => fn ($q) => $q->orderBy('number'),
            'seasons.episodes.downloads' => fn ($q) => $q->orderBy('quality'),
        ]);

        $downloads = $media->downloads->map(function ($download) {
            $download->stream_url = url("/api/stream/{$download->id}");
            return $download;
        })->values();

        $seasons = $media->seasons->map(function ($season) {
            $season->episodes = $season->episodes->map(function ($episode) {
                $episode->downloads = $episode->downloads->map(function ($download) {
                    $download->stream_url = url("/api/stream/{$download->id}");
                    return $download;
                })->values();
                return $episode;
            })->values();
            return $season;
        })->values();

        return response()->json([
            'media' => $media,
            'downloads' => $downloads,
            'seasons' => $seasons,
        ]);
    }

    public function stream(int $id, Request $request)
    {
        $download = DownloadLink::query()->where('id', $id)->first();
        if (! $download) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $client = new Client([
            'http_errors' => false,
            'allow_redirects' => true,
            'verify' => false,
        ]);

        $upstreamHeaders = [];
        if ($request->hasHeader('Range')) {
            $upstreamHeaders['Range'] = $request->header('Range');
        }
        if ($request->hasHeader('User-Agent')) {
            $upstreamHeaders['User-Agent'] = $request->header('User-Agent');
        }

        $method = $request->isMethod('HEAD') ? 'HEAD' : 'GET';
        $upstream = $client->request($method, $download->url, [
            'headers' => $upstreamHeaders,
            'stream' => true,
        ]);

        $status = $upstream->getStatusCode();
        if ($status >= 400) {
            return response()->json(['message' => 'Upstream error'], $status);
        }

        $getHeader = function (string $name) use ($upstream) {
            $values = $upstream->getHeader($name);
            return $values ? $values[0] : null;
        };

        $responseHeaders = [
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Headers' => 'Range, Content-Type, Origin, Accept',
            'Access-Control-Expose-Headers' => 'Accept-Ranges, Content-Range, Content-Length, Content-Type',
        ];

        foreach (['Content-Type', 'Content-Length', 'Content-Range', 'Accept-Ranges'] as $header) {
            $value = $getHeader($header);
            if ($value) {
                $responseHeaders[$header] = $value;
            }
        }

        if ($request->isMethod('HEAD')) {
            return response('', $status, $responseHeaders);
        }

        $body = $upstream->getBody();
        return new StreamedResponse(function () use ($body) {
            while (! $body->eof()) {
                echo $body->read(1024 * 1024);
                if (function_exists('ob_flush')) {
                    @ob_flush();
                }
                flush();
            }
        }, $status, $responseHeaders);
    }

    public function progressShow(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $mediaId = (int) $request->query('media_id');
        $episodeId = $request->query('episode_id');
        $episodeId = $episodeId === null ? null : (int) $episodeId;

        if (! $mediaId) {
            return response()->json(['message' => 'media_id is required'], 422);
        }

        $query = MediaProgress::query()
            ->where('user_id', $userId)
            ->where('media_id', $mediaId);
        if ($episodeId) {
            $query->where('episode_id', $episodeId);
        } else {
            $query->whereNull('episode_id');
        }

        $row = $query->first();
        return response()->json([
            'media_id' => $mediaId,
            'episode_id' => $episodeId,
            'seconds' => $row?->seconds ?? 0,
            'duration_seconds' => $row?->duration_seconds ?? 0,
            'total_watch_seconds' => $row?->total_watch_seconds ?? 0,
        ]);
    }

    public function progressLatest(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $mediaId = (int) $request->query('media_id');

        if (! $mediaId) {
            return response()->json(['message' => 'media_id is required'], 422);
        }

        $row = MediaProgress::query()
            ->where('user_id', $userId)
            ->where('media_id', $mediaId)
            ->orderByDesc('updated_at')
            ->first();

        return response()->json([
            'media_id' => $mediaId,
            'episode_id' => $row?->episode_id,
            'seconds' => $row?->seconds ?? 0,
        ]);
    }

    public function progressSave(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $mediaId = (int) $request->input('media_id');
        $episodeId = $request->input('episode_id');
        $episodeId = $episodeId === null ? null : (int) $episodeId;
        $seconds = (float) $request->input('seconds', 0);
        $durationSeconds = (float) $request->input('duration_seconds', 0);
        $watchedDelta = (float) $request->input('watched_delta', 0);

        if (! $mediaId) {
            return response()->json(['message' => 'media_id is required'], 422);
        }

        $seconds = max(0, $seconds);
        $durationSeconds = max(0, $durationSeconds);
        $watchedDelta = max(0, $watchedDelta);

        $existing = MediaProgress::query()
            ->where('user_id', $userId)
            ->where('media_id', $mediaId)
            ->when($episodeId, fn ($q) => $q->where('episode_id', $episodeId), fn ($q) => $q->whereNull('episode_id'))
            ->first();

        $lastPercent = $existing?->last_percent ?? 0;
        $nextPercent = 0;
        if ($durationSeconds > 0) {
            $nextPercent = min(1, $seconds / $durationSeconds);
        }
        $completed70Count = $existing?->completed_70_count ?? 0;
        if ($nextPercent >= 0.7 && $lastPercent < 0.7) {
            $completed70Count += 1;
        }

        $payload = [
            'user_id' => $userId,
            'media_id' => $mediaId,
            'episode_id' => $episodeId,
            'seconds' => $seconds,
            'duration_seconds' => $durationSeconds,
            'last_percent' => $nextPercent,
            'completed_70_count' => $completed70Count,
            'total_watch_seconds' => ($existing?->total_watch_seconds ?? 0) + $watchedDelta,
        ];

        if ($existing) {
            $existing->update($payload);
        } else {
            MediaProgress::query()->create($payload);
        }

        return response()->json([
            'media_id' => $mediaId,
            'episode_id' => $episodeId,
            'seconds' => $seconds,
        ]);
    }

    public function progressDelete(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $mediaId = (int) $request->input('media_id');
        $episodeId = $request->input('episode_id');
        $episodeId = $episodeId === null ? null : (int) $episodeId;

        if (! $mediaId) {
            return response()->json(['message' => 'media_id is required'], 422);
        }

        $query = MediaProgress::query()
            ->where('user_id', $userId)
            ->where('media_id', $mediaId);
        if ($episodeId) {
            $query->where('episode_id', $episodeId);
        } else {
            $query->whereNull('episode_id');
        }
        $query->delete();

        return response()->json(['ok' => true]);
    }
}
