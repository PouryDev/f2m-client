<?php

namespace App\Services;

use App\Models\DownloadLink;
use App\Models\MediaEpisode;
use App\Models\MediaItem;
use App\Models\MediaSeason;
use Illuminate\Support\Facades\DB;

class MediaIngestor
{
    public function __construct(private readonly F2mCrawler $crawler)
    {
    }

    public function ingestFromUrl(string $url, array $overrides = []): int
    {
        $payload = $this->crawler->crawl($url);
        $media = $payload['media'];
        $media['raw_meta'] = $media['raw_meta'] ?? null;
        $media['raw_head_meta'] = $media['raw_head_meta'] ?? null;
        $downloads = $payload['downloads'] ?? [];
        $episodes = $payload['episodes'] ?? [];

        if (! empty($overrides['type'])) {
            $media['type'] = $overrides['type'];
        }
        if (! empty($overrides['title'])) {
            $media['title'] = $overrides['title'];
        }
        if (! empty($overrides['poster_url'])) {
            $media['poster_url'] = $overrides['poster_url'];
        }

        $upsertDownload = function (string $type, int $id, array $download): void {
            DownloadLink::query()->updateOrCreate(
                [
                    'downloadable_type' => $type,
                    'downloadable_id' => $id,
                    'url' => $download['url'],
                ],
                [
                    'language' => $download['language'] ?? null,
                    'quality' => $download['quality'] ?? null,
                    'format' => $download['format'] ?? null,
                    'label' => $download['label'] ?? null,
                    'source' => $download['source'] ?? null,
                    'size' => $download['size'] ?? null,
                    'raw_meta' => $download['raw_meta'] ?? [],
                ]
            );
        };

        $deleteMissingDownloads = function (string $type, array $ids, $now): void {
            if (empty($ids)) {
                return;
            }

            $cutoff = $now->copy()->subMinutes(1);

            DownloadLink::query()
                ->where('downloadable_type', $type)
                ->whereIn('downloadable_id', $ids)
                ->where('updated_at', '<', $cutoff)
                ->delete();
        };

        return DB::transaction(function () use ($media, $downloads, $episodes, $upsertDownload, $deleteMissingDownloads) {
            $now = now();
            $mediaItem = MediaItem::query()->updateOrCreate(
                ['url' => $media['url']],
                $media
            );
            $mediaId = $mediaItem->id;

            if (! empty($episodes)) {
                $downloadableIds = [];
                foreach ($episodes as $episodeData) {
                    $seasonNumber = $episodeData['season'] ?? null;
                    if ($seasonNumber === null) {
                        $seasonNumber = 1;
                    }

                    $season = MediaSeason::query()->firstOrCreate(
                        ['media_item_id' => $mediaId, 'number' => $seasonNumber],
                        [
                            'title' => $episodeData['season_title'] ?? null,
                            'url' => null,
                            'raw_meta' => [],
                        ]
                    );
                    $seasonId = $season->id;

                    $episodeNumber = $episodeData['episode'] ?? null;
                    $episodeTitle = $episodeData['title'] ?? null;
                    $episodeKey = $episodeData['key'] ?? null;

                    $episodeQuery = MediaEpisode::query()->where('media_season_id', $seasonId);
                    if ($episodeKey) {
                        $episodeQuery->where('external_key', $episodeKey);
                    } elseif ($episodeNumber !== null) {
                        $episodeQuery->where('number', $episodeNumber);
                    } elseif ($episodeTitle) {
                        $episodeQuery->where('title', $episodeTitle);
                    }

                    $episode = $episodeQuery->first();

                    if ($episode) {
                        $episode->update([
                            'number' => $episodeNumber,
                            'title' => $episodeTitle,
                            'external_key' => $episodeKey,
                        ]);
                        $episodeId = $episode->id;
                    } else {
                        $episodeId = MediaEpisode::query()->create([
                            'media_season_id' => $seasonId,
                            'number' => $episodeNumber,
                            'title' => $episodeTitle,
                            'external_key' => $episodeKey,
                            'url' => null,
                            'raw_meta' => [],
                        ])->id;
                    }

                    $downloadableIds[] = $episodeId;

                    foreach ($episodeData['downloads'] as $download) {
                        $upsertDownload('media_episode', $episodeId, $download);
                    }
                }

                $deleteMissingDownloads('media_episode', $downloadableIds, $now);
            } else {
                foreach ($downloads as $download) {
                    $upsertDownload('media_item', $mediaId, $download);
                }
            }

            if (empty($episodes)) {
                $deleteMissingDownloads('media_item', [$mediaId], $now);
            }

            return $mediaId;
        });
    }
}
