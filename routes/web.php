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
        
        Route::resource('invoices', \App\Http\Controllers\InvoiceController::class);
        Route::get('invoices/{invoice}/finalized', [\App\Http\Controllers\InvoiceController::class, 'finalizedList'])->name('invoices.finalized');
        Route::get('invoices/{invoice}/finalized/{finalized}', [\App\Http\Controllers\InvoiceController::class, 'showFinalized'])->name('invoices.finalized.show');
        Route::post('invoices/{invoice}/revision', [\App\Http\Controllers\InvoiceController::class, 'revision'])->name('invoices.revision');
        Route::patch('invoices/{invoice}/status', [\App\Http\Controllers\InvoiceController::class, 'updateStatus'])->name('invoices.status');

        Route::get('invoices/{invoice}/preview', [\App\Http\Controllers\PdfController::class, 'preview'])->name('invoices.preview');
        Route::get('invoices/{invoice}/download', [\App\Http\Controllers\PdfController::class, 'download'])->name('invoices.download');
        Route::get('finalized-invoices/{finalizedInvoice}/preview', [\App\Http\Controllers\PdfController::class, 'previewFinalized'])->name('finalized-invoices.preview');
        Route::get('finalized-invoices/{finalizedInvoice}/download', [\App\Http\Controllers\PdfController::class, 'downloadFinalized'])->name('finalized-invoices.download');

        Route::get('/group-information', [\App\Http\Controllers\GroupInformationController::class, 'edit'])->name('group-information.edit');
    Route::patch('/group-information/basic', [\App\Http\Controllers\GroupInformationController::class, 'updateBasic'])->name('group-information.update-basic');
    Route::patch('/group-information/account', [\App\Http\Controllers\GroupInformationController::class, 'updateAccount'])->name('group-information.update-account');
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
