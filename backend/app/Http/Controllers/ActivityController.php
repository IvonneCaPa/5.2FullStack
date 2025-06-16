<?php

namespace App\Http\Controllers;

use App\Http\Resources\ActivityResource;
use App\Http\Requests\ActivityRequest;
use App\Models\Activity;

/**
 * @OA\Get(
 *     path="/api/activities",
 *     summary="Obtener todas las actividades",
 *     tags={"Actividades"},
 *     @OA\Response(
 *         response=200,
 *         description="Lista de actividades",
 *         @OA\JsonContent(
 *             @OA\Property(property="activities", type="array", @OA\Items(type="object"))
 *         )
 *     )
 * )
 */

class ActivityController extends Controller
{
    public function index()
    {
        return response([
            'activities'=> ActivityResource::collection(Activity::all())
        ]);
    }

       /**
     * @OA\Get(
     *     path="/api/activities/{activity}",
     *     summary="Obtener una actividad específica",
     *     tags={"Actividades"},
     *     @OA\Parameter(
     *         name="activity",
     *         in="path",
     *         required=true,
     *         description="ID de la actividad",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detalles de la actividad",
     *         @OA\JsonContent(
     *             @OA\Property(property="activity", type="object")
     *         )
     *     )
     * )
     */

    public function show(Activity $activity)
    {
        return response([
            'activity' => new ActivityResource($activity)
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/activities",
     *     summary="Crear una nueva actividad",
     *     tags={"Actividades"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title", "dateTime"},
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="site", type="string"),
     *             @OA\Property(property="dateTime", type="string", format="date-time")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Actividad creada correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="activity", type="object"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error interno del servidor"
     *     )
     * )
     */

    public function store(ActivityRequest $request)
        {
            try {
                $activity = Activity::create($request->all());
                return response([
                    'activity'=> new ActivityResource($activity),
                    'message' => 'Actividad creada correctamente'
                ], 201);
            } catch (\Throwable $th) {
                //throw $th;
                return response([
                    'error'=>$th->getMessage()
                ], 500);
            }
        }
    
    /**
     * @OA\Put(
     *     path="/api/activities/{activity}",
     *     summary="Actualizar una actividad",
     *     tags={"Actividades"},
     *     @OA\Parameter(
     *         name="activity",
     *         in="path",
     *         required=true,
     *         description="ID de la actividad",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Actividad actualizada correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="activity", type="object"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error interno del servidor"
     *     )
     * )
     */

    public function update(ActivityRequest $request, Activity $activity)
    {
        try {
            $activity->update($request->all());
            return response([
                'activity'=> new ActivityResource($activity),
                'message' => 'Actividad actualizada correctamente'
            ], 200);
        } catch (\Throwable $th) {
            return response([
                'error'=>$th->getMessage()
            ], 500);
        }
    }   
    
    /**
     * @OA\Delete(
     *     path="/api/activities/{activity}",
     *     summary="Eliminar una actividad",
     *     tags={"Actividades"},
     *     @OA\Parameter(
     *         name="activity",
     *         in="path",
     *         required=true,
     *         description="ID de la actividad",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Actividad eliminada correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string")
     *         )
     *     )
     * )
     */

    public function destroy(Activity $activity)
    {
        $activity->delete();
        return response([
            'message' => 'Actividad eliminada correctamente'
        ], 200);
    }
}