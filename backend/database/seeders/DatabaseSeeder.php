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
        // Crear usuario administrador
        $this->call([
            AdminUserSeeder::class,
        ]);

        // Crear usuarios adicionales
        User::factory(4)->create();

        // Crear actividades
        Activity::factory(20)->create();

        // Crear galerías
        $this->call([
            GallerySeeder::class,
        ]);
    }
}