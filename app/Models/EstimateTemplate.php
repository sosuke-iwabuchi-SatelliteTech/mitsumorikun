<?php

namespace App\Models;

use App\Traits\FilterableAndSortable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class EstimateTemplate extends Model
{
    use FilterableAndSortable, HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'user_group_id',
        'name',
        'remarks',
    ];

    public function userGroup(): BelongsTo
    {
        return $this->belongsTo(UserGroup::class)->withTrashed();
    }

    public function details(): HasMany
    {
        return $this->hasMany(EstimateTemplateDetail::class, 'estimate_template_id');
    }
}
