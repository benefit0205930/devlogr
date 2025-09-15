<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);
