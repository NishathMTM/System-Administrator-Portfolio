<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_admin')->default(false);
        });

        // Preserve access for the existing portfolio owner without promoting unrelated users.
        DB::table('users')->whereIn('id', DB::table('profiles')->select('user_id'))
            ->update(['is_admin' => true]);

        Schema::table('profiles', function (Blueprint $table) {
            $table->string('about_heading')->nullable();
            $table->text('about_body')->nullable();
            $table->json('skills')->nullable();
            $table->text('experience')->nullable();
            $table->text('education')->nullable();
            $table->text('certifications')->nullable();
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->boolean('is_published')->default(true);
        });
    }

    public function down(): void
    {
        Schema::table('projects', fn (Blueprint $table) => $table->dropColumn('is_published'));
        Schema::table('profiles', fn (Blueprint $table) => $table->dropColumn([
            'about_heading', 'about_body', 'skills', 'experience', 'education', 'certifications',
        ]));
        Schema::table('users', fn (Blueprint $table) => $table->dropColumn('is_admin'));
    }
};
