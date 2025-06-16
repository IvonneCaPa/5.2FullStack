<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Activity>
 */
class ActivityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => substr($this->faker->sentence(), 0, 20),
            'description' => $this->faker->paragraph(),
            'site' => substr($this->faker->sentence(), 0, 45),
            'dateTime' => $this->faker->dateTime(),
        ];
    }
}
