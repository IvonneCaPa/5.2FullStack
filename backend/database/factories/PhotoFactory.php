<?php

namespace Database\Factories;

use App\Models\Gallery;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\File;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Photo>
 */
class PhotoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Obtener la lista de fotos reales en storage/app/public/photos/
        $photosPath = storage_path('app/public/photos');
        $photoFiles = [];
        
        if (File::exists($photosPath)) {
            $photoFiles = File::files($photosPath);
        }
        
        // Si hay fotos reales, usar una al azar
        if (!empty($photoFiles)) {
            $randomPhoto = $this->faker->randomElement($photoFiles);
            $location = 'photos/' . $randomPhoto->getFilename();
        } else {
            // Fallback: usar un nombre ficticio si no hay fotos
            $location = 'photos/' . $this->faker->uuid() . '.jpg';
        }

        return [
            'gallery_id' => Gallery::factory(),
            'title' => substr($this->faker->sentence(), 0, 20),
            'location' => $location,
        ];
    }
}