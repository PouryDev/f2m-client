<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('download_links', function (Blueprint $table) {
            $table->id();
            $table->string('downloadable_type');
            $table->unsignedBigInteger('downloadable_id');
            $table->string('language')->nullable();
            $table->string('quality')->nullable();
            $table->string('format')->nullable();
            $table->text('url');
            $table->string('label')->nullable();
            $table->string('source')->nullable();
            $table->string('size')->nullable();
            $table->json('raw_meta')->nullable();
            $table->timestamps();

            $table->index(['downloadable_type', 'downloadable_id']);
            $table->unique(['downloadable_type', 'downloadable_id', 'url']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('download_links');
    }
};
