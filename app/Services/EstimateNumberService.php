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
            $number = strtoupper(Str::random(6));
        } while (Invoice::where('user_group_id', $userGroupId)
            ->where('estimate_number', $number)
            ->exists());

        return $number;
    }
}
