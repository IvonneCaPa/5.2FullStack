<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin123'),
            'role' => User::ADMINISTRADOR,
            'email_verified_at' => now(),
        ]);

        $this->command->info('Usuario administrador creado:');
        $this->command->info('Email: admin@admin.com');
        $this->command->info('Password: admin123');
    }
} 