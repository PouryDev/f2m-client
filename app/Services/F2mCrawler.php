<?php

namespace App\Services;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class F2mCrawler
{
    public function crawl(string $url): array
    {
        $html = $this->fetchHtml($url);
        $dom = $this->loadDom($html);

        $headMeta = $this->extractHeadMeta($dom);
        $title = $this->firstNonEmpty([
            $this->textByXPath($dom, "//h1"),
            Arr::get($headMeta, 'og:title'),
            Arr::get($headMeta, 'twitter:title'),
            Arr::get($headMeta, 'title'),
        ]);

        $posterUrl = $this->firstNonEmpty([
            Arr::get($headMeta, 'og:image'),
            Arr::get($headMeta, 'twitter:image'),
            $this->attrByXPath($dom, "//img[contains(@class,'poster') or contains(@class,'cover') or contains(@class,'thumb')][1]", 'src'),
            $this->attrByXPath($dom, "//img[contains(@src,'poster') or contains(@src,'cover')][1]", 'src'),
        ]);
        $posterUrl = $this->resolveUrl($url, $posterUrl);

        $synopsis = $this->firstNonEmpty([
            Arr::get($headMeta, 'description'),
            $this->textByXPath($dom, "//*[contains(@class,'summary') or contains(@class,'synopsis') or contains(@class,'story')][1]"),
        ]);

        $rawMetaPairs = $this->extractMetaPairs($dom);

        $type = $this->detectType($url, $dom, $rawMetaPairs);

        $downloads = $this->extractDownloadLinks($dom, $url);
        $episodes = [];

        if ($type === 'series') {
            $episodes = $this->extractEpisodesFromDom($dom, $url);
        }

        return [
            'media' => [
                'type' => $type,
                'title' => $title,
                'slug' => Str::slug($title ?? ''),
                'url' => $url,
                'synopsis' => $synopsis,
                'poster_url' => $posterUrl,
                'year' => $this->extractYear($rawMetaPairs, $title),
                'imdb_rating' => $this->extractRating($rawMetaPairs),
                'duration_minutes' => $this->extractDuration($rawMetaPairs),
                'status' => $this->extractStatus($rawMetaPairs),
                'country' => $this->extractCountry($rawMetaPairs),
                'raw_meta' => $rawMetaPairs,
                'raw_head_meta' => $headMeta,
            ],
            'downloads' => $downloads,
            'episodes' => $episodes,
        ];
    }

    private function fetchHtml(string $url): string
    {
        $response = Http::withHeaders([
            'User-Agent' => 'Mozilla/5.0 (compatible; F2mCrawler/1.0; +https://localhost)',
            'Accept' => 'text/html,application/xhtml+xml',
        ])->get($url);

        $response->throw();

        return $response->body();
    }

    private function loadDom(string $html): \DOMDocument
    {
        $dom = new \DOMDocument();
        libxml_use_internal_errors(true);
        $dom->loadHTML($html);
        libxml_clear_errors();

        return $dom;
    }

    private function xpath(\DOMDocument $dom): \DOMXPath
    {
        return new \DOMXPath($dom);
    }

    private function textByXPath(\DOMDocument $dom, string $query): ?string
    {
        $node = $this->xpath($dom)->query($query)->item(0);
        if (! $node) {
            return null;
        }

        return $this->normalizeWhitespace($node->textContent);
    }

    private function attrByXPath(\DOMDocument $dom, string $query, string $attr): ?string
    {
        $node = $this->xpath($dom)->query($query)->item(0);
        if (! $node || ! $node->attributes) {
            return null;
        }

        $value = $node->attributes->getNamedItem($attr)?->nodeValue;

        return $value ? trim($value) : null;
    }

    private function extractHeadMeta(\DOMDocument $dom): array
    {
        $meta = [];
        $title = $this->textByXPath($dom, '//title');
        if ($title) {
            $meta['title'] = $title;
        }

        $nodes = $this->xpath($dom)->query('//meta');
        foreach ($nodes as $node) {
            $name = $node->attributes?->getNamedItem('name')?->nodeValue;
            $property = $node->attributes?->getNamedItem('property')?->nodeValue;
            $content = $node->attributes?->getNamedItem('content')?->nodeValue;
            if (! $content) {
                continue;
            }
            $key = $property ?: $name;
            if (! $key) {
                continue;
            }
            $meta[$key] = trim($content);
        }

        return $meta;
    }

    private function extractMetaPairs(\DOMDocument $dom): array
    {
        $pairs = [];
        $candidateNodes = $this->xpath($dom)->query(
            "//*[contains(@class,'info') or contains(@class,'meta') or contains(@class,'details') or contains(@class,'spec')]"
        );

        foreach ($candidateNodes as $node) {
            $text = $this->normalizeWhitespace($node->textContent);
            if (! $text) {
                continue;
            }
            foreach (preg_split('/\s*[\n\r]+\s*/', $text) as $line) {
                $line = trim($line);
                if (! $line) {
                    continue;
                }
                $this->pushMetaPair($pairs, $line);
            }
        }

        $listItems = $this->xpath($dom)->query('//li');
        foreach ($listItems as $node) {
            $line = $this->normalizeWhitespace($node->textContent);
            if (! $line) {
                continue;
            }
            $this->pushMetaPair($pairs, $line);
        }

        return $pairs;
    }

    private function pushMetaPair(array &$pairs, string $line): void
    {
        $line = Str::squish($line);
        if (Str::contains($line, ':')) {
            [$key, $value] = array_pad(explode(':', $line, 2), 2, null);
            $key = trim($key);
            $value = trim((string) $value);
            if ($key !== '') {
                $pairs[$key] = $value;
            }
            return;
        }

        $pairs[] = $line;
    }

    private function detectType(string $url, \DOMDocument $dom, array $rawMeta): string
    {
        if (Str::contains($url, '/series/')) {
            return 'series';
        }

        $maybeSeries = collect($rawMeta)->filter(function ($value, $key) {
            $text = is_string($key) ? $key.' '.$value : (string) $value;
            return Str::contains($text, ['فصل', 'Season', 'قسمت', 'Episode'], true);
        })->isNotEmpty();

        if ($maybeSeries) {
            return 'series';
        }

        $hints = $this->xpath($dom)->query("//*[contains(@class,'season') or contains(@class,'episode')]");

        return $hints->length > 0 ? 'series' : 'movie';
    }

    private function extractDownloadLinks(\DOMDocument $dom, string $baseUrl): array
    {
        $links = [];
        $nodes = $this->xpath($dom)->query('//a');
        foreach ($nodes as $node) {
            $href = $node->attributes?->getNamedItem('href')?->nodeValue;
            $dataHref = $node->attributes?->getNamedItem('data-href')?->nodeValue;
            $dataUrl = $node->attributes?->getNamedItem('data-url')?->nodeValue;
            $url = $href ?: $dataHref ?: $dataUrl;
            if (! $url) {
                continue;
            }

            $url = $this->resolveUrl($baseUrl, $url);
            if (! $url || ! $this->isPlayableFileUrl($url)) {
                continue;
            }

            $label = $this->normalizeWhitespace($node->textContent);
            $links[] = $this->buildDownloadEntry($url, $label);
        }

        return $this->uniqueDownloads($links);
    }

    private function isPlayableFileUrl(string $url): bool
    {
        $url = Str::lower($url);
        $path = parse_url($url, PHP_URL_PATH) ?? '';

        return (bool) preg_match('/\.(mkv|mp4)$/i', $path)
            || (bool) preg_match('/\.(mkv|mp4)(?:\?|#)/i', $url);
    }

    private function buildDownloadEntry(string $url, ?string $label = null): array
    {
        $label = $label ? Str::squish($label) : '';
        $lower = Str::lower($label.' '.$url);

        $format = null;
        $ext = strtolower(pathinfo(parse_url($url, PHP_URL_PATH) ?? '', PATHINFO_EXTENSION));
        if (in_array($ext, ['mkv', 'mp4'], true)) {
            $format = $ext;
        }

        $quality = null;
        if (preg_match('/(2160|1440|1080|720|480|360)p/i', $lower, $matches)) {
            $quality = $matches[1].'p';
        } elseif (Str::contains($lower, '4k')) {
            $quality = '4k';
        }

        $language = null;
        if (Str::contains($lower, ['دوبله', 'dub'])) {
            $language = 'dub';
        } elseif (Str::contains($lower, ['زیرنویس', 'sub'])) {
            $language = 'sub';
        } elseif (Str::contains($lower, ['اصلی', 'original'])) {
            $language = 'original';
        }

        return [
            'url' => $url,
            'label' => $label ?: null,
            'format' => $format,
            'quality' => $quality,
            'language' => $language,
            'raw_meta' => [
                'label' => $label ?: null,
            ],
        ];
    }

    private function uniqueDownloads(array $links): array
    {
        $unique = [];
        foreach ($links as $link) {
            $key = $link['url'];
            if (isset($unique[$key])) {
                continue;
            }
            $unique[$key] = $link;
        }

        return array_values($unique);
    }

    private function extractEpisodesFromDom(\DOMDocument $dom, string $baseUrl): array
    {
        $episodes = [];
        $nodes = $this->xpath($dom)->query('//a');
        $index = 0;
        foreach ($nodes as $node) {
            $href = $node->attributes?->getNamedItem('href')?->nodeValue;
            $dataHref = $node->attributes?->getNamedItem('data-href')?->nodeValue;
            $dataUrl = $node->attributes?->getNamedItem('data-url')?->nodeValue;
            $url = $href ?: $dataHref ?: $dataUrl;
            if (! $url) {
                continue;
            }

            $url = $this->resolveUrl($baseUrl, $url);
            if (! $url || ! $this->isPlayableFileUrl($url)) {
                continue;
            }

            $label = $this->normalizeWhitespace($node->textContent);
            $contextTexts = $this->gatherEpisodeContextTexts($node, $label, $url);
            $seasonNumber = $this->firstSeasonNumber($contextTexts);
            $episodeNumber = $this->firstEpisodeNumber($contextTexts);
            $episodeTitle = $this->firstEpisodeTitle($contextTexts) ?? ($label ?: null);
            $episodeKey = $this->buildEpisodeKey($seasonNumber, $episodeNumber, $episodeTitle, $label);

            $key = ($seasonNumber ?? 's?').'-'.($episodeNumber ?? 'e?').'-'.($episodeTitle ?? 't?').'-'.$index;
            if ($seasonNumber !== null || $episodeNumber !== null || $episodeKey) {
                $key = $episodeKey ?: ($seasonNumber ?? 's?').'-'.($episodeNumber ?? 'e?').'-'.($episodeTitle ?? 't?');
            }

            if (! isset($episodes[$key])) {
                $episodes[$key] = [
                    'season' => $seasonNumber,
                    'episode' => $episodeNumber,
                    'title' => $episodeTitle,
                    'key' => $episodeKey,
                    'downloads' => [],
                ];
            }
            $episodes[$key]['downloads'][] = $this->buildDownloadEntry($url, $label);
            $index++;
        }

        if (! $episodes) {
            return [];
        }

        return array_values($episodes);
    }

    private function parseSeasonNumber(string $text): ?int
    {
        if (preg_match('/فصل\s*(\d+)/u', $text, $matches)) {
            return (int) $matches[1];
        }
        if (preg_match('/\bS(\d{1,2})\b/i', $text, $matches)) {
            return (int) $matches[1];
        }
        if (preg_match('/season\s*(\d+)/i', $text, $matches)) {
            return (int) $matches[1];
        }

        return null;
    }

    private function parseEpisodeNumber(string $text): ?int
    {
        if (preg_match('/قسمت\s*(\d+)/u', $text, $matches)) {
            return (int) $matches[1];
        }
        if (preg_match('/episode\s*(\d+)/i', $text, $matches)) {
            return (int) $matches[1];
        }
        if (preg_match('/\bEp?\s*(\d+)\b/i', $text, $matches)) {
            return (int) $matches[1];
        }
        if (preg_match('/\bS(\d{1,2})E(\d{1,3})\b/i', $text, $matches)) {
            return (int) $matches[2];
        }
        if (preg_match('/\bE(\d+)\b/i', $text, $matches)) {
            return (int) $matches[1];
        }

        return null;
    }

    private function parseEpisodeTitle(string $text): ?string
    {
        if (Str::contains($text, ['قسمت', 'Episode', 'E'])) {
            return $text;
        }

        return null;
    }

    private function extractYear(array $rawMeta, ?string $title): ?int
    {
        foreach ($rawMeta as $key => $value) {
            $text = is_string($key) ? $key.' '.$value : (string) $value;
            if (preg_match('/\b(19\d{2}|20\d{2})\b/', $text, $matches)) {
                return (int) $matches[1];
            }
        }

        if ($title && preg_match('/\b(19\d{2}|20\d{2})\b/', $title, $matches)) {
            return (int) $matches[1];
        }

        return null;
    }

    private function extractRating(array $rawMeta): ?float
    {
        foreach ($rawMeta as $key => $value) {
            $text = is_string($key) ? $key.' '.$value : (string) $value;
            if (preg_match('/\b(\d{1,2}\.\d)\b/', $text, $matches)) {
                return (float) $matches[1];
            }
        }

        return null;
    }

    private function extractDuration(array $rawMeta): ?int
    {
        foreach ($rawMeta as $key => $value) {
            $text = is_string($key) ? $key.' '.$value : (string) $value;
            if (preg_match('/(\d{1,3})\s*(min|minutes|دقیقه)/i', $text, $matches)) {
                return (int) $matches[1];
            }
        }

        return null;
    }

    private function extractStatus(array $rawMeta): ?string
    {
        foreach ($rawMeta as $key => $value) {
            $text = is_string($key) ? $key.' '.$value : (string) $value;
            if (Str::contains($text, ['تمام شده', 'در حال پخش', 'Completed', 'Ongoing'], true)) {
                return $text;
            }
        }

        return null;
    }

    private function extractCountry(array $rawMeta): ?string
    {
        foreach ($rawMeta as $key => $value) {
            $text = is_string($key) ? $key.' '.$value : (string) $value;
            if (Str::contains($text, ['کشور', 'Country'], true)) {
                return $text;
            }
        }

        return null;
    }

    private function firstNonEmpty(array $values): ?string
    {
        foreach ($values as $value) {
            if (is_string($value) && trim($value) !== '') {
                return trim($value);
            }
        }

        return null;
    }

    private function normalizeWhitespace(string $value): string
    {
        return trim(preg_replace('/\s+/u', ' ', $value));
    }

    private function buildEpisodeKey(?int $seasonNumber, ?int $episodeNumber, ?string $episodeTitle, ?string $label): ?string
    {
        if ($seasonNumber !== null && $episodeNumber !== null) {
            return 's'.$seasonNumber.'-e'.$episodeNumber;
        }

        $base = $episodeTitle ?: $label;
        if (! $base) {
            return null;
        }

        $clean = $this->normalizeEpisodeLabel($base);
        if ($clean === '') {
            return null;
        }

        return ($seasonNumber !== null ? 's'.$seasonNumber.'-' : '').Str::slug($clean);
    }

