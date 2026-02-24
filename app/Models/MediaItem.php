<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class MediaItem extends Model
{
    protected $table = 'media_items';

    protected $fillable = [
        'type',
        'title',
        'slug',
        'url',
        'synopsis',
        'poster_url',
        'year',
        'status',
        'imdb_rating',
        'duration_minutes',
        'country',
        'raw_meta',
        'raw_head_meta',
    ];

    protected $casts = [
        'raw_meta' => 'array',
        'raw_head_meta' => 'array',
    ];

    public function seasons(): HasMany
    {
        return $this->hasMany(MediaSeason::class, 'media_item_id');
    }

    public function downloads(): MorphMany
    {
        return $this->morphMany(DownloadLink::class, 'downloadable');
    }
}
