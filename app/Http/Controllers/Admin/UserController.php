<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\UserGroup;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    /**
     * Display a listing of all users.
     */
    public function index(Request $request): Response
    {
        $users = User::with('userGroup')
            ->search($request->get('search'))
            ->filterAndSort($request, ['name', 'email', 'role'], 'name', 'asc');

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'sort_by', 'sort_direction', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        $userGroups = UserGroup::orderBy('name')->get();

        return Inertia::render('Admin/Users/Create', [
            'userGroups' => $userGroups,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'user_group_id' => 'required|exists:user_groups,id',
            'role' => 'required|string|in:admin,general',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_group_id' => $request->user_group_id,
            'role' => $request->role,
        ]);

        return redirect()->route('admin.users.index')
            ->with('message', 'ユーザーを作成しました。');
    }
}
