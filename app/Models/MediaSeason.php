<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MediaSeason extends Model
{
    protected $table = 'media_seasons';

    protected $fillable = [
        'media_item_id',
        'number',
        'title',
        'url',
        'raw_meta',
    ];

    protected $casts = [
        'raw_meta' => 'array',
    ];

    public function mediaItem(): BelongsTo
    {
        return $this->belongsTo(MediaItem::class, 'media_item_id');
    }

    public function episodes(): HasMany
    {
        return $this->hasMany(MediaEpisode::class, 'media_season_id');
    }
}
