<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Invoice;
use App\Models\User;
use App\Models\UserGroup;
use App\Models\UserGroupDetail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PdfFontTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->userGroup = UserGroup::factory()->create();
        UserGroupDetail::factory()->create([
            'user_group_id' => $this->userGroup->id,
            'pdf_font' => 'ipa',
        ]);
        $this->user = User::factory()->create([
            'user_group_id' => $this->userGroup->id,
            'role' => 'general',
        ]);
    }

    /**
     * Test that pdf_font validation allows 'ipa' and 'klee'.
     */
    public function test_pdf_font_validation_allows_valid_values(): void
    {
        foreach (['ipa', 'klee'] as $font) {
            $response = $this->actingAs($this->user)
                ->post('/group-information/basic', [
                    'pdf_font' => $font,
                ]);

            $response->assertSessionHasNoErrors();
            $this->assertEquals($font, $this->userGroup->detail->fresh()->pdf_font);
        }
    }

    /**
     * Test that pdf_font validation rejects invalid values.
     */
    public function test_pdf_font_validation_rejects_invalid_values(): void
    {
        $response = $this->actingAs($this->user)
            ->post('/group-information/basic', [
                'pdf_font' => 'invalid-font',
            ]);

        $response->assertSessionHasErrors(['pdf_font']);
    }

    /**
     * Test that pdf_font is correctly passed to the PDF view.
     */
    public function test_pdf_font_is_used_in_rendering(): void
    {
        // Set font to klee
        $this->userGroup->detail->update(['pdf_font' => 'klee']);

        $customer = Customer::create([
            'user_group_id' => $this->userGroup->id,
            'name' => 'Test Customer',
        ]);
        $invoice = Invoice::create([
            'user_group_id' => $this->userGroup->id,
            'customer_id' => $customer->id,
            'status' => 'creating',
            'estimate_number' => 'EST-001',
            'title' => 'Test Invoice',
            'estimate_date' => now(),
            'total_amount' => 1000,
            'tax_amount' => 100,
            'issuer_name' => 'Issuer',
        ]);

        // We can check if the font family is set in the rendered view
        // The PDF layout uses $fontFamily variable which is derived from $invoice->userGroup->detail->pdf_font
        $view = view('pdf.estimate', [
            'invoice' => $invoice,
            'details' => $invoice->details,
            'customer' => $customer,
            'is_preview' => true,
        ])->render();

        $this->assertStringContainsString('font-family: \'KleeOne\'', $view);

        // Change back to ipa
        $this->userGroup->detail->update(['pdf_font' => 'ipa']);
        $view = view('pdf.estimate', [
            'invoice' => $invoice,
            'details' => $invoice->details,
            'customer' => $customer,
            'is_preview' => true,
        ])->render();

        $this->assertStringContainsString('font-family: \'IPAexGothic\'', $view);
    }
}
