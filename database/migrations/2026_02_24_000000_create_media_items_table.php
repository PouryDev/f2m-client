<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_items', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('title')->nullable();
            $table->string('slug')->nullable();
            $table->string('url')->unique();
            $table->text('synopsis')->nullable();
            $table->text('poster_url')->nullable();
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('status')->nullable();
            $table->decimal('imdb_rating', 3, 1)->nullable();
            $table->unsignedSmallInteger('duration_minutes')->nullable();
            $table->string('country')->nullable();
            $table->json('raw_meta')->nullable();
            $table->json('raw_head_meta')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_items');
    }
};
