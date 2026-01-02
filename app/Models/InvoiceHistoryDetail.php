<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceHistoryDetail extends Model
{
    use HasUuids;

    protected $fillable = [
        'invoice_history_id',
        'item_name',
        'quantity',
        'unit_price',
        'unit',
        'tax_rate',
        'tax_classification',
        'amount',
        'group_name',
        'display_order',
        'remarks',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'amount' => 'decimal:2',
    ];

    public function history(): BelongsTo
    {
        return $this->belongsTo(InvoiceHistory::class, 'invoice_history_id');
    }
}
