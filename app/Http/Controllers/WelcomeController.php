<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;

class WelcomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): RedirectResponse
    {
        return response()->redirectTo(route('dashboard'));
    }
}
