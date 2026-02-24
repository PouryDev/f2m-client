<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('media_episodes', function (Blueprint $table) {
            $table->string('external_key')->nullable()->after('title');
            $table->unique(['media_season_id', 'external_key']);
        });
    }

    public function down(): void
    {
        Schema::table('media_episodes', function (Blueprint $table) {
            $table->dropUnique(['media_season_id', 'external_key']);
            $table->dropColumn('external_key');
        });
    }
};
