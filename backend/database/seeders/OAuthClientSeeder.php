<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Laravel\Passport\ClientRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OAuthClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $uuid = (string) Str::uuid();
        // Crear el cliente personal
        DB::table('oauth_clients')->insert([
            'id' => $uuid,
            'name' => 'Personal Access Client',
            'secret' => null,
            'provider' => null,
            'redirect_uris' => 'http://localhost',
            'grant_types' => 'personal_access',
            'revoked' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Crear el registro en oauth_personal_access_clients
        DB::table('oauth_personal_access_clients')->insert([
            'client_id' => $uuid,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
