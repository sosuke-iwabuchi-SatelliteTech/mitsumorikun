<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoiceRequest;
use App\Models\Invoice;
use App\Models\FinalizedInvoice;
use App\Models\Customer;
use App\Models\InvoiceItem;
use App\Services\InvoiceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function __construct(
        protected InvoiceService $invoiceService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $userGroup = $request->user()->userGroup;
        $invoices = Invoice::where('user_group_id', $userGroup->id)
            ->whereRaw('version = (select max(version) from invoices as i2 where i2.estimate_number = invoices.estimate_number and i2.user_group_id = invoices.user_group_id)')
            ->with('customer')
            ->orderBy('estimate_number', 'desc')
            ->paginate($request->get('per_page', 15));

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Invoices/Create', [
            'customers' => Customer::all(['id', 'name', 'contact_person_name', 'address']),
            'invoiceItems' => InvoiceItem::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(InvoiceRequest $request): RedirectResponse
    {
        $invoice = $this->invoiceService->create($request->user()->userGroup, $request->validated());

        return redirect()->route('invoices.show', $invoice->id)
            ->with('message', '見積を作成しました。');
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice): Response
    {
        $invoice->load(['customer', 'details']);

        $isLatest = !Invoice::where('user_group_id', $invoice->user_group_id)
            ->where('estimate_number', $invoice->estimate_number)
            ->where('version', '>', $invoice->version)
            ->exists();

        $hasFinalized = FinalizedInvoice::where('user_group_id', $invoice->user_group_id)
            ->where('estimate_number', $invoice->estimate_number)
            ->exists();

        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice,
            'isLatest' => $isLatest,
            'hasFinalized' => $hasFinalized,
        ]);
    }

    /**
     * Display the finalized versions of the specified estimate.
     */
    public function finalizedList(Invoice $invoice): Response
    {
        // Get all finalized records for the same estimate
        $finalizedInvoices = FinalizedInvoice::where('user_group_id', $invoice->user_group_id)
            ->where('estimate_number', $invoice->estimate_number)
            ->with('customer')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Invoices/FinalizedList', [
            'invoice' => $invoice,
            'finalizedInvoices' => $finalizedInvoices,
        ]);
    }

    /**
     * Display a specific finalized document snapshot.
     */
    public function showFinalized(Invoice $invoice, FinalizedInvoice $finalized): Response
    {
        $finalized->load(['customer', 'details']);

        return Inertia::render('Invoices/ShowFinalized', [
            'invoice' => $invoice,
            'finalized' => $finalized,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice): Response
    {
        $invoice->load('details');

        return Inertia::render('Invoices/Edit', [
            'invoice' => $invoice,
            'customers' => Customer::all(['id', 'name', 'contact_person_name', 'address']),
            'invoiceItems' => InvoiceItem::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(InvoiceRequest $request, Invoice $invoice): RedirectResponse
    {
        $this->invoiceService->update($invoice, $request->validated());

        return redirect()->route('invoices.show', $invoice->id)
            ->with('message', '見積を更新しました。');
    }

    /**
     * Update status.
     */
    public function updateStatus(Request $request, Invoice $invoice): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:creating,submitted,order_received,rejected,invoice_creating,invoice_submitted,payment_confirmed',
        ]);

        $oldStatus = $invoice->status;
        $newStatus = $validated['status'];

        $invoice->update(['status' => $newStatus]);

        // Create finalized record if moving to submitted status
        if (($oldStatus === 'creating' && $newStatus === 'submitted') ||
            ($oldStatus === 'invoice_creating' && $newStatus === 'invoice_submitted')) {
            $this->invoiceService->finalize($invoice);
        }

        return redirect()->back()->with('success', 'ステータスを更新しました。');
    }

    /**
     * Create a new revision (correction) of the invoice.
     */
    public function revision(Invoice $invoice): RedirectResponse
    {
        if (!in_array($invoice->status, ['submitted', 'invoice_submitted'])) {
            return back()->with('error', '提出済みのステータスからのみ訂正可能です。');
        }

        $newInvoice = $this->invoiceService->createRevision($invoice);

        return redirect()->route('invoices.edit', $newInvoice->id)
            ->with('message', '新しいバージョンの見積を作成しました。内容を修正して保存してください。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice): RedirectResponse
    {
        // Delete all versions of this estimate
        Invoice::where('user_group_id', $invoice->user_group_id)
            ->where('estimate_number', $invoice->estimate_number)
            ->delete();

        return redirect()->route('invoices.index')
            ->with('message', '見積（全バージョン）を削除しました。');
    }
}
