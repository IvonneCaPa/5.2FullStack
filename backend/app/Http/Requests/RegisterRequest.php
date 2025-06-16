<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;

class RegisterRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
            'password_confirmation' => 'required',
            'role' => 'required|in:' . User::USUARIO . ',' . User::ADMINISTRADOR,
        ];
    }

    public function messages(){
        return [
            'name.required' => 'El nombre es obligatorio',
            'name.string' => 'El nombre debe ser texto',
            'name.max' => 'El nombre no puede tener más de 255 caracteres',
            'email.required' => 'El email es obligatorio',
            'email.email' => 'El formato del email no es el correcto',
            'email.unique' => 'Este email ya está registrado',
            'password.required' => 'El password es obligatorio',
            'password.min' => 'El mínimo para el password son 6 caracteres',
            'password.confirmed' => 'La confirmación del password no coincide',
            'password_confirmation.required' => 'La confirmación del password es obligatoria',
            'role.required' => 'El rol es obligatorio',
            'role.in' => 'El rol debe ser: usuario o administrador',
        ];
    }
}
