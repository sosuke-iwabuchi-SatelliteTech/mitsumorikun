import { router } from '@inertiajs/react';

interface Props {
    currentPerPage: number;
    queryParams: Record<string, any>;
    routeName: string;
}

export default function PerPageSelector({
    currentPerPage,
    queryParams,
    routeName,
}: Props) {
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(
            route(routeName),
            { ...queryParams, per_page: e.target.value, page: 1 },
            { preserveState: true }
        );
    };

    return (
        <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>表示件数:</span>
            <select
                value={currentPerPage}
                onChange={handlePerPageChange}
                className="rounded-md border-gray-300 py-1 pl-3 pr-8 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
            <span>件</span>
        </div>
    );
}
