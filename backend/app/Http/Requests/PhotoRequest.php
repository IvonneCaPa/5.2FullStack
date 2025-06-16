<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PhotoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'gallery_id' => 'required|integer|exists:galleries,id',
            'title' => 'required|string|max:255',
        ];

        // Si es una creación, requerir location
        if ($this->isMethod('POST')) {
            $rules['location'] = 'required|file|mimes:jpeg,jpg,png,gif,webp|max:10240';
        } else {
            // Si es una actualización, location es opcional
            $rules['location'] = 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:10240';
        }

        return $rules;
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'gallery_id.required' => 'El campo galería es obligatorio.',
            'gallery_id.integer' => 'El ID de la galería debe ser un número entero.',
            'gallery_id.exists' => 'La galería seleccionada no existe.',
            'title.required' => 'El título de la foto es obligatorio.',
            'title.string' => 'El título debe ser una cadena de texto.',
            'title.max' => 'El título no puede tener más de 255 caracteres.',
            'location.required' => 'Debe seleccionar un archivo de imagen.',
            'location.file' => 'El archivo seleccionado no es válido.',
            'location.mimes' => 'El archivo debe ser una imagen (jpeg, jpg, png, gif, webp).',
            'location.max' => 'El archivo no puede ser mayor a 10MB.',
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'gallery_id' => 'galería',
            'title' => 'título',
            'location' => 'imagen',
        ];
    }
}