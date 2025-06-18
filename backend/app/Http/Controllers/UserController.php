<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Resources\UserResource;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/usuarios",
     *     summary="Obtener usuarios",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de usuarios"
     *     )
     * )
     */
    public function index()
    {
        return response([
            'users' => new UserResource(User::all())
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/usuarios/{user}",
     *     summary="Actualizar un usuario",
     *     tags={"Usuarios"},
     *     @OA\Parameter(
     *         name="user",
     *         in="path",
     *         required=true,
     *         description="ID del usuario",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="password", type="string", format="password")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Usuario actualizado correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error interno del servidor"
     *     )
     * )
     */
    public function update(UpdateUserRequest $request, user $user)
    {
        try {
            $validatedData = $request->validated();

            if (isset($validatedData['password'])) {
                $validatedData['password'] = Hash::make($validatedData['password']);
            }

            if (!auth()->user() || auth()->user()->role !== 'admin') {
                unset($validatedData['role']);
            }

            $user->update($validatedData);

            return response()->json([
                'message' => 'Usuario actualizado correctamente',
                'user' => new UserResource($user)
            ], 200);

        } catch (\Throwable $th) {
            return response([
                'error'=>$th->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/usuarios/{user}",
     *     summary="Eliminar un usuario",
     *     tags={"Usuarios"},
     *     @OA\Parameter(
     *         name="user",
     *         in="path",
     *         required=true,
     *         description="ID del usuario",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Usuario eliminado correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="No puedes eliminarte a ti mismo"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error interno del servidor"
     *     )
     * )
     */
    public function destroy(User $user)
    {
        try {
            if (Auth::id() === $user->id) {
                return response()->json([
                    'error' => 'No puedes eliminarte a ti mismo'
                ], 403);
            }

            $user->delete();

            return response()->json([
                'message' => 'Usuario eliminado correctamente'
            ], 200);

        } catch (\Throwable $th) {
            return response([
                'error'=>$th->getMessage()
            ], 500);
        }
    }
}
