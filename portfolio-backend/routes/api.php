<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\ContactController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:admin-login');
Route::get('/profile', [ProfileController::class, 'show']);
Route::apiResource('projects', ProjectController::class)->only(['index', 'show']);
Route::apiResource('blogs', BlogController::class)->only(['index', 'show']);
Route::post('/contact', [ContactController::class, 'store']);

// Protected routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/admin/projects', [ProjectController::class, 'adminIndex']);
    Route::get('/admin/projects/{id}', [ProjectController::class, 'adminShow'])->whereNumber('id');
    Route::get('/admin/blogs', [BlogController::class, 'adminIndex']);
    Route::get('/admin/blogs/{id}', [BlogController::class, 'adminShow'])->whereNumber('id');

    Route::post('/profile', [ProfileController::class, 'update']); // Update profile
    Route::apiResource('projects', ProjectController::class)->except(['index', 'show']);
    Route::apiResource('blogs', BlogController::class)->except(['index', 'show']);
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::patch('/contacts/{contact}/read', [ContactController::class, 'markAsRead']);
    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy']);
});
