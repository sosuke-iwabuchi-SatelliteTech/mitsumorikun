import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export function usePageParams() {
    const { url } = usePage();
    const urlObj = new URL(url, window.location.origin);

    const params: Record<string, string> = {};
    urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
    });

    return {
        params,
        sortBy: params.sort_by || '',
        sortDirection: (params.sort_direction as 'asc' | 'desc') || 'desc',
        search: params.search || '',
        perPage: parseInt(params.per_page || '20'),
    };
}
