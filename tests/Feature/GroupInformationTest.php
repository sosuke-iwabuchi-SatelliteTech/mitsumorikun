<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserGroup;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GroupInformationTest extends TestCase
{
    use RefreshDatabase;

    public function test_group_info_page_is_accessible(): void
    {
        $userGroup = UserGroup::factory()->create();
        $user = User::factory()->create([
            'role' => 'general',
            'user_group_id' => $userGroup->id,
        ]);

        $response = $this
            ->actingAs($user)
            ->get('/group-information');

        $response->assertStatus(200);
    }

    public function test_group_info_can_be_updated(): void
    {
        $userGroup = UserGroup::factory()->create();
        $user = User::factory()->create([
            'role' => 'general',
            'user_group_id' => $userGroup->id,
        ]);

        // Update basic info
        $this->actingAs($user)
            ->post('/group-information/basic', [
                'invoice_registration_number' => 'T1234567890123',
                'zip_code' => '123-4567',
                'address1' => '東京都渋谷区',
                'address2' => '1-2-3',
                'phone_number' => '03-1234-5678',
                'email' => 'test@example.com',
            ])
            ->assertRedirect();

        // Update account info
        $this->actingAs($user)
            ->patch('/group-information/account', [
                'account_method' => 'bank',
                'bank_name' => 'テスト銀行',
                'branch_name' => '本店',
                'account_type' => '普通',
                'account_number' => '1234567',
                'account_holder' => 'テスト タロウ',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('user_group_details', [
            'user_group_id' => $userGroup->id,
            'invoice_registration_number' => 'T1234567890123',
            'bank_name' => 'テスト銀行',
        ]);
    }
}
