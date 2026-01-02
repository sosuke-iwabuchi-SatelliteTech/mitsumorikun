<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Invoice;
use App\Models\InvoiceHistory;
use App\Models\User;
use App\Models\UserGroup;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceSnapshotTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected UserGroup $userGroup;

    protected function setUp(): void
    {
        parent::setUp();
        $this->userGroup = UserGroup::create(['name' => 'Test Group']);
        $this->user = User::factory()->create([
            'user_group_id' => $this->userGroup->id,
            'role' => 'general',
        ]);
    }

    public function test_snapshot_is_created_when_status_changes_to_submitted(): void
    {
        $customer = Customer::create([
            'user_group_id' => $this->userGroup->id,
            'name' => 'Test Customer',
        ]);

        $invoice = Invoice::create([
            'user_group_id' => $this->userGroup->id,
            'customer_id' => $customer->id,
            'estimate_number' => 'TEST01',
            'version' => 1,
            'status' => 'creating',
            'title' => 'Test Estimate',
            'estimate_date' => '2026-01-01',
            'total_amount' => 1000,
        ]);

        $invoice->details()->create([
            'item_name' => 'Item 1',
            'quantity' => 1,
            'unit_price' => 1000,
            'amount' => 1000,
        ]);

        $this->actingAs($this->user)
            ->patch(route('invoices.status', $invoice->id), [
                'status' => 'submitted',
            ]);

        $this->assertEquals(1, InvoiceHistory::count());
        $history = InvoiceHistory::first();
        
        $this->assertEquals($invoice->id, $history->invoice_id);
        $this->assertEquals('estimate', $history->document_type);
        $this->assertEquals('Test Estimate', $history->title);
        $this->assertCount(1, $history->details);
        $this->assertEquals('Item 1', $history->details->first()->item_name);
    }

    public function test_history_is_preserved_even_if_live_invoice_is_updated(): void
    {
        $customer = Customer::create([
            'user_group_id' => $this->userGroup->id,
            'name' => 'Test Customer',
        ]);

        $invoice = Invoice::create([
            'user_group_id' => $this->userGroup->id,
            'customer_id' => $customer->id,
            'estimate_number' => 'TEST01',
            'version' => 1,
            'status' => 'creating',
            'title' => 'V1 Title',
            'estimate_date' => '2026-01-01',
        ]);

        // Submit V1 -> Snapshot created
        $this->actingAs($this->user)->patch(route('invoices.status', $invoice->id), ['status' => 'submitted']);
        
        // Update live invoice
        $invoice->update(['title' => 'Updated Title']);
        
        $history = InvoiceHistory::first();
        $this->assertEquals('V1 Title', $history->title);
        $this->assertEquals('Updated Title', $invoice->fresh()->title);
    }
}
