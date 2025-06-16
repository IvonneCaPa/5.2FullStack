<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Gallery>
 */
class GalleryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => substr($this->faker->sentence(3), 0, 20),
            'date' => $this->faker->date(),
            'site' => substr($this->faker->sentence(3), 0, 45),
        ];
    }
}
