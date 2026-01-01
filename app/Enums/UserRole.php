<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case GENERAL = 'general';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => '管理者',
            self::GENERAL => '一般ユーザー',
        };
    }
}
