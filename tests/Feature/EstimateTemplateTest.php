<?php

namespace Tests\Feature;

use App\Models\EstimateTemplate;
use App\Models\EstimateTemplateDetail;
use App\Models\User;
use App\Models\UserGroup;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EstimateTemplateTest extends TestCase
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

    public function test_user_can_list_estimate_templates(): void
    {
        EstimateTemplate::factory()->count(3)->create([
            'user_group_id' => $this->userGroup->id,
        ]);

        $otherGroup = UserGroup::create(['name' => 'Other Group']);
        EstimateTemplate::factory()->create([
            'user_group_id' => $otherGroup->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('estimate-templates.index'));

        $response->assertStatus(200);

        $templates = $response->original->getData()['page']['props']['templates']['data'];
        $this->assertCount(3, $templates);
    }

    public function test_user_can_create_estimate_template_with_details(): void
    {
        $data = [
            'name' => 'New Template',
            'remarks' => 'Test remarks',
            'details' => [
                [
                    'item_name' => 'Item 1',
                    'quantity' => 2,
                    'unit' => '台',
                    'unit_price' => 1000,
                    'tax_classification' => 'exclusive',
                    'amount' => 2000,
                    'group_name' => 'Group A',
                    'remarks' => 'Line remark',
                ],
                [
                    'item_name' => 'Item 2',
                    'quantity' => 1,
                    'unit' => '式',
                    'unit_price' => 5000,
                    'tax_classification' => 'inclusive',
                    'amount' => 5000,
                ],
            ],
        ];

        $response = $this->actingAs($this->user)
            ->post(route('estimate-templates.store'), $data);

        $response->assertRedirect(route('estimate-templates.index'));

        $this->assertDatabaseHas('estimate_templates', [
            'name' => 'New Template',
            'user_group_id' => $this->userGroup->id,
        ]);

        $template = EstimateTemplate::where('name', 'New Template')->first();
        $this->assertCount(2, $template->details);
        $this->assertDatabaseHas('estimate_template_details', [
            'estimate_template_id' => $template->id,
            'item_name' => 'Item 1',
            'amount' => 2000,
        ]);
    }

    public function test_user_can_update_estimate_template(): void
    {
        $template = EstimateTemplate::factory()->create([
            'user_group_id' => $this->userGroup->id,
            'name' => 'Old Name',
        ]);

        $detail = EstimateTemplateDetail::create([
            'estimate_template_id' => $template->id,
            'item_name' => 'Old Item',
            'quantity' => 1,
            'unit_price' => 100,
            'tax_classification' => 'exclusive',
            'amount' => 100,
        ]);

        $data = [
            'name' => 'Updated Name',
            'details' => [
                [
                    'id' => $detail->id,
                    'item_name' => 'Updated Item',
                    'quantity' => 2,
                    'unit_price' => 100,
                    'tax_classification' => 'exclusive',
                    'amount' => 200,
                ],
                [
                    'item_name' => 'New Item',
                    'quantity' => 3,
                    'unit_price' => 300,
                    'tax_classification' => 'inclusive',
                    'amount' => 900,
                ],
            ],
        ];

        $response = $this->actingAs($this->user)
            ->put(route('estimate-templates.update', $template->id), $data);

        $response->assertRedirect(route('estimate-templates.index'));

        $this->assertEquals('Updated Name', $template->fresh()->name);
        $this->assertCount(2, $template->fresh()->details);
        $this->assertDatabaseHas('estimate_template_details', [
            'id' => $detail->id,
            'item_name' => 'Updated Item',
            'amount' => 200,
        ]);
        $this->assertDatabaseHas('estimate_template_details', [
            'estimate_template_id' => $template->id,
            'item_name' => 'New Item',
        ]);
    }

    public function test_user_can_delete_estimate_template(): void
    {
        $template = EstimateTemplate::factory()->create([
            'user_group_id' => $this->userGroup->id,
        ]);

        $response = $this->actingAs($this->user)
            ->delete(route('estimate-templates.destroy', $template->id));

        $response->assertRedirect(route('estimate-templates.index'));
        $this->assertSoftDeleted($template);
    }

    public function test_cannot_access_template_of_other_group(): void
    {
        $otherGroup = UserGroup::create(['name' => 'Other Group']);
        $template = EstimateTemplate::factory()->create([
            'user_group_id' => $otherGroup->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('estimate-templates.edit', $template->id));

        $response->assertStatus(403);

        $response = $this->actingAs($this->user)
            ->put(route('estimate-templates.update', $template->id), [
                'name' => 'Hack',
                'details' => [
                    [
                        'item_name' => 'Item',
                        'quantity' => 1,
                        'unit_price' => 100,
                        'tax_classification' => 'exclusive',
                        'amount' => 100,
                    ],
                ],
            ]);

        $response->assertStatus(403);

        $response = $this->actingAs($this->user)
            ->delete(route('estimate-templates.destroy', $template->id));

        $response->assertStatus(403);
    }
}
