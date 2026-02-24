<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_seasons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('media_item_id')->constrained('media_items')->cascadeOnDelete();
            $table->unsignedSmallInteger('number')->nullable();
            $table->string('title')->nullable();
            $table->string('url')->nullable();
            $table->json('raw_meta')->nullable();
            $table->timestamps();

            $table->unique(['media_item_id', 'number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_seasons');
    }
};
