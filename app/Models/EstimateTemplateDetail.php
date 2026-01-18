<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EstimateTemplateDetail extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'estimate_template_id',
        'item_name',
        'quantity',
        'unit',
        'unit_price',
        'tax_classification',
        'amount',
        'group_name',
        'remarks',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'amount' => 'decimal:2',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(EstimateTemplate::class, 'estimate_template_id');
    }
}
