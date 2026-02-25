<?php

namespace App\Http\Controllers;

use App\Models\MediaItem;
use App\Services\MediaIngestor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminMediaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $items = MediaItem::query()
            ->select(['id', 'type', 'title', 'url', 'poster_url', 'year', 'imdb_rating', 'updated_at'])
            ->orderByDesc('updated_at')
            ->get();

        return response()->json(['data' => $items]);
    }

    public function create(Request $request, MediaIngestor $ingestor): JsonResponse
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'url' => ['required', 'url'],
            'type' => ['nullable', 'in:movie,series'],
            'title' => ['nullable', 'string', 'max:255'],
            'poster_url' => ['nullable', 'url'],
        ]);

        $mediaId = $ingestor->ingestFromUrl($data['url'], $data);

        return response()->json([
            'id' => $mediaId,
        ], 201);
    }

    public function refresh(Request $request, int $id, MediaIngestor $ingestor): JsonResponse
    {
        $this->authorizeAdmin($request);

        $item = MediaItem::query()->where('id', $id)->first();
        if (! $item) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $ingestor->ingestFromUrl($item->url);

        return response()->json(['ok' => true]);
    }

    public function updatePoster(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin($request);

        $item = MediaItem::query()->where('id', $id)->first();
        if (! $item) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $request->validate([
            'poster' => ['required', 'image', 'max:4096'],
        ]);

        $path = $request->file('poster')->store('posters', 'public');
        $item->update([
            'poster_url' => asset('storage/'.$path),
        ]);

        return response()->json([
            'ok' => true,
            'poster_url' => $item->poster_url,
        ]);
    }

    

    public function mediaStatus(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin($request);

        $item = MediaItem::query()->where('id', $id)->first();
        if (! $item) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $status = strtolower((string) ($item->status ?? 'ready'));
        $normalized = match ($status) {
            'processing', 'pending' => 'processing',
            'failed', 'error' => 'failed',
            default => 'ready',
        };

        return response()->json([
            'status' => $normalized,
        ]);
    }

private function authorizeAdmin(Request $request): void
    {
        if (! $request->user()?->is_admin) {
            abort(403, 'Forbidden');
        }
    }
}
