<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin accounts must be created explicitly with a private password.
        $this->command?->info('Run php artisan portfolio:admin your@email.com --name="Your Name" to create an administrator.');
    }
}