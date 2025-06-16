<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Activity;
use App\Models\User;

class ActivityTest extends TestCase
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
 
    //ver todas
    public function test_activities_can_be_retrieved()
    {
        $this->withoutExceptionHandling();

        $response = $this->get(route('api.activities.index'));
        $response->assertStatus(200);
        $this->assertArrayHasKey('activities', $response->json());
    }

    // ver una
    public function test_activity_can_be_retrieved()
    {
        $this->withoutExceptionHandling();

        $activity = Activity::create([
            'title'=>'Exposición fotos',
           'description'=>'Exposición fotografica del taller Senegal',
           'site'=>'Centro Civico X',
           'dateTime'=>'2025-08-15 17:00:11'
        ]);

        $response = $this->get(route('api.activities.show', $activity->id));

        $this->assertEquals($activity->title, 'Exposición fotos');
        $this->assertEquals($activity->description, 'Exposición fotografica del taller Senegal');
        $this->assertEquals($activity->site, 'Centro Civico X');
        $this->assertEquals($activity->dateTime, '2025-08-15 17:00:11');

        $response->assertStatus(200);
    }

    //crear
    public function test_a_activity_can_be_created()
    {
        $this->withoutExceptionHandling();

        $token = $this->authenticated();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->post(route('api.activities.store'), [
            'title' => 'Exposición fotos',
            'description' => 'Exposición fotografica del taller Senegal',
            'site' => 'Centro Civico X',
            'dateTime' => '2025-08-15 17:00:11'
        ]);

        $response->assertStatus(201);
        $this->assertCount(1, Activity::all());
    }

    //editar
    public function test_a_activity_can_be_update()
    {
        $this->withoutExceptionHandling();

        $token = $this->authenticated();

        $activity = Activity::create([
            'title' => 'expo',
           'description' => 'descripcion expo',
           'site' => 'galeria',
           'dateTime' => '2025-09-15 17:00:11'
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json'
        ])->put(route('api.activities.update', $activity->id),[
            'title' => 'expo1',
           'description' => 'descripcion expo1',
           'site' => 'galeria1',
           'dateTime' => '2025-10-12 18:00:11'
        ]);

        $updatedActivity = Activity::find($activity->id);

        $this->assertEquals($updatedActivity->title, 'expo1');
        $this->assertEquals($updatedActivity->description, "descripcion expo1");
        $this->assertEquals($updatedActivity->site, 'galeria1');
        $this->assertEquals($updatedActivity->dateTime, '2025-10-12 18:00:11');
        $this->assertArrayHasKey('activity', $response->json());
        $response->assertJsonMissing(['error']);
        $response->assertStatus(200);
    }

    //eliminar
    public function test_a_activity_can_be_delete()
    {
        $this->withoutExceptionHandling();

        $token = $this->authenticated();

        $activity = Activity::create([
            'title' => 'expo',
           'description' => 'descripcion expo',
           'site' => 'galeria',
           'dateTime' => '2025-09-15 17:00:11'
        ]);
        
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json'
        ])->delete(route('api.activities.delete', $activity->id));

        $this->assertCount(0, Activity::all());
        $response->assertStatus(200);
    }
}
