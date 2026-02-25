<?php

namespace App\Http\Controllers;

use App\Models\MediaFavorite;
use App\Models\MediaProgress;
use App\Models\MediaWatchlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccountDashboardController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $base = MediaProgress::query()
            ->join('media_items', 'media_items.id', '=', 'media_progress.media_id')
            ->where('media_progress.user_id', $userId);

        $stats = [
            'total_watch_seconds' => (float) (clone $base)->sum('media_progress.total_watch_seconds'),
            'movie_count_watched' => (int) (clone $base)->where('media_items.type', 'movie')->distinct('media_items.id')->count('media_items.id'),
            'series_count_watched' => (int) (clone $base)->where('media_items.type', 'series')->distinct('media_items.id')->count('media_items.id'),
            'completed_70_total' => (int) (clone $base)->sum('media_progress.completed_70_count'),
            'last_watched' => (clone $base)
                ->select('media_items.id', 'media_items.title', 'media_items.type', 'media_progress.seconds', 'media_progress.updated_at')
                ->orderByDesc('media_progress.updated_at')
                ->first(),
        ];

        $topReplays = (clone $base)
            ->select('media_items.id', 'media_items.title', 'media_items.type', DB::raw('SUM(media_progress.completed_70_count) as completions'))
            ->groupBy('media_items.id', 'media_items.title', 'media_items.type')
            ->orderByDesc('completions')
            ->limit(10)
            ->get();

        $watchlist = MediaWatchlist::query()
            ->join('media_items', 'media_items.id', '=', 'media_watchlists.media_item_id')
            ->where('media_watchlists.user_id', $userId)
            ->select('media_items.id', 'media_items.title', 'media_items.poster_url', 'media_items.type')
            ->orderByDesc('media_watchlists.id')
            ->limit(30)
            ->get();

        $favorites = MediaFavorite::query()
            ->join('media_items', 'media_items.id', '=', 'media_favorites.media_item_id')
            ->where('media_favorites.user_id', $userId)
            ->select('media_items.id', 'media_items.title', 'media_items.poster_url', 'media_items.type')
            ->orderByDesc('media_favorites.id')
            ->limit(30)
            ->get();

        return response()->json([
            'stats' => $stats,
            'watchlist' => $watchlist,
            'favorites' => $favorites,
            'top_replays' => $topReplays,
        ]);
    }
}
