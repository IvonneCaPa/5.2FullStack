<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;


class Activity extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

       protected $fillable = [
           'title',
           'description',
           'site',
           'dateTime'
       ];
}
