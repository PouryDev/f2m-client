<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_progress', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('media_id');
            $table->unsignedBigInteger('episode_id')->nullable();
            $table->float('seconds')->default(0);
            $table->timestamps();

            $table->index(['media_id', 'episode_id']);
            $table->unique(['media_id', 'episode_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_progress');
    }
};
