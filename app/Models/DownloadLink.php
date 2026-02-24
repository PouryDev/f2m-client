<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class DownloadLink extends Model
{
    protected $table = 'download_links';

    protected $fillable = [
        'downloadable_type',
        'downloadable_id',
        'language',
        'quality',
        'format',
        'url',
        'label',
        'source',
        'size',
        'raw_meta',
    ];

    protected $casts = [
        'raw_meta' => 'array',
    ];

    public function downloadable(): MorphTo
    {
        return $this->morphTo();
    }
}
