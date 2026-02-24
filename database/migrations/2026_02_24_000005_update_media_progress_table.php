<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('media_progress', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
            $table->float('duration_seconds')->default(0)->after('seconds');
            $table->float('last_percent')->default(0)->after('duration_seconds');
            $table->unsignedInteger('completed_70_count')->default(0)->after('last_percent');
            $table->float('total_watch_seconds')->default(0)->after('completed_70_count');
        });

        Schema::table('media_progress', function (Blueprint $table) {
            $table->dropUnique(['media_id', 'episode_id']);
            $table->index(['user_id', 'media_id', 'episode_id']);
            $table->unique(['user_id', 'media_id', 'episode_id']);
        });
    }

    public function down(): void
    {
        Schema::table('media_progress', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'media_id', 'episode_id']);
            $table->dropIndex(['user_id', 'media_id', 'episode_id']);
            $table->unique(['media_id', 'episode_id']);
            $table->dropColumn([
                'user_id',
                'duration_seconds',
                'last_percent',
                'completed_70_count',
                'total_watch_seconds',
            ]);
        });
    }
};
