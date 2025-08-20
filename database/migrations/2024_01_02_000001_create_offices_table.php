<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('offices', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Office name');
            $table->text('address')->comment('Full office address');
            $table->decimal('latitude', 10, 8)->comment('GPS latitude coordinate');
            $table->decimal('longitude', 11, 8)->comment('GPS longitude coordinate');
            $table->integer('radius')->default(100)->comment('Allowed radius in meters for check-in');
            $table->boolean('is_active')->default(true)->comment('Office status');
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['is_active', 'created_at']);
            $table->index(['latitude', 'longitude']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offices');
    }
};