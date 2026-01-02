<?php

namespace App\Services;

use App\Models\Invoice;
use Illuminate\Support\Str;

class EstimateNumberService
{
    /**
     * Generate a unique 6-digit alphanumeric estimate number for a given user group.
     *
     * @param string $userGroupId
     * @return string
     */
    public function generate(string $userGroupId): string
    {
        do {
            $prefix = strtoupper(Str::random(2));
            $suffix = str_pad((string) rand(0, 9999), 4, '0', STR_PAD_LEFT);
            $number = $prefix . $suffix;
        } while (Invoice::where('user_group_id', $userGroupId)
            ->where('estimate_number', $number)
            ->exists());

        return $number;
    }
}
