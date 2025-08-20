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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('office_id')->constrained()->onDelete('cascade');
            $table->timestamp('check_in')->comment('Check-in timestamp');
            $table->timestamp('check_out')->nullable()->comment('Check-out timestamp');
            $table->decimal('check_in_lat', 10, 8)->comment('Check-in GPS latitude');
            $table->decimal('check_in_lng', 11, 8)->comment('Check-in GPS longitude');
            $table->decimal('check_out_lat', 10, 8)->nullable()->comment('Check-out GPS latitude');
            $table->decimal('check_out_lng', 11, 8)->nullable()->comment('Check-out GPS longitude');
            $table->integer('check_in_distance')->comment('Distance from office in meters at check-in');
            $table->integer('check_out_distance')->nullable()->comment('Distance from office in meters at check-out');
            $table->integer('work_duration')->nullable()->comment('Work duration in minutes');
            $table->text('notes')->nullable()->comment('Additional notes');
            $table->enum('status', ['active', 'completed'])->default('active')->comment('Attendance status');
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['user_id', 'check_in']);
            $table->index(['office_id', 'check_in']);
            $table->index(['status', 'check_in']);
            $table->index('check_in');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};