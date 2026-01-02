<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserGroupDetail extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_group_id',
        'invoice_company_name',
        'invoice_registration_number',
        'zip_code',
        'address1',
        'address2',
        'phone_number',
        'fax_number',
        'email',
        'seal_image_path',
        'account_method',
        'use_bank',
        'bank_name',
        'branch_name',
        'account_type',
        'account_number',
        'account_holder',
        'use_japan_post',
        'japan_post_bank_symbol',
        'japan_post_bank_number',
        'japan_post_bank_account_holder',
    ];

    protected $casts = [
        'use_bank' => 'boolean',
        'use_japan_post' => 'boolean',
    ];

    public function userGroup(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(UserGroup::class);
    }
}
