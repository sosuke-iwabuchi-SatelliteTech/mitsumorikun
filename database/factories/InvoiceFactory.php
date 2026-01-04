<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\UserGroup;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_group_id' => UserGroup::factory(),
            'customer_id' => Customer::factory(),
            'estimate_number' => $this->faker->unique()->regexify('[A-Z]{2}[0-9]{4}'),
            'version' => 1,
            'status' => 'creating',
            'title' => $this->faker->sentence(),
            'estimate_date' => $this->faker->date(),
            'total_amount' => $this->faker->randomFloat(2, 1000, 10000),
            'tax_amount' => $this->faker->randomFloat(2, 100, 1000),
        ];
    }
}
