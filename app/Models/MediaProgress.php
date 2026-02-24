<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MediaProgress extends Model
{
    protected $table = 'media_progress';

    protected $fillable = [
        'user_id',
        'media_id',
        'episode_id',
        'seconds',
        'duration_seconds',
        'last_percent',
        'completed_70_count',
        'total_watch_seconds',
    ];

    protected $casts = [
        'seconds' => 'float',
        'duration_seconds' => 'float',
        'last_percent' => 'float',
        'total_watch_seconds' => 'float',
        'completed_70_count' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function media(): BelongsTo
    {
        return $this->belongsTo(MediaItem::class, 'media_id');
    }

    public function episode(): BelongsTo
    {
        return $this->belongsTo(MediaEpisode::class, 'episode_id');
    }
}
