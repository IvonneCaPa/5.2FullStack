<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Gallery;

class GalleryTest extends TestCase
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
    /**
     * A basic feature test example.
     */
    public function test_galleries_can_be_retrieved()
    {
        $this->withoutExceptionHandling();

        $response = $this->get(route('api.galleries.index'));
        $response->assertStatus(200);
        $this->assertArrayHasKey('galleries', $response->json());
    }
    //ver uno
    public function test_gallery_can_be_retrieved()
    {
        $this->withoutExceptionHandling();

        $gallery = Gallery::create([
            'title' => 'Exposición fotos',
            'date' => '2025-08-15',
            'site' => 'Centro Civico X'
        ]);

        $response = $this->get(route('api.galleries.show', $gallery->id));

        $this->assertEquals($gallery->title, 'Exposición fotos');
        $this->assertEquals($gallery->date->toDateString(), '2025-08-15');
        $this->assertEquals($gallery->site, 'Centro Civico X');
        $this->assertArrayHasKey('gallery', $response->json());

        $response->assertStatus(200);
    }

     //crear
    public function test_a_gallery_can_be_created()
    {
        $this->withoutExceptionHandling();

        $token = $this->authenticated();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->post(route('api.galleries.store'), [
            'title' => 'Exposición 23',
            'date' => '2025-09-15',
            'site' => 'Centro Civico X'
        ]);

        $response->assertStatus(201);
        $this->assertCount(1, Gallery::all());
    }

    //editar
    public function test_a_gallery_can_be_update()
    {
        $this->withoutExceptionHandling();

        $token = $this->authenticated();

        $gallery = Gallery::create([
            'title' => 'expo',
           'site' => 'galeria',
           'date' => '2025-09-15'
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json'
        ])->put(route('api.galleries.update', $gallery->id), [
            'title' => 'expo1',
            'site' => 'galeria1',
            'date' => '2025-10-12'
        ]);

        $updatedGallery = Gallery::find($gallery->id);

        $this->assertEquals($updatedGallery->title, 'expo1');
        $this->assertEquals($updatedGallery->site, 'galeria1');
        $this->assertEquals($updatedGallery->date->toDateString(), '2025-10-12');
        $this->assertArrayHasKey('gallery', $response->json());
        $response->assertJsonMissing(['error']);
        $response->assertStatus(200);
    }

    //eliminar
    public function test_a_gallery_can_be_delete()
    {
        $this->withoutExceptionHandling();

        $token = $this->authenticated();

        $gallery = Gallery::create([
            'title' => 'expo1',
            'site' => 'galeria1',
            'date' => '2025-10-12'
        ]);
        
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json'
        ])->delete(route('api.galleries.delete', $gallery->id));

        $this->assertCount(0, Gallery::all());
        $response->assertStatus(200);
    } 
}