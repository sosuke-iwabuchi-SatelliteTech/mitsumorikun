<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserGroup;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $userGroups = UserGroup::withCount('users')
            ->search($request->get('search'))
            ->filterAndSort($request, ['name', 'users_count'], 'name', 'asc');

        return Inertia::render('Admin/UserGroups/Index', [
            'userGroups' => $userGroups,
            'filters' => $request->only(['search', 'sort_by', 'sort_direction', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/UserGroups/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:user_groups,name',
        ]);

        UserGroup::create($validated);

        return redirect()->route('admin.user-groups.index')
            ->with('message', 'ユーザーグループを作成しました。');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserGroup $userGroup): Response
    {
        return Inertia::render('Admin/UserGroups/Edit', [
            'userGroup' => $userGroup,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserGroup $userGroup): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:user_groups,name,'.$userGroup->id,
        ]);

        $userGroup->update($validated);

        return redirect()->route('admin.user-groups.index')
            ->with('message', 'ユーザーグループを更新しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserGroup $userGroup): RedirectResponse
    {
        if ($userGroup->users()->exists()) {
            return redirect()->back()->with('error', 'ユーザーが所属しているグループは削除できません。');
        }

        $userGroup->delete();

        return redirect()->route('admin.user-groups.index')
            ->with('message', 'ユーザーグループを削除しました。');
    }
}
