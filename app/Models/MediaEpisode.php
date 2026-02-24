<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class MediaEpisode extends Model
{
    protected $table = 'media_episodes';

    protected $fillable = [
        'media_season_id',
        'number',
        'title',
        'external_key',
        'url',
        'raw_meta',
    ];

    protected $casts = [
        'raw_meta' => 'array',
    ];

    public function season(): BelongsTo
    {
        return $this->belongsTo(MediaSeason::class, 'media_season_id');
    }

    public function downloads(): MorphMany
    {
        return $this->morphMany(DownloadLink::class, 'downloadable');
    }
}
