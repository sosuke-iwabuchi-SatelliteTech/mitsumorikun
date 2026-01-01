<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Enums\UserRole;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        abort_if($request->user()->isAdmin(), 403);
        $query = Customer::query();
        $customers = Customer::search($request->get('search'))
            ->filterAndSort($request, ['name', 'contact_person_name', 'email', 'phone_number'], 'name', 'asc');

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'sort_by', 'sort_direction', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        abort_if($request->user()->isAdmin(), 403);
        return Inertia::render('Customers/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        abort_if($request->user()->isAdmin(), 403);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_person_name' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:255',
            'fax_number' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'remarks' => 'nullable|string',
        ]);

        Customer::create($validated);

        return redirect()->route('customers.index')
            ->with('message', '顧客を登録しました。');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Customer $customer): Response
    {
        abort_if($request->user()->isAdmin(), 403);
        return Inertia::render('Customers/Show', [
            'customer' => $customer,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Customer $customer): Response
    {
        abort_if($request->user()->isAdmin(), 403);
        return Inertia::render('Customers/Edit', [
            'customer' => $customer,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer): RedirectResponse
    {
        abort_if($request->user()->isAdmin(), 403);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_person_name' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:255',
            'fax_number' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'remarks' => 'nullable|string',
        ]);

        $customer->update($validated);

        return redirect()->route('customers.index')
            ->with('message', '顧客情報を更新しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Customer $customer): RedirectResponse
    {
        abort_if($request->user()->isAdmin(), 403);
        $customer->delete();

        return redirect()->route('customers.index')
            ->with('message', '顧客を削除しました。');
    }
}
