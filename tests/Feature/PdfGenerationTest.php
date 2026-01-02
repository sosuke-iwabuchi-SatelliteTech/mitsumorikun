<?php

namespace Tests\Feature;

use App\Models\Invoice;
use App\Models\User;
use App\Models\Customer;
use App\Models\UserGroup;
use App\Services\PdfService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PdfGenerationTest extends TestCase
{
    use RefreshDatabase;

    public function test_pdf_service_can_generate_pdf()
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
            'status' => 'creating',
            'title' => 'Test Invoice',
            'estimate_date' => now(),
            'total_amount' => 1000,
            'tax_amount' => 100,
            'issuer_name' => 'Issuer',
        ]);

        $service = new PdfService();
        $pdf = $service->generate($invoice, 'estimate');
        
        $this->assertNotNull($pdf->output());
    }
}
