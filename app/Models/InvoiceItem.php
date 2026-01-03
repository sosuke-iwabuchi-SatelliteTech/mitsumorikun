<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\Scopes\UserGroupScope;
use App\Traits\FilterableAndSortable;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

#[ScopedBy(UserGroupScope::class)]
class InvoiceItem extends Model
{
    use FilterableAndSortable, HasFactory, SoftDeletes;

    protected $fillable = [
        'user_group_id',
        'name',
        'quantity',
        'unit_price',
        'unit',
        'tax_type',
        'tax_rate',
        'remarks',
    ];

    protected static function booted(): void
    {
        static::creating(function (InvoiceItem $item) {
            if (Auth::check() && !$item->user_group_id) {
                $item->user_group_id = Auth::user()->user_group_id;
            }
        });
    }

    public function userGroup(): BelongsTo
    {
        return $this->belongsTo(UserGroup::class);
    }

    public function scopeSearch(Builder $query, ?string $search)
    {
        return $query->when($search, function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%");
        });
    }
}
