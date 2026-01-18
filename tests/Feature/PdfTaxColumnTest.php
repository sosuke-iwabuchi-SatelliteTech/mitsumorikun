<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Invoice;
use App\Models\InvoiceDetail;
use App\Models\UserGroup;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PdfTaxColumnTest extends TestCase
{
    use RefreshDatabase;

    public function test_tax_column_is_hidden_when_all_items_are_exclusive_in_estimate()
    {
        $userGroup = UserGroup::create(['name' => 'Test Group']);
        $customer = Customer::create([
            'user_group_id' => $userGroup->id,
            'name' => 'Test Customer',
        ]);

        $invoice = Invoice::create([
            'user_group_id' => $userGroup->id,
            'customer_id' => $customer->id,
            'estimate_number' => 'EST-001',
            'version' => 1,
            'status' => 'creating',
            'title' => 'Test Invoice',
            'estimate_date' => now(),
            'total_amount' => 1000,
            'tax_amount' => 100,
            'issuer_name' => 'Issuer',
            'issuer_address' => '123-4567 Address',
            'issuer_tel' => '00-0000-0000',
        ]);

        $detail = new InvoiceDetail([
            'item_name' => 'Item 1',
            'quantity' => 1,
            'unit_price' => 1000,
            'amount' => 1000,
            'tax_classification' => 'exclusive',
        ]);
        $details = collect([$detail]);

        $view = view('pdf.estimate', [
            'invoice' => $invoice,
            'customer' => $customer,
            'details' => $details,
        ])->render();

        $this->assertStringContainsString('width: 42%', $view);
        $this->assertStringNotContainsString('税</th>', $view);
    }

    public function test_tax_column_is_shown_when_at_least_one_item_is_inclusive_in_estimate()
    {
        $userGroup = UserGroup::create(['name' => 'Test Group']);
        $customer = Customer::create([
            'user_group_id' => $userGroup->id,
            'name' => 'Test Customer',
        ]);

        $invoice = Invoice::create([
            'user_group_id' => $userGroup->id,
            'customer_id' => $customer->id,
            'estimate_number' => 'EST-001',
            'version' => 1,
            'status' => 'creating',
            'title' => 'Test Invoice',
            'estimate_date' => now(),
            'total_amount' => 1000,
            'tax_amount' => 100,
            'issuer_name' => 'Issuer',
            'issuer_address' => '123-4567 Address',
            'issuer_tel' => '00-0000-0000',
        ]);

        $detail1 = new InvoiceDetail([
            'item_name' => 'Item 1',
            'quantity' => 1,
            'unit_price' => 500,
            'amount' => 500,
            'tax_classification' => 'exclusive',
        ]);
        $detail2 = new InvoiceDetail([
            'item_name' => 'Item 2',
            'quantity' => 1,
            'unit_price' => 500,
            'amount' => 500,
            'tax_classification' => 'inclusive',
        ]);
        $details = collect([$detail1, $detail2]);

        $view = view('pdf.estimate', [
            'invoice' => $invoice,
            'customer' => $customer,
            'details' => $details,
        ])->render();

        $this->assertStringContainsString('width: 37%', $view);
        $this->assertStringContainsString('税</th>', $view);
    }

    public function test_tax_column_is_hidden_when_all_items_are_exclusive_in_invoice()
    {
        $userGroup = UserGroup::create(['name' => 'Test Group']);
        $customer = Customer::create([
            'user_group_id' => $userGroup->id,
            'name' => 'Test Customer',
        ]);

        $invoice = Invoice::create([
            'user_group_id' => $userGroup->id,
            'customer_id' => $customer->id,
            'estimate_number' => 'EST-001',
            'version' => 1,
            'status' => 'creating',
            'title' => 'Test Invoice',
            'estimate_date' => now(),
            'total_amount' => 1000,
            'tax_amount' => 100,
            'issuer_name' => 'Issuer',
            'issuer_address' => '123-4567 Address',
            'issuer_tel' => '00-0000-0000',
        ]);

        $detail = new InvoiceDetail([
            'item_name' => 'Item 1',
            'quantity' => 1,
            'unit_price' => 1000,
            'amount' => 1000,
            'tax_classification' => 'exclusive',
        ]);
        $details = collect([$detail]);

        $view = view('pdf.invoice', [
            'invoice' => $invoice,
            'customer' => $customer,
            'details' => $details,
        ])->render();

        $this->assertStringContainsString('width: 42%', $view);
        $this->assertStringNotContainsString('税</th>', $view);
    }
}
