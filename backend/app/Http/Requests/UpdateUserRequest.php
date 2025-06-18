<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if ($this->has('role') && (!auth()->user() || auth()->user()->role !== 'admin')) {
            return false;
        }
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
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'email',
                Rule::unique('users')->ignore($this->user->id)
            ],
            'password' => 'sometimes|required|min:6',
            'role' => 'sometimes|required|in:' . User::USUARIO . ',' . User::ADMINISTRADOR,
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio',
            'name.string' => 'El nombre debe ser texto',
            'name.max' => 'El nombre no puede exceder 255 caracteres',
            'email.required' => 'El email es obligatorio',
            'email.email' => 'El formato del email no es el correcto',
            'email.unique' => 'Este email ya está en uso',
            'password.required' => 'El password es obligatorio',
            'password.min' => 'El mínimo para el password son 6 caracteres',
            'role.required' => 'El rol es obligatorio',
            'role.in' => 'El rol debe ser: usuario o administrador',
        ];
    }
}
