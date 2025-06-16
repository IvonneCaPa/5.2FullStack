<?php

namespace Database\Seeders;

use App\Models\Gallery;
use App\Models\Photo;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear 10 galerías con 5-10 fotos cada una
        Gallery::factory()
            ->count(4)
            ->has(Photo::factory()->count(5, 10))
            ->create();
    }
}