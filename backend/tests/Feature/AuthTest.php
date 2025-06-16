<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Http\Request;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('passport:client', [
            '--personal' => true,
            '--name' => 'Testing Client',
            '--provider' => 'users'
        ]);
    }

    public function authenticated(){
        $user = User::create([
            'name'=>'garfield',
            'email'=>rand(12345, 678910).'@info.com',
            'role'=>User::ADMINISTRADOR,
            'password'=>bcrypt('123456')
        ]);

        $response = $this->post(route('api.auths.login'), [
            'email' => $user->email,
            'password' => '123456'
        ]);

        return $response->json()['access_token'];
    }

    public function test_login(){

        $this->withoutExceptionHandling();
        
        $password = '123456';
        $user = User::create([
        'name'=>'Manolita',
        'email'=>'info@info.com',
        'password'=>bcrypt($password)
        ]);

        $response = $this->post(route('api.auths.login'),[
            'email'=>$user->email, 
            'password'=>$password  
        ]);
            
        $response = $this->post(route('api.auths.login'),[
            'email'=>'info@info.com',
            'password'=>'123456'
        ]);

        $response->assertStatus(200);
        $this->assertArrayHasKey('access_token', $response->json());
    }

    //crear usuario
    public function test_register(){
        $this->withoutExceptionHandling();
        
         $userData = [
            'name'=> 'Manolita',
            'email' => 'info@info.com', 
            'role' => User::ADMINISTRADOR,
            'password' => '123456',
            'password_confirmation' => '123456'
        ];

        $response = $this->post(route('api.auths.register'), $userData);

        $response->assertStatus(200);
        $this->assertArrayHasKey('access_token', $response->json());
        
        $this->assertDatabaseHas('users', [
            'name' => 'Manolita',
            'email' => 'info@info.com',
            'role' => User::ADMINISTRADOR
        ]);
    }
}
   