<?php

namespace App\Http\Controllers;

use App\Models\MediaProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function overview(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $base = MediaProgress::query()
            ->join('media_items', 'media_items.id', '=', 'media_progress.media_id')
            ->where('media_progress.user_id', $userId);

        $totalWatch = (clone $base)->sum('media_progress.total_watch_seconds');
        $movieWatch = (clone $base)->where('media_items.type', 'movie')->sum('media_progress.total_watch_seconds');
        $seriesWatch = (clone $base)->where('media_items.type', 'series')->sum('media_progress.total_watch_seconds');

        $completed70 = (clone $base)->sum('media_progress.completed_70_count');

        $completed70Titles = (clone $base)
            ->where('media_progress.completed_70_count', '>', 0)
            ->distinct('media_items.id')
            ->count('media_items.id');

        $movieCountWatched = (clone $base)
            ->where('media_items.type', 'movie')
            ->distinct('media_items.id')
            ->count('media_items.id');

        $seriesCountWatched = (clone $base)
            ->where('media_items.type', 'series')
            ->distinct('media_items.id')
            ->count('media_items.id');

        $topCompleted = (clone $base)
            ->select('media_items.id', 'media_items.title', 'media_items.type', DB::raw('SUM(media_progress.completed_70_count) as completions'))
            ->groupBy('media_items.id', 'media_items.title', 'media_items.type')
            ->orderByDesc('completions')
            ->limit(10)
            ->get();

        $lastWatched = (clone $base)
            ->select('media_items.id', 'media_items.title', 'media_items.type', 'media_progress.updated_at', 'media_progress.seconds', 'media_progress.duration_seconds')
            ->orderByDesc('media_progress.updated_at')
            ->first();

        return response()->json([
            'total_watch_seconds' => (float) $totalWatch,
            'movie_watch_seconds' => (float) $movieWatch,
            'series_watch_seconds' => (float) $seriesWatch,
            'completed_70_total' => (int) $completed70,
            'completed_70_titles' => (int) $completed70Titles,
            'movie_count_watched' => (int) $movieCountWatched,
            'series_count_watched' => (int) $seriesCountWatched,
            'last_watched' => $lastWatched,
            'top_completed' => $topCompleted,
        ]);
    }


    public function continueWatching(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $items = MediaProgress::query()
            ->join('media_items', 'media_items.id', '=', 'media_progress.media_id')
            ->where('media_progress.user_id', $userId)
            ->where('media_progress.seconds', '>', 0)
            ->select([
                'media_items.id',
                'media_items.title',
                'media_items.poster_url',
                'media_items.type as media_type',
                'media_progress.seconds as last_position_seconds',
                'media_progress.duration_seconds',
                'media_progress.updated_at',
            ])
            ->orderByDesc('media_progress.updated_at')
            ->limit(12)
            ->get()
            ->map(function ($row) {
                $duration = (float) ($row->duration_seconds ?? 0);
                $seconds = (float) ($row->last_position_seconds ?? 0);
                $progress = $duration > 0 ? ($seconds / $duration) * 100 : 0;

                return [
                    'id' => $row->id,
                    'title' => $row->title,
                    'poster_url' => $row->poster_url,
                    'progress_percentage' => max(0, min(100, $progress)),
                    'last_position_seconds' => max(0, $seconds),
                    'media_type' => $row->media_type,
                ];
            })
            ->values();

        return response()->json($items);
    }

}
