<?php

namespace App\Http\Controllers;

use App\Models\InvoiceItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $items = InvoiceItem::search($request->get('search'))
            ->filterAndSort($request, ['name', 'unit_price', 'quantity'], 'name', 'asc');

        return Inertia::render('InvoiceItems/Index', [
            'items' => $items,
            'filters' => $request->only(['search', 'sort_by', 'sort_direction', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('InvoiceItems/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'quantity' => 'required|numeric|min:0',
            'unit_price' => 'required|numeric',
            'unit' => 'nullable|string|max:50',
            'tax_type' => 'required|in:inc,exc',
            'tax_rate' => 'required|in:8,10',
            'remarks' => 'nullable|string',
        ]);

        InvoiceItem::create($validated);

        return redirect()->route('invoice-items.index')
            ->with('message', '見積項目を登録しました。');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, InvoiceItem $invoiceItem): Response
    {
        return Inertia::render('InvoiceItems/Show', [
            'item' => $invoiceItem,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, InvoiceItem $invoiceItem): Response
    {
        return Inertia::render('InvoiceItems/Edit', [
            'item' => $invoiceItem,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InvoiceItem $invoiceItem): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'quantity' => 'required|numeric|min:0',
            'unit_price' => 'required|numeric',
            'unit' => 'nullable|string|max:50',
            'tax_type' => 'required|in:inc,exc',
            'tax_rate' => 'required|in:8,10',
            'remarks' => 'nullable|string',
        ]);

        $invoiceItem->update($validated);

        return redirect()->route('invoice-items.index')
            ->with('message', '見積項目を更新しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, InvoiceItem $invoiceItem): RedirectResponse
    {
        $invoiceItem->delete();

        return redirect()->route('invoice-items.index')
            ->with('message', '見積項目を削除しました。');
    }
}
