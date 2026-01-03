<?php

namespace Tests\Feature;

use App\Models\Invoice;
use App\Models\User;
use App\Models\Customer;
use App\Models\UserGroup;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PdfFilenameTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $userGroup;
    protected $customer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->userGroup = UserGroup::create(['name' => 'Test Group']);
        $this->user = User::factory()->create([
            'role' => \App\Enums\UserRole::GENERAL,
            'user_group_id' => $this->userGroup->id,
        ]);
        $this->customer = Customer::create([
            'user_group_id' => $this->userGroup->id,
            'name' => 'Test Customer',
        ]);
    }

    public function test_estimate_download_filename_format()
    {
        $invoice = Invoice::create([
            'user_group_id' => $this->userGroup->id,
            'customer_id' => $this->customer->id,
            'estimate_number' => 'EST-001',
            'status' => 'submitted',
            'title' => 'テスト見積',
            'estimate_date' => now(),
            'total_amount' => 1000,
            'tax_amount' => 100,
            'issuer_name' => 'Issuer',
        ]);

        $response = $this->actingAs($this->user)->get(route('invoices.download', $invoice));

        $filename = "見積書[EST-001]テスト見積.pdf";
        $encodedFilename = "filename*=utf-8''" . rawurlencode($filename);

        $response->assertStatus(200);
        $this->assertStringContainsString($encodedFilename, $response->headers->get('Content-Disposition'));
    }

    public function test_invoice_download_filename_format()
    {
        $invoice = Invoice::create([
            'user_group_id' => $this->userGroup->id,
            'customer_id' => $this->customer->id,
            'estimate_number' => 'INV-002',
            'status' => 'invoice_submitted',
            'title' => 'テスト請求',
            'estimate_date' => now(),
            'total_amount' => 2000,
            'tax_amount' => 200,
            'issuer_name' => 'Issuer',
        ]);

        $response = $this->actingAs($this->user)->get(route('invoices.download', $invoice));

        $filename = "請求書[INV-002]テスト請求.pdf";
        $encodedFilename = "filename*=utf-8''" . rawurlencode($filename);

        $response->assertStatus(200);
        $this->assertStringContainsString($encodedFilename, $response->headers->get('Content-Disposition'));
    }

    public function test_finalized_invoice_download_filename_format()
    {
        $invoice = Invoice::create([
            'user_group_id' => $this->userGroup->id,
            'customer_id' => $this->customer->id,
            'estimate_number' => 'EST-003',
            'status' => 'submitted',
            'title' => '確定テスト',
            'estimate_date' => now(),
            'total_amount' => 3000,
            'tax_amount' => 300,
            'issuer_name' => 'Issuer',
        ]);

        $finalized = \App\Models\FinalizedInvoice::create([
            'invoice_id' => $invoice->id,
            'user_group_id' => $this->userGroup->id,
            'customer_id' => $this->customer->id,
            'estimate_number' => 'EST-003',
            'version' => 1,
            'document_type' => 'estimate',
            'title' => '確定テスト',
            'estimate_date' => now(),
            'total_amount' => 3000,
            'tax_amount' => 300,
            'issuer_name' => 'Issuer',
        ]);

        $response = $this->actingAs($this->user)->get(route('finalized-invoices.download', $finalized));

        $filename = "見積書[EST-003]確定テスト.pdf";
        $encodedFilename = "filename*=utf-8''" . rawurlencode($filename);

        $response->assertStatus(200);
        $this->assertStringContainsString($encodedFilename, $response->headers->get('Content-Disposition'));
    }

    public function test_cannot_download_pdf_for_payment_confirmed_status()
    {
        $invoice = Invoice::create([
            'user_group_id' => $this->userGroup->id,
            'customer_id' => $this->customer->id,
            'estimate_number' => 'INV-RESTRICT',
            'status' => 'payment_confirmed',
            'title' => '制限テスト',
            'estimate_date' => now(),
            'total_amount' => 5000,
            'tax_amount' => 500,
            'issuer_name' => 'Issuer',
        ]);

        $response = $this->actingAs($this->user)->get(route('invoices.download', $invoice));
        $response->assertStatus(403);

        $response = $this->actingAs($this->user)->get(route('invoices.preview', $invoice));
        $response->assertStatus(403);
    }
}
