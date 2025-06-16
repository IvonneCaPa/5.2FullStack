<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\User;


use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(4)->create();

        Activity::factory(20)->create();

        $this->call([
            GallerySeeder::class,
        ]);
    }
}