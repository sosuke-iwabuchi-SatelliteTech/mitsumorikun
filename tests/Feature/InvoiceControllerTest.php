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
        
        $hasTest01V1 = collect($invoices)->contains(fn($i) => $i['estimate_number'] === 'TEST01' && $i['version'] === 1);
        $this->assertFalse($hasTest01V1, 'Index should not contain historical version (V1) of TEST01');
    }
}
