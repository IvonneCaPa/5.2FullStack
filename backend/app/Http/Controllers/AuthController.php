<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

/**
 * @OA\Post(
 *     path="/api/auths/login",
 *     summary="Iniciar sesión",
 *     tags={"Autenticación"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"email", "password"},
 *             @OA\Property(property="email", type="string", format="email"),
 *             @OA\Property(property="password", type="string", format="password")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Login exitoso",
 *         @OA\JsonContent(
 *             @OA\Property(property="user", type="object"),
 *             @OA\Property(property="access_token", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Autenticación fallida"
 *     )
 * )
 */

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $validatedData = $request->validated();
        
        if (!Auth::attempt($validatedData)) {
            return response([
                'message' => 'La autenticación ha fallado'
            ], 401);
        }

        $user = Auth::user();
        $access_token = $user->createToken('Auth_token')->accessToken;
        
        return response([
            'user' => [
                'id'=>$user->id,
                'name'=>$user->name,
                'email'=>$user->email,
                'role'=>$user->role,
            ],
            'access_token' => $access_token
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/auths/register",
     *     summary="Registrar un nuevo usuario",
     *     tags={"Autenticación"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "email", "password", "password_confirmation", "role"},
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="password", type="string", format="password"),
     *             @OA\Property(property="password_confirmation", type="string", format="password"),
     *             @OA\Property(property="role", type="string", enum={"usuario", "administrador"})
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Registro exitoso",
     *         @OA\JsonContent(
     *             @OA\Property(property="user", type="object"),
     *             @OA\Property(property="access_token", type="string")
     *         )
     *     )
     * )
     */
    public function register(RegisterRequest $request)
        {
        $user = User::create($request->all());
        $access_token = $user->createToken('Auth_token')->accessToken;

        return response([
            'user'=> $user,
            'access_token' => $access_token
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/auths/user",
     *     summary="Obtener información del usuario autenticado",
     *     tags={"Autenticación"},
     *     @OA\Response(
     *         response=200,
     *         description="Información del usuario",
     *         @OA\JsonContent(
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="No autenticado"
     *     )
     * )
     */
    public function user(){
        try {
            $token = request()->bearerToken();
            if (!$token) {
                return response([
                    'message' => 'Token no proporcionado'
                ], 401);
            }

            $user = Auth::user();
            if (!$user) {
                return response([
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

        return response([
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response([
                'message' => 'Error al obtener el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
