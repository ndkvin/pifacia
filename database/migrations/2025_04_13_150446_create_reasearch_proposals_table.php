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
        Schema::create('reasearch_proposals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('student_id'); 
            $table->uuid('lecturer_id');   
            $table->string('title');
            $table->json('keywords')->nullable();
            $table->string('file_path');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->foreign('lecturer_id')->references('id')->on('lecturers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reasearch_proposals');
    }
};