    private function normalizeEpisodeLabel(string $value): string
    {
        $value = Str::lower($value);
        $value = preg_replace('/\b(2160|1440|1080|720|480|360)p\b/u', '', $value);
        $value = preg_replace('/\b(4k|x264|x265|h264|h265|hevc|aac|dts|web[- ]?dl|bluray|hdr)\b/u', '', $value);
        $value = preg_replace('/\b(mkv|mp4)\b/u', '', $value);
        $value = preg_replace('/\b(dub|dubbed|sub|subtitle|subs|dubl|zaban|asli|original|dubbed|dubbed)\b/u', '', $value);
        $value = preg_replace('/\b(دوبله|زیرنویس|اصلی|قسمت|فصل)\b/u', '', $value);
        $value = preg_replace('/\b(\d{1,3})\s*(mb|gb)\b/u', '', $value);
        $value = preg_replace('/[^\p{L}\p{N}\s-]+/u', '', $value);
        $value = preg_replace('/\s+/u', ' ', $value);
        $value = trim($value);

        return $value;
    }

    private function gatherEpisodeContextTexts(\DOMNode $node, string $label, string $url): array
    {
        $texts = [];
        if ($label) {
            $texts[] = $label;
        }
        $texts[] = $url;

        $doc = $node->ownerDocument;
        if (! $doc) {
            return $texts;
        }

        $xpath = $this->xpath($doc);
        $heading = $xpath->query('preceding::*[self::h1 or self::h2 or self::h3 or self::h4 or self::h5][1]', $node)->item(0);
        if ($heading) {
            $texts[] = $this->normalizeWhitespace($heading->textContent);
        }

        $seasonBlock = $xpath->query("ancestor::*[contains(translate(@class,'SEASON','season'),'season')][1]", $node)->item(0);
        if ($seasonBlock) {
            $texts[] = $this->normalizeWhitespace($seasonBlock->textContent);
        }

        $episodeBlock = $xpath->query("ancestor::*[contains(translate(@class,'EPISODE','episode'),'episode')][1]", $node)->item(0);
        if ($episodeBlock) {
            $texts[] = $this->normalizeWhitespace($episodeBlock->textContent);
        }

        return array_values(array_filter($texts));
    }

    private function firstSeasonNumber(array $texts): ?int
    {
        foreach ($texts as $text) {
            $season = $this->parseSeasonNumber($text);
            if ($season !== null) {
                return $season;
            }
            if (preg_match('/\bS(\d{1,2})E(\d{1,3})\b/i', $text, $matches)) {
                return (int) $matches[1];
            }
        }

        return null;
    }

    private function firstEpisodeNumber(array $texts): ?int
    {
        foreach ($texts as $text) {
            $episode = $this->parseEpisodeNumber($text);
            if ($episode !== null) {
                return $episode;
            }
        }

        return null;
    }

    private function firstEpisodeTitle(array $texts): ?string
    {
        foreach ($texts as $text) {
            $title = $this->parseEpisodeTitle($text);
            if ($title !== null) {
                return $title;
            }
        }

        return null;
    }

    private function resolveUrl(string $baseUrl, ?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        $url = trim($url);
        if ($url === '') {
            return null;
        }

        if (Str::contains($url, '://')) {
            return $url;
        }

        $scheme = parse_url($baseUrl, PHP_URL_SCHEME) ?? 'https';
        if (Str::startsWith($url, '//')) {
            return $scheme.':'.$url;
        }

        // Handle URLs missing scheme like "example.com/path"
        if (preg_match('/^[a-z0-9.-]+\.[a-z]{2,}(?:\/|$)/i', $url)) {
            return $scheme.'://'.$url;
        }

        $host = parse_url($baseUrl, PHP_URL_HOST);
        if (! $host) {
            return $url;
        }
        $port = parse_url($baseUrl, PHP_URL_PORT);
        $origin = $scheme.'://'.$host.($port ? ':'.$port : '');

        if (Str::startsWith($url, '/')) {
            return $origin.$url;
        }

        // If the relative path already embeds the host, avoid double-prefixing.
        if (Str::contains($url, $host.'/')) {
            return $scheme.'://'.$url;
        }

        $path = parse_url($baseUrl, PHP_URL_PATH) ?? '/';
        $dir = rtrim(Str::beforeLast($path, '/'), '/');
        $prefix = $dir ? '/'.$dir : '';

        return $origin.$prefix.'/'.$url;
    }
}
