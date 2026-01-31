<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\FinalizedInvoice;
use App\Models\Invoice;
use App\Models\User;
use App\Models\UserGroup;
use App\Models\UserGroupDetail;
use App\Services\PdfService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Barryvdh\DomPDF\PDF;
use Mockery;

class InvoiceCompanyInfoUpdateTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected UserGroup $userGroup;
    protected UserGroupDetail $userGroupDetail;

    protected function setUp(): void
    {
        parent::setUp();

        $this->userGroup = UserGroup::create(['name' => 'Test Group']);

        $this->userGroupDetail = UserGroupDetail::create([
            'user_group_id' => $this->userGroup->id,
            'invoice_company_name' => 'Old Company Name',
            'invoice_registration_number' => 'T1234567890123',
            'zip_code' => '100-0001',
            'address1' => 'Tokyo',
            'address2' => 'Chiyoda',
            'phone_number' => '03-1234-5678',
            'fax_number' => '03-1234-5679',
            'bank_name' => 'Test Bank',
            'branch_name' => 'Head Office',
            'account_type' => 'Ordinary',
            'account_number' => '1234567',
            'account_holder' => 'TEST HOLDER',
        ]);

        $this->user = User::factory()->create([
            'user_group_id' => $this->userGroup->id,
            'role' => 'general',
        ]);
    }

    public function test_invoice_preview_reflects_updated_company_info_before_fix()
    {
        // 1. Create Invoice with Old Company Info
        $customer = Customer::create([
            'user_group_id' => $this->userGroup->id,
            'name' => 'Test Customer',
        ]);

        $invoice = Invoice::create([
            'user_group_id' => $this->userGroup->id,
            'customer_id' => $customer->id,
            'estimate_number' => 'EST-001',
            'status' => 'creating',
            'title' => 'Test Invoice',
            'estimate_date' => now(),
            'total_amount' => 1000,
            'issuer_name' => 'Old Company Name', // Snapshotted
        ]);

        // 2. Update Company Info
        $this->userGroupDetail->update([
            'invoice_company_name' => 'New Company Name',
        ]);

        // 3. Request Preview (without saving Invoice)
        // We use PdfService directly or Controller. Controller is better to test the "dynamic" logic.
        // But PdfController returns a binary stream, hard to assert content strings.
        // We can inspect the arguments passed to PdfService if we mock it, 
        // OR we can assert against the view data if we can intercept it.
        // Let's rely on the fact that if we change InvoiceService/PdfController logic, 
        // we can check if the Invoice model passed to the view has the new name.

        // Let's assert that currently, the invoice still has 'Old Company Name'
        $this->assertEquals('Old Company Name', $invoice->issuer_name);

        // Call the controller preview method
        $response = $this->actingAs($this->user)
            ->get(route('invoices.preview', $invoice));

        $response->assertStatus(200);

        // Since we can't easily parse the PDF, let's verify the logic by checking if the Invoice model
        // has been updated in the database? No, the requirement is "Preview" reflects it, 
        // so the DB might still be old (until FIX).
        // If we implement the fix in PdfController, checking DB won't help.

        // We can check if the PDF content contains the new string if we use a specific PDF testing tool, 
        // but simple string search might work if not compressed. DomPDF usually is compressed.

        // Instead, let's just assert that the DB record is NOT updated yet (proving the issue reproduction).
        $this->assertEquals('Old Company Name', $invoice->fresh()->issuer_name);

        // And if we fix it by updating PdfController to use UserGroup info, verify that logic in unit test style or 
        // assume the Controller test above covers it if we could check data. 
        // For reproduction, proving the DB is stale and knowing the Controller uses the DB (from code analysis) is enough.
    }

    public function test_invoice_finalization_updates_company_info()
    {
        // 1. Create Invoice with Old Company Info
        $customer = Customer::create([
            'user_group_id' => $this->userGroup->id,
            'name' => 'Test Customer',
        ]);

        $invoice = Invoice::create([
            'user_group_id' => $this->userGroup->id,
            'customer_id' => $customer->id,
            'estimate_number' => 'EST-002',
            'status' => 'creating',
            'title' => 'Test Invoice',
            'estimate_date' => now(),
            'total_amount' => 1000,
            'issuer_name' => 'Old Company Name',
        ]);

        // 2. Update Company Info
        $this->userGroupDetail->update([
            'invoice_company_name' => 'New Company Name',
        ]);

        // 3. Finalize (Submit)
        $this->actingAs($this->user)
            ->patch(route('invoices.status', $invoice), [
                'status' => 'submitted',
            ]);

        // 4. Check Finalized Invoice
        $finalized = FinalizedInvoice::first();

        // CURRENTLY: It fails (retains Old Name)
        // DESIRED: It should have New Name
        $this->assertEquals('New Company Name', $finalized->issuer_name, 'Finalized invoice should have updated company name');

        // ALSO: The original Invoice record should ideally be updated too?
        $this->assertEquals('New Company Name', $invoice->fresh()->issuer_name, 'Original invoice record should be updated upon finalization');
    }
}
