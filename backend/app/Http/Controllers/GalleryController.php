<?php

namespace App\Http\Controllers;

use App\Http\Resources\ActivityResource;
use Illuminate\Http\Request;
use App\Http\Resources\GalleryResource;
use App\Models\Gallery;
use App\Http\Requests\GalleryRequest;

/**
 * @OA\Get(
 *     path="/api/galleries",
 *     summary="Obtener todas las galerías",
 *     tags={"Galerías"},
 *     @OA\Response(
 *         response=200,
 *         description="Lista de galerías",
 *         @OA\JsonContent(
 *             @OA\Property(property="galleries", type="array", @OA\Items(type="object"))
 *         )
 *     )
 * )
 */
class GalleryController extends Controller
{
    public function index()
    {
        return response([
            'galleries'=> GalleryResource::collection(Gallery::all())
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/galleries/{gallery}",
     *     summary="Obtener una galería específica",
     *     tags={"Galerías"},
     *     @OA\Parameter(
     *         name="gallery",
     *         in="path",
     *         required=true,
     *         description="ID de la galería",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detalles de la galería",
     *         @OA\JsonContent(
     *             @OA\Property(property="gallery", type="object")
     *         )
     *     )
     * )
     */
    public function show(Gallery $gallery)
    {
        return response([
            'gallery'=> new GalleryResource($gallery)
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/galleries",
     *     summary="Crear una nueva galería",
     *     tags={"Galerías"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Galería creada correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="gallery", type="object"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error interno del servidor"
     *     )
     * )
     */
    public function store(GalleryRequest $request)
    {
        try {
            $gallery = Gallery::create($request->all());
            return response([
                'gallery'=> new GalleryResource($gallery),
                'message' => 'Galeria creada correctamente'
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
     *     path="/api/galleries/{gallery}",
     *     summary="Actualizar una galería",
     *     tags={"Galerías"},
     *     @OA\Parameter(
     *         name="gallery",
     *         in="path",
     *         required=true,
     *         description="ID de la galería",
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
     *         description="Galería actualizada correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="gallery", type="object"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error interno del servidor"
     *     )
     * )
     */
    public function update(GalleryRequest $request, Gallery $gallery) {
        try {
            $gallery->update($request->all());
            return response([
                'gallery'=> new GalleryResource($gallery),
                'message' => 'Galería actualizada correctamente'
            ], 200);
        } catch (\Throwable $th) {
            return response([
                'error'=>$th->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/galleries/{gallery}",
     *     summary="Eliminar una galería",
     *     tags={"Galerías"},
     *     @OA\Parameter(
     *         name="gallery",
     *         in="path",
     *         required=true,
     *         description="ID de la galería",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Galería eliminada correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string")
     *         )
     *     )
     * )
     */
    public function destroy(Gallery $gallery)
    {
        $gallery->delete();
        return response([
            'message' => 'Galeria eliminada correctamente'
        ], 200);
    }  
}
