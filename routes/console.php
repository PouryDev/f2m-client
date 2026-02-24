<?php

use App\Services\F2mCrawler;
use App\Services\MediaIngestor;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('f2m:crawl {url}', function (MediaIngestor $ingestor) {
    $url = (string) $this->argument('url');

    $this->info('Fetching: '.$url);
    $ingestor->ingestFromUrl($url);

    $this->info('Done.');
})->purpose('Crawl an f2m URL and store media meta + download links.');

Artisan::command('f2m:help', function () {
    $this->line('Usage: php artisan f2m:crawl {url}');
    $this->line('Stores media items, seasons, episodes, and download links.');
});
