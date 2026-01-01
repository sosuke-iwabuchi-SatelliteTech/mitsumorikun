import { Link } from '@inertiajs/react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

interface Props {
    label: string;
    sortField: string;
    currentSort: string;
    currentDirection: 'asc' | 'desc';
    queryParams: Record<string, any>;
    routeName: string;
}

export default function SortableHeader({
    label,
    sortField,
    currentSort,
    currentDirection,
    queryParams,
    routeName,
}: Props) {
    const isActive = sortField === currentSort;
    const nextDirection =
        isActive && currentDirection === 'asc' ? 'desc' : 'asc';

    return (
        <th scope="col" className="px-6 py-3 text-left">
            <Link
                href={route(routeName, {
                    ...queryParams,
                    sort_by: sortField,
                    sort_direction: nextDirection,
                })}
                className="group inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
            >
                {label}
                <span className="flex-none rounded text-gray-400 group-hover:bg-gray-200">
                    {isActive ? (
                        currentDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )
                    ) : (
                        <ChevronsUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                    )}
                </span>
            </Link>
        </th>
    );
}
