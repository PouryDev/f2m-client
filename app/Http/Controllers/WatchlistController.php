<?php

namespace App\Http\Controllers;

use App\Models\MediaItem;
use App\Models\MediaWatchlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WatchlistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $items = MediaWatchlist::query()
            ->with('media:id,type,title,poster_url,year,imdb_rating')
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($row) {
                return array_merge(
                    $row->media->only(['id', 'type', 'title', 'poster_url', 'year', 'imdb_rating']),
                    ['created_at' => $row->created_at]
                );
            });

        return response()->json(['data' => $items]);
    }

    public function store(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $mediaId = (int) $request->input('media_id');

        if (! $mediaId) {
            return response()->json(['message' => 'media_id is required'], 422);
        }

        $exists = MediaItem::query()->where('id', $mediaId)->exists();
        if (! $exists) {
            return response()->json(['message' => 'Not found'], 404);
        }

        MediaWatchlist::query()->updateOrCreate(
            ['user_id' => $userId, 'media_id' => $mediaId],
            ['user_id' => $userId, 'media_id' => $mediaId]
        );

        return response()->json(['ok' => true]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $mediaId = (int) $request->input('media_id');

        if (! $mediaId) {
            return response()->json(['message' => 'media_id is required'], 422);
        }

        MediaWatchlist::query()
            ->where('user_id', $userId)
            ->where('media_id', $mediaId)
            ->delete();

        return response()->json(['ok' => true]);
    }
}
