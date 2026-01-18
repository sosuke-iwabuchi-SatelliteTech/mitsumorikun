<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\UserGroup;
use App\Models\UserGroupDetail;
use App\Services\InvoiceService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceServiceTest extends TestCase
{
    use RefreshDatabase;

    protected InvoiceService $service;

    protected UserGroup $userGroup;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(InvoiceService::class);
        $this->userGroup = UserGroup::create(['name' => 'Test Group']);

        UserGroupDetail::create([
            'user_group_id' => $this->userGroup->id,
            'invoice_company_name' => 'Test Corp',
            'zip_code' => '123-4567',
            'address1' => 'Tokyo',
            'address2' => 'Chiyoda',
            'phone_number' => '03-1234-5678',
            'bank_name' => 'Test Bank',
        ]);
    }

    public function test_can_create_invoice_with_snapshot(): void
    {
        $customer = Customer::create([
            'user_group_id' => $this->userGroup->id,
            'name' => 'Test Customer',
        ]);

        $data = [
            'customer_id' => $customer->id,
            'title' => 'Test Job',
            'estimate_date' => '2026-01-01',
            'details' => [
                [
                    'item_name' => 'Work 1',
                    'quantity' => 2,
                    'unit_price' => 1000,
                    'tax_classification' => 'exclusive',
                    'amount' => 2000,
                ],
            ],
            'total_amount' => 2200,
            'tax_amount' => 200,
        ];

        $invoice = $this->service->create($this->userGroup, $data);

        $this->assertDatabaseHas('invoices', [
            'id' => $invoice->id,
            'issuer_name' => 'Test Corp',
            'bank_name' => 'Test Bank',
            'version' => 1,
            'status' => 'creating',
        ]);

        $this->assertDatabaseHas('invoice_details', [
            'invoice_id' => $invoice->id,
            'item_name' => 'Work 1',
        ]);
    }

    public function test_can_create_revision_with_new_snapshot(): void
    {
        $customer = Customer::create([
            'user_group_id' => $this->userGroup->id,
            'name' => 'Test Customer',
        ]);

        $invoice = $this->service->create($this->userGroup, [
            'customer_id' => $customer->id,
            'title' => 'Test Job',
            'estimate_date' => '2026-01-01',
            'total_amount' => 0,
            'tax_amount' => 0,
        ]);

        // Change company info
        $this->userGroup->detail->update(['invoice_company_name' => 'Updated Corp']);

        $newInvoice = $this->service->createRevision($invoice);

        $this->assertEquals($invoice->estimate_number, $newInvoice->estimate_number);
        $this->assertEquals(1, $invoice->version);
        $this->assertEquals(2, $newInvoice->version);

        $this->assertEquals('Test Corp', $invoice->issuer_name);
        $this->assertEquals('Updated Corp', $newInvoice->issuer_name);
    }

    public function test_truncates_tax_and_total_amount(): void
    {
        $customer = Customer::create([
            'user_group_id' => $this->userGroup->id,
            'name' => 'Test Customer',
        ]);

        $data = [
            'customer_id' => $customer->id,
            'title' => 'Test Rounding',
            'estimate_date' => '2026-01-01',
            'details' => [
                [
                    'item_name' => 'Decimal Item',
                    'quantity' => 1.5,
                    'unit_price' => 1001,
                    'tax_classification' => 'exclusive',
                    'amount' => 1501.5, // 1001 * 1.5 = 1501.5
                ],
            ],
            'total_amount' => 1651.65, // (1501.5) * 1.1 = 1651.65
            'tax_amount' => 150.15,   // 1501.5 * 0.1 = 150.15
        ];

        $invoice = $this->service->create($this->userGroup, $data);

        $this->assertEquals(1501, $invoice->details->first()->amount);
        $this->assertEquals(150, $invoice->tax_amount);
        $this->assertEquals(1651, $invoice->total_amount);
    }

    public function test_truncates_negative_tax_and_total_amount(): void
    {
        $customer = Customer::create([
            'user_group_id' => $this->userGroup->id,
            'name' => 'Test Customer',
        ]);

        $data = [
            'customer_id' => $customer->id,
            'title' => 'Test Negative Rounding',
            'estimate_date' => '2026-01-01',
            'details' => [
                [
                    'item_name' => 'Discount Item',
                    'quantity' => 1,
                    'unit_price' => -100000,
                    'tax_classification' => 'inclusive',
                    'amount' => -100000,
                ],
            ],
            // For inclusive -100,000:
            // Base = -100,000 / 1.1 = -90,909.0909...
            // Tax = -100,000 - (-90,909.0909...) = -9,090.9090...
            // Truncated Tax = -9090
            'total_amount' => -100000,
            'tax_amount' => -9090.9,
        ];

        $invoice = $this->service->create($this->userGroup, $data);

        $this->assertEquals(-9090, $invoice->tax_amount);
        $this->assertEquals(-100000, $invoice->total_amount);
    }
}
