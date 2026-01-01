<?php

namespace App\Models;

use App\Traits\FilterableAndSortable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserGroup extends Model
{
    /** @use HasFactory<\Database\Factories\UserGroupFactory> */
    use FilterableAndSortable, HasFactory, HasUuids;

    protected $fillable = ['name'];

    public function users(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(User::class);
    }

    public function scopeSearch(Builder $query, ?string $search)
    {
        return $query->when($search, function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%");
        });
    }
}
