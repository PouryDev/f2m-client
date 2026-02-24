<?php

use App\Http\Controllers\AdminMediaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FavoritesController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\WatchlistController;
use Illuminate\Support\Facades\Route;

Route::get('/media', [MediaController::class, 'index']);
Route::get('/media/{id}', [MediaController::class, 'show']);
Route::match(['GET', 'HEAD'], '/stream/{id}', [MediaController::class, 'stream']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'me']);
    Route::get('/progress', [MediaController::class, 'progressShow']);
    Route::get('/progress/list', [MediaController::class, 'progressList']);
    Route::get('/progress/latest', [MediaController::class, 'progressLatest']);
    Route::post('/progress', [MediaController::class, 'progressSave']);
    Route::delete('/progress', [MediaController::class, 'progressDelete']);
    Route::get('/stats/overview', [StatsController::class, 'overview']);
    Route::get('/watchlist', [WatchlistController::class, 'index']);
    Route::post('/watchlist', [WatchlistController::class, 'store']);
    Route::delete('/watchlist', [WatchlistController::class, 'destroy']);
    Route::get('/favorites', [FavoritesController::class, 'index']);
    Route::post('/favorites', [FavoritesController::class, 'store']);
    Route::delete('/favorites', [FavoritesController::class, 'destroy']);
    Route::get('/admin/media', [AdminMediaController::class, 'index']);
    Route::post('/admin/media', [AdminMediaController::class, 'create']);
    Route::post('/admin/media/{id}/refresh', [AdminMediaController::class, 'refresh']);
    Route::post('/admin/media/{id}/poster', [AdminMediaController::class, 'updatePoster']);
});
Route::options('/stream/{id}', function () {
    return response('', 204)->withHeaders([
        'Access-Control-Allow-Origin' => '*',
        'Access-Control-Allow-Methods' => 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers' => 'Range, Content-Type, Origin, Accept',
        'Access-Control-Max-Age' => '86400',
    ]);
});
