<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
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
