<?php

namespace Tests\Unit;

use App\Models\Customer;
use App\Models\FinalizedInvoice;
use App\Models\Invoice;
use App\Models\InvoiceDetail;
use App\Models\UserGroup;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_relationships(): void
    {
        $userGroup = UserGroup::factory()->create();
        $customer = Customer::factory()->create(['user_group_id' => $userGroup->id]);

        $invoice = Invoice::factory()->create([
            'user_group_id' => $userGroup->id,
            'customer_id' => $customer->id,
        ]);

        $detail = InvoiceDetail::create([
            'invoice_id' => $invoice->id,
            'item_name' => 'Detail 1',
        ]);

        $finalized = FinalizedInvoice::create([
            'invoice_id' => $invoice->id,
            'user_group_id' => $userGroup->id,
            'customer_id' => $customer->id,
            'estimate_number' => 'EST-001',
            'version' => 1,
            'document_type' => 'estimate',
            'title' => 'Test Finalized Invoice',
            'estimate_date' => now(),
            'total_amount' => 1000,
            'tax_amount' => 100,
            'issuer_name' => 'Test Issuer',
        ]);

        $this->assertTrue($invoice->userGroup->is($userGroup));
        $this->assertTrue($invoice->customer->is($customer));
        $this->assertTrue($invoice->details->contains($detail));
        $this->assertTrue($invoice->finalizedInvoices->contains($finalized));
    }

    public function test_casts(): void
    {
        $invoice = Invoice::factory()->create([
            'estimate_date' => '2026-01-01',
            'delivery_deadline' => '2026-02-01',
            'expiration_date' => '2026-03-01',
            'total_amount' => 1000.50,
            'tax_amount' => 100.05,
        ]);

        // Dates should be Carbon instances (or formatted strings if cast to date:Y-m-d,
        // but Laravel accessors for date casts usually return Carbon instances if not serialized,
        // HOWEVER, the cast 'date:Y-m-d' actually serializes it to string when toArray/toJson is called,
        // but when accessing the attribute on the model, it returns a Carbon instance).
        // Let's verify what Laravel 11/12 does. Typically 'date' cast returns Carbon. 'date:Y-m-d'
        // instructs serialization format.

        $this->assertInstanceOf(Carbon::class, $invoice->estimate_date);
        $this->assertInstanceOf(Carbon::class, $invoice->delivery_deadline);
        $this->assertInstanceOf(Carbon::class, $invoice->expiration_date);

        $this->assertTrue($invoice->estimate_date->isSameDay('2026-01-01'));

        // Decimal casts
        // Note: 'decimal:2' casts usually return string in PHP because float precision can be wonky,
        // or strict float. Let's check.
        // Actually Laravel decimal cast (as of recent versions) casts to string or float depending on driver,
        // but 'decimal:2' usually means it handles the rounding/formatting.
        // Let's check if it matches expectation.

        // Actually, for assertions, we should compare equality.
        $this->assertEquals(1000.50, $invoice->total_amount);
        $this->assertEquals(100.05, $invoice->tax_amount);
    }
}
