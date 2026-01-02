<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InvoiceHistory extends Model
{
    use HasUuids;

    protected $fillable = [
        'invoice_id',
        'user_group_id',
        'customer_id',
        'estimate_number',
        'version',
        'status',
        'title',
        'estimate_date',
        'delivery_deadline',
        'construction_address',
        'payment_terms',
        'expiration_date',
        'remarks',
        'total_amount',
        'tax_amount',
        'issuer_name',
        'issuer_registration_number',
        'issuer_address',
        'issuer_tel',
        'issuer_fax',
        'bank_name',
        'branch_name',
        'account_type',
        'account_number',
        'account_holder',
        'japan_post_bank_symbol',
        'japan_post_bank_number',
        'japan_post_bank_account_holder',
    ];

    protected $casts = [
        'estimate_date' => 'date',
        'delivery_deadline' => 'date',
        'expiration_date' => 'date',
        'total_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
    ];

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(InvoiceHistoryDetail::class);
    }
}
