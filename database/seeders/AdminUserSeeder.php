<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserGroup;
use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@aa.com'],
            [
                'name' => 'Initial Admin',
                'password' => Hash::make('adminuser'),
                'role' => UserRole::ADMIN,
            ]
        );
    }
}
