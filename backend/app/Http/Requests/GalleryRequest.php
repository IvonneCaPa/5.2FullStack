<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GalleryRequest extends FormRequest
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
        return [
            'title' => 'required|string|max:20',
            'date' => 'required|date',
            'site' => 'required|string|max:45',
        ];
    }

        
    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'El título es obligatorio.',
            'title.string' => 'El título debe ser una cadena de texto.',
            'title.max' => 'El título no puede exceder 20 caracteres.',
            'date.required' => 'La fecha es obligatoria.',
            'date.date' => 'La fecha y hora deben tener un formato válido.',
            'site.string' => 'El sitio debe ser una cadena de texto.',
            'site.max' => 'El sitio no puede exceder 45 caracteres.'
        ];
    }
}
