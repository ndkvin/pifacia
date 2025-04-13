<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::group([
    'prefix' => 'dashboard',
    'as' => 'dashboard.',
    'middleware' => ['auth'],
], function() {
    Route::get('', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('role', \App\Http\Controllers\User\RoleController::class);
});

Route::group([
    'prefix' => 'dashboard',
    'as' => 'dashboard.',
    'middleware' => ['auth', \App\Http\Middleware\IsAdmin::class],
], function() {
    Route::resource('user', \App\Http\Controllers\Admin\UserController::class);
    Route::resource('student', \App\Http\Controllers\Admin\StudentController::class);
    Route::resource('lecturer', \App\Http\Controllers\Admin\LecturerController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
