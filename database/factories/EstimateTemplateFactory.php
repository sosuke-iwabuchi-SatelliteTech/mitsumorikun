<?php

namespace Database\Factories;

use App\Models\UserGroup;
use Illuminate\Database\Eloquent\Factories\Factory;

class EstimateTemplateFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_group_id' => UserGroup::factory(),
            'name' => $this->faker->words(3, true),
            'remarks' => $this->faker->sentence(),
        ];
    }
}
