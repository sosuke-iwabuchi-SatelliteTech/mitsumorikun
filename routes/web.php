<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', WelcomeController::class);

Route::get('/dashboard', DashboardController::class)->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::middleware('general')->group(function () {
        Route::resource('customers', \App\Http\Controllers\CustomerController::class);
        Route::resource('invoice-items', \App\Http\Controllers\InvoiceItemController::class);
    });

    // 管理者専用ルート
    Route::middleware('admin')->group(function () {
        Route::get('/admin/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('admin.users.index');
        Route::get('/admin/users/create', [\App\Http\Controllers\Admin\UserController::class, 'create'])->name('admin.users.create');
        Route::post('/admin/users', [\App\Http\Controllers\Admin\UserController::class, 'store'])->name('admin.users.store');

        Route::resource('/admin/user-groups', \App\Http\Controllers\Admin\UserGroupController::class, [
            'as' => 'admin',
        ]);

        Route::post('/impersonate/{user}', [\App\Http\Controllers\ImpersonationController::class, 'store'])->name('impersonate.start');
    });

    // 代理ログイン終了（全ユーザー可能）
    Route::delete('/impersonateLogout', [\App\Http\Controllers\ImpersonationController::class, 'destroy'])->name('impersonate.stop');
});

require __DIR__.'/auth.php';
