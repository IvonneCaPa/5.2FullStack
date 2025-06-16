<?php

namespace App\Http\Controllers;

use App\Http\Requests\PhotoRequest;
use Illuminate\Http\Request;
use App\Http\Resources\PhotoResource;
use App\Models\Photo;
use Illuminate\Support\Facades\Storage;

/**
 * @OA\Get(
 *     path="/api/photos",
 *     summary="Obtener todas las fotos",
 *     tags={"Fotos"},
 *     @OA\Response(
 *         response=200,
 *         description="Lista de fotos",
 *         @OA\JsonContent(
 *             @OA\Property(property="photos", type="array", @OA\Items(type="object"))
 *         )
 *     )
 * )
 */
class PhotoController extends Controller
{
    public function index(){
        return response([
            'photos' => PhotoResource::collection(Photo::with('gallery')->get())
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/photos/{photo}",
     *     summary="Obtener una foto específica",
     *     tags={"Fotos"},
     *     @OA\Parameter(
     *         name="photo",
     *         in="path",
     *         required=true,
     *         description="ID de la foto",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detalles de la foto",
     *         @OA\JsonContent(
     *             @OA\Property(property="photo", type="object")
     *         )
     *     )
     * )
     */
    public function show(Photo $photo)
    {
        return response([
            'photo' => new PhotoResource($photo) 
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/photos",
     *     summary="Crear una nueva foto",
     *     tags={"Fotos"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title", "gallery_id"},
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="gallery_id", type="integer"),
     *             @OA\Property(property="location", type="string", format="binary")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Foto subida satisfactoriamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="photo", type="object"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error interno del servidor"
     *     )
     * )
     */
    public function store(PhotoRequest $request)
    {
        try {
            $path = null;
            
            if($request->hasFile('location')){
                $location = $request->file('location');
                $path = $location->store('photos', 'public');
            }

            $photo = Photo::create([
                'title' => $request->title,
                'location' => $path,
                'gallery_id' => $request->gallery_id, 
            ]);

            return response([
                'photo' => new PhotoResource($photo),
                'message' => 'Foto subida satisfactoriamente'
            ]);

        } catch (\Throwable $th) {
            return response([
                'error'=> $th->getMessage()
            ], 500);
        }
    }

    public function update(PhotoRequest $request, Photo $photo)
    {
        try {
            $path = null;
            
            if($request->hasFile('location')){
                $location = $request->file('location');
                $path = $location->store('photos', 'public');
            }

            $photo->gallery_id = $request->gallery_id;
            $photo->title = $request->title;

            if(isset($path)) $photo->location = $path;

            $photo->save();

            return response([
                'photo' => new PhotoResource($photo),
                'message' => 'Foto actualizada satisfactoriamente'
            ]);

        } catch (\Throwable $th) {
            return response([
                'error'=> $th->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/photos/{photo}",
     *     summary="Actualizar una foto",
     *     tags={"Fotos"},
     *     @OA\Parameter(
     *         name="photo",
     *         in="path",
     *         required=true,
     *         description="ID de la foto",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title", "gallery_id"},
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="gallery_id", type="integer"),
     *             @OA\Property(property="location", type="string", format="binary")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Foto actualizada satisfactoriamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="photo", type="object"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error interno del servidor"
     *     )
     * )
     */
    public function destroy(Photo $photo)
    {
        $photo->delete();
        return response([
            'message' => 'Foto eliminada correctamente'
        ], 200);
    }    
}