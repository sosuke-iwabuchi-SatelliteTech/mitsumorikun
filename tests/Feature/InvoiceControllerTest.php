<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Invoice;
use App\Models\User;
use App\Models\UserGroup;
use App\Models\UserGroupDetail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceControllerTest extends TestCase
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

        UserGroupDetail::create([
            'user_group_id' => $this->userGroup->id,
            'invoice_company_name' => 'Test Corp',
        ]);
    }

    public function test_can_update_status_from_creating_to_submitted(): void
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
            'title' => 'Test',
            'estimate_date' => '2026-01-01',
        ]);

        $response = $this->actingAs($this->user)
            ->patch(route('invoices.status', $invoice->id), [
                'status' => 'submitted',
            ]);

        $response->assertRedirect();
        $this->assertEquals('submitted', $invoice->fresh()->status);
    }

    public function test_cannot_create_revision_from_creating_status(): void
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
            'title' => 'Test',
            'estimate_date' => '2026-01-01',
        ]);

        $response = $this->actingAs($this->user)
            ->post(route('invoices.revision', $invoice->id));

        $response->assertSessionHas('error');
        $this->assertEquals(1, Invoice::where('estimate_number', 'TEST01')->count());
    }

    public function test_can_create_revision_from_submitted_status(): void
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
            'status' => 'submitted',
            'title' => 'Test',
            'estimate_date' => '2026-01-01',
        ]);

        $response = $this->actingAs($this->user)
            ->post(route('invoices.revision', $invoice->id));

        $response->assertRedirect();
        $this->assertEquals(2, Invoice::where('estimate_number', 'TEST01')->count());
        $this->assertDatabaseHas('invoices', [
            'estimate_number' => 'TEST01',
            'version' => 2,
            'status' => 'creating',
        ]);
    }

    public function test_index_only_shows_latest_versions(): void
    {
        $customer = Customer::create([
            'user_group_id' => $this->userGroup->id,
            'name' => 'Test Customer',
        ]);

        // Create V1 and V2 of TEST01
        Invoice::create([
            'user_group_id' => $this->userGroup->id,
            'customer_id' => $customer->id,
            'estimate_number' => 'TEST01',
            'version' => 1,
            'status' => 'submitted',
            'title' => 'Test V1',
            'estimate_date' => '2026-01-01',
        ]);
        Invoice::create([
            'user_group_id' => $this->userGroup->id,
            'customer_id' => $customer->id,
            'estimate_number' => 'TEST01',
            'version' => 2,
            'status' => 'creating',
            'title' => 'Test V2',
            'estimate_date' => '2026-01-01',
        ]);

        // Create V1 of TEST02
        Invoice::create([
            'user_group_id' => $this->userGroup->id,
            'customer_id' => $customer->id,
            'estimate_number' => 'TEST02',
            'version' => 1,
            'status' => 'creating',
            'title' => 'Other Test',
            'estimate_date' => '2026-01-01',
        ]);

        $response = $this->actingAs($this->user)->get(route('invoices.index'));

        $response->assertStatus(200);

        // Use Inertia's data to assert
        $invoices = $response->original->getData()['page']['props']['invoices']['data'];

        $this->assertCount(2, $invoices);

        $estimateNumbers = collect($invoices)->pluck('estimate_number');
        $versions = collect($invoices)->pluck('version');

        $this->assertTrue($estimateNumbers->contains('TEST01'));
        $this->assertTrue($estimateNumbers->contains('TEST02'));

        $this->assertTrue($versions->contains(2)); // TEST01 V2
        $this->assertTrue($versions->contains(1)); // TEST02 V1

        $hasTest01V1 = collect($invoices)->contains(fn ($i) => $i['estimate_number'] === 'TEST01' && $i['version'] === 1);
        $this->assertFalse($hasTest01V1, 'Index should not contain historical version (V1) of TEST01');
    }

    public function test_can_reorder_invoice_details(): void
    {
        $customer = Customer::create([
            'user_group_id' => $this->userGroup->id,
            'name' => 'Test Customer',
        ]);

        $invoice = Invoice::create([
            'user_group_id' => $this->userGroup->id,
            'customer_id' => $customer->id,
            'estimate_number' => 'REORDER01',
            'version' => 1,
            'status' => 'creating',
            'title' => 'Reorder Test',
            'estimate_date' => '2026-01-01',
        ]);

        // Create initial details A, B, C
        $invoice->details()->create(['item_name' => 'Item A', 'display_order' => 0]);
        $invoice->details()->create(['item_name' => 'Item B', 'display_order' => 1]);
        $invoice->details()->create(['item_name' => 'Item C', 'display_order' => 2]);

        $this->assertEquals(3, $invoice->details()->count());

        // Update with reordered items (C, A, B)
        $response = $this->actingAs($this->user)
            ->patch(route('invoices.update', $invoice->id), [
                'customer_id' => $customer->id,
                'title' => 'Reorder Test Updated',
                'estimate_date' => '2026-01-01',
                'total_amount' => 0,
                'tax_amount' => 0,
                'details' => [
                    ['item_name' => 'Item C', 'quantity' => 1, 'unit_price' => 100, 'amount' => 100, 'tax_classification' => 'exclusive'],
                    ['item_name' => 'Item A', 'quantity' => 1, 'unit_price' => 100, 'amount' => 100, 'tax_classification' => 'exclusive'],
                    ['item_name' => 'Item B', 'quantity' => 1, 'unit_price' => 100, 'amount' => 100, 'tax_classification' => 'exclusive'],
                ],
            ]);

        $response->assertRedirect();

        $details = $invoice->fresh()->details()->orderBy('display_order')->get();

        $this->assertCount(3, $details);
        $this->assertEquals('Item C', $details[0]->item_name);
        $this->assertEquals(0, $details[0]->display_order);
        $this->assertEquals('Item A', $details[1]->item_name);
        $this->assertEquals(1, $details[1]->display_order);
        $this->assertEquals('Item B', $details[2]->item_name);
        $this->assertEquals(2, $details[2]->display_order);
    }
}
