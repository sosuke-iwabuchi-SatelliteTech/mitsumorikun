<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

trait FilterableAndSortable
{
    /**
     * Scope a query to sort and paginate based on request parameters.
     *
     * @param Builder $query
     * @param Request $request
     * @param array $sortableFields
     * @param string $defaultSort
     * @param string $defaultDirection
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function scopeFilterAndSort(
        Builder $query,
        Request $request,
        array $sortableFields = [],
        string $defaultSort = 'id',
        string $defaultDirection = 'desc'
    ) {
        $sortBy = $request->get('sort_by', $defaultSort);
        $sortDirection = $request->get('sort_direction', $defaultDirection);
        $perPage = $request->get('per_page', 20);

        // Validate items per page to prevent abuse
        $perPage = in_array($perPage, [10, 20, 50, 100]) ? $perPage : 20;

        // Apply sorting
        if (in_array($sortBy, $sortableFields)) {
            $query->orderBy($sortBy, $sortDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy($defaultSort, $defaultDirection);
        }

        return $query->paginate($perPage)->withQueryString();
    }
}
