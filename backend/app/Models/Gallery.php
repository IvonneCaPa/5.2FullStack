<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Gallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'date',
        'site',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
    ];

    /**
     * Get the date format for storage.
     *
     * @return string
     */
    protected function serializeDate($date)
    {
        return $date->format('Y-m-d');
    }

    /**
     * Get the images for the gallery.
     */
    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class);
    }
}