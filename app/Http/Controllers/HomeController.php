<?php

namespace App\Http\Controllers;

use App\Models\MediaFavorite;
use App\Models\MediaItem;
use App\Models\MediaProgress;
use App\Models\MediaWatchlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $library = MediaItem::query()
            ->select(['id', 'type', 'title', 'poster_url', 'synopsis', 'year', 'imdb_rating'])
            ->orderByDesc('id')
            ->get();

        $watchlistIds = MediaWatchlist::query()->where('user_id', $userId)->pluck('media_item_id')->all();
        $favoriteIds = MediaFavorite::query()->where('user_id', $userId)->pluck('media_item_id')->all();

        $continueRows = MediaProgress::query()
            ->join('media_items', 'media_items.id', '=', 'media_progress.media_id')
            ->where('media_progress.user_id', $userId)
            ->where('media_progress.last_percent', '>', 0)
            ->where('media_progress.last_percent', '<', 1)
            ->select('media_items.id', 'media_items.title', 'media_items.poster_url', DB::raw('MAX(media_progress.last_percent) as percent'))
            ->groupBy('media_items.id', 'media_items.title', 'media_items.poster_url')
            ->orderByDesc(DB::raw('MAX(media_progress.updated_at)'))
            ->limit(20)
            ->get();

        $progress = [];
        foreach ($continueRows as $row) {
            $progress[$row->id] = (int) round(((float) $row->percent) * 100);
        }

        $trending = $library->sortByDesc('imdb_rating')->take(20)->values();
        $newReleases = $library->sortByDesc('id')->take(20)->values();
        $yourLibrary = $library->whereIn('id', array_unique(array_merge($watchlistIds, $favoriteIds)))->take(20)->values();

        return response()->json([
            'featured' => $trending->first() ?: $library->first(),
            'progress' => $progress,
            'rows' => [
                'continue_watching' => $continueRows->map(fn ($row) => [
                    'id' => (int) $row->id,
                    'title' => $row->title,
                    'poster_url' => $row->poster_url,
                ])->values(),
                'trending' => $trending,
                'new_releases' => $newReleases,
                'your_library' => $yourLibrary,
            ],
        ]);
    }
}
