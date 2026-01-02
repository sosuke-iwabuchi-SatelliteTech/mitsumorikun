<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class ImpersonationController extends Controller
{
    /**
     * Start impersonating a user.
     */
    public function store(User $user): RedirectResponse
    {
        if (Auth::id() === $user->id) {
            return redirect()->back()->with('error', '自分自身を代理ログインすることはできません。');
        }

        session(['impersonator_id' => Auth::id()]);
        Auth::login($user);

        return redirect()->route('dashboard')->with('message', "{$user->name} としてログインしました。");
    }

    /**
     * Stop impersonating and return to the original user.
     */
    public function destroy(): RedirectResponse
    {
        if (! session()->has('impersonator_id')) {
            return redirect()->route('dashboard');
        }

        $impersonatorId = session()->pull('impersonator_id');
        $originalUser = User::find($impersonatorId);

        if ($originalUser) {
            Auth::login($originalUser);

            return redirect()->route('admin.users.index')->with('message', '管理者に戻りました。');
        }

        return redirect()->route('dashboard');
    }
}
