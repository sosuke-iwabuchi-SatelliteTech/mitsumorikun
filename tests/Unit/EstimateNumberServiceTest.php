<?php

namespace Tests\Unit;

use App\Models\Invoice;
use App\Models\UserGroup;
use App\Services\EstimateNumberService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EstimateNumberServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_generate_returns_valid_format(): void
    {
        $service = new EstimateNumberService();
        $userGroup = UserGroup::factory()->create();

        $number = $service->generate($userGroup->id);

        $this->assertEquals(6, strlen($number));
        // Note: Str::random(2) produces alphanumeric string, then strtoupper uppercases letters.
        // But digits are valid in Str::random.
        // So prefix can contain digits.
        $this->assertMatchesRegularExpression('/^[A-Z0-9]{2}[0-9]{4}$/', $number);
    }

    public function test_generate_returns_unique_numbers(): void
    {
        $service = new EstimateNumberService();
        $userGroup = UserGroup::factory()->create();

        $number1 = $service->generate($userGroup->id);

        // Persist the first number to force the check to see it
        Invoice::factory()->create([
            'user_group_id' => $userGroup->id,
            'estimate_number' => $number1,
        ]);

        $number2 = $service->generate($userGroup->id);

        $this->assertNotEquals($number1, $number2);
        $this->assertMatchesRegularExpression('/^[A-Z0-9]{2}[0-9]{4}$/', $number2);
    }
}
