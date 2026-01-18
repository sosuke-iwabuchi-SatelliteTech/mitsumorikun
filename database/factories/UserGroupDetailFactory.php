<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserGroupDetail>
 */
class UserGroupDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'invoice_registration_number' => 'T'.fake()->numerify('#############'),
            'zip_code' => fake()->postcode(),
            'address1' => fake()->address(),
            'phone_number' => fake()->phoneNumber(),
            'email' => fake()->safeEmail(),
            'bank_name' => 'テスト銀行',
            'branch_name' => 'テスト支店',
            'account_type' => '普通',
            'account_number' => fake()->numerify('#######'),
            'account_holder' => fake()->name(),
        ];
    }
}
