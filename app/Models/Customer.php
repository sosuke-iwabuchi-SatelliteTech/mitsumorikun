<?php

namespace App\Models;

use App\Models\Scopes\UserGroupScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

use App\Traits\FilterableAndSortable;
use Illuminate\Database\Eloquent\Builder;

#[ScopedBy(UserGroupScope::class)]
class Customer extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerFactory> */
    use HasFactory, HasUuids, FilterableAndSortable;

    protected $fillable = [
        'user_group_id',
        'name',
        'contact_person_name',
        'address',
        'phone_number',
        'fax_number',
        'email',
        'remarks',
    ];

    protected static function booted(): void
    {
        static::creating(function (Customer $customer) {
            if (Auth::check()) {
                $customer->user_group_id = Auth::user()->user_group_id;
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
            $q->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('contact_person_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        });
    }
}
