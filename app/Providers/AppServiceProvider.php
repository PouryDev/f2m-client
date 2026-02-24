<?php

namespace App\Providers;

use App\Models\MediaEpisode;
use App\Models\MediaItem;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Relation::morphMap([
            'media_item' => MediaItem::class,
            'media_episode' => MediaEpisode::class,
        ]);
    }
}
