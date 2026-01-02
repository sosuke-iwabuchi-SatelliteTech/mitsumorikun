<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\InvoiceHistory;
use App\Models\UserGroup;
use Illuminate\Support\Facades\DB;

class InvoiceService
{
    public function __construct(
        protected EstimateNumberService $estimateNumberService
    ) {}

    public function create(UserGroup $userGroup, array $data): Invoice
    {
        return DB::transaction(function () use ($userGroup, $data) {
            $detail = $userGroup->detail;

            $invoice = new Invoice();
            $invoice->fill($data);
            $invoice->user_group_id = $userGroup->id;
            $invoice->estimate_number = $this->estimateNumberService->generate($userGroup->id);
            $invoice->version = 1;
            $invoice->status = 'creating';

            // Snapshot from UserGroupDetail
            if ($detail) {
                $invoice->issuer_name = $detail->invoice_company_name;
                $invoice->issuer_registration_number = $detail->invoice_registration_number;
                $invoice->issuer_address = sprintf('〒%s %s%s', $detail->zip_code, $detail->address1, $detail->address2);
                $invoice->issuer_tel = $detail->phone_number;
                $invoice->issuer_fax = $detail->fax_number;

                $invoice->bank_name = $detail->bank_name;
                $invoice->branch_name = $detail->branch_name;
                $invoice->account_type = $detail->account_type;
                $invoice->account_number = $detail->account_number;
                $invoice->account_holder = $detail->account_holder;

                $invoice->japan_post_bank_symbol = $detail->japan_post_bank_symbol;
                $invoice->japan_post_bank_number = $detail->japan_post_bank_number;
                $invoice->japan_post_bank_account_holder = $detail->japan_post_bank_account_holder;
            }

            $invoice->save();

            if (isset($data['details'])) {
                foreach ($data['details'] as $index => $detailData) {
                    $invoice->details()->create(array_merge($detailData, ['display_order' => $index]));
                }
            }

            return $invoice;
        });
    }

    public function update(Invoice $invoice, array $data): Invoice
    {
        return DB::transaction(function () use ($invoice, $data) {
            $invoice->update($data);

            if (isset($data['details'])) {
                $invoice->details()->delete();
                foreach ($data['details'] as $index => $detailData) {
                    $invoice->details()->create(array_merge($detailData, ['display_order' => $index]));
                }
            }

            return $invoice;
        });
    }

    public function createRevision(Invoice $oldInvoice): Invoice
    {
        return DB::transaction(function () use ($oldInvoice) {
            $newInvoice = $oldInvoice->replicate();
            $newInvoice->version = $oldInvoice->version + 1;
            $newInvoice->status = ($oldInvoice->status === 'invoice_submitted') ? 'invoice_creating' : 'creating';
            
            // Re-snapshot from UserGroupDetail to ensure latest info if they changed company settings
            $detail = $oldInvoice->userGroup->detail;
            if ($detail) {
                $newInvoice->issuer_name = $detail->invoice_company_name;
                $newInvoice->issuer_registration_number = $detail->invoice_registration_number;
                $newInvoice->issuer_address = sprintf('〒%s %s%s', $detail->zip_code, $detail->address1, $detail->address2);
                $newInvoice->issuer_tel = $detail->phone_number;
                $newInvoice->issuer_fax = $detail->fax_number;

                $newInvoice->bank_name = $detail->bank_name;
                $newInvoice->branch_name = $detail->branch_name;
                $newInvoice->account_type = $detail->account_type;
                $newInvoice->account_number = $detail->account_number;
                $newInvoice->account_holder = $detail->account_holder;

                $newInvoice->japan_post_bank_symbol = $detail->japan_post_bank_symbol;
                $newInvoice->japan_post_bank_number = $detail->japan_post_bank_number;
                $newInvoice->japan_post_bank_account_holder = $detail->japan_post_bank_account_holder;
            }

            $newInvoice->save();

            foreach ($oldInvoice->details as $detail) {
                $newDetail = $detail->replicate();
                $newDetail->invoice_id = $newInvoice->id;
                $newDetail->save();
            }

            return $newInvoice;
        });
    }

    public function createSnapshot(Invoice $invoice): InvoiceHistory
    {
        return DB::transaction(function () use ($invoice) {
            $history = new InvoiceHistory();
            $attributes = $invoice->getAttributes();
            
            // Set document_type based on status
            $isInvoice = in_array($invoice->status, ['invoice_creating', 'invoice_submitted', 'payment_confirmed']);
            $attributes['document_type'] = $isInvoice ? 'invoice' : 'estimate';
            unset($attributes['status']);

            $history->fill($attributes);
            $history->invoice_id = $invoice->id;
            $history->save();

            foreach ($invoice->details as $detail) {
                $history->details()->create($detail->getAttributes());
            }

            return $history;
        });
    }
}
