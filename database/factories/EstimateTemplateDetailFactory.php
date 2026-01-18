<?php

namespace Database\Factories;

use App\Models\EstimateTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

class EstimateTemplateDetailFactory extends Factory
{
    public function definition(): array
    {
        return [
            'estimate_template_id' => EstimateTemplate::factory(),
            'item_name' => $this->faker->word(),
            'quantity' => $this->faker->randomFloat(2, 1, 100),
            'unit' => $this->faker->word(),
            'unit_price' => $this->faker->randomFloat(2, 100, 10000),
            'tax_classification' => $this->faker->randomElement(['inclusive', 'exclusive']),
            'amount' => 0, // Should be calculated or set
            'group_name' => $this->faker->word(),
            'remarks' => $this->faker->sentence(),
        ];
    }
}
