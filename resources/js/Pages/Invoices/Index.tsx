import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PaginatedData, PageProps } from '@/types';
import { Invoice } from '@/types/invoice';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import StatusBadge from '@/Components/StatusBadge';
import SortableHeader from '@/Components/SortableHeader';
import PerPageSelector from '@/Components/PerPageSelector';
import { usePageParams } from '@/Hooks/usePageParams';
import { formatDate } from '@/Utils/date';

interface Props extends PageProps {
    invoices: PaginatedData<Invoice>;
    filters: {
        search: string;
        sort_by: string;
        sort_direction: 'asc' | 'desc';
        per_page: number;
    };
}

export default function Index({ auth, invoices, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const { params, sortBy, sortDirection, perPage } = usePageParams();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('invoices.index'),
            { ...params, search, page: 1 },
            { preserveState: true }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        見積・請求管理
                    </h2>
                    <Link
                        href={route('invoices.create')}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        新規見積作成
                    </Link>
                </div>
            }
        >
            <Head title="見積・請求管理" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <form
                            onSubmit={handleSearch}
                            className="flex w-full max-w-md items-center gap-2"
                        >
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="顧客名、管理番号、件名で検索..."
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            <button
                                type="submit"
                                className="inline-flex shrink-0 items-center whitespace-nowrap rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                検索
                            </button>
                        </form>

                        <PerPageSelector
                            currentPerPage={perPage}
                            queryParams={params}
                            routeName="invoices.index"
                        />
                    </div>

                    <div className="overflow-hidden border border-gray-100 bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            ステータス
                                        </th>
                                        <SortableHeader
                                            label="管理番号"
                                            sortField="estimate_number"
                                            currentSort={sortBy}
                                            currentDirection={sortDirection}
                                            queryParams={params}
                                            routeName="invoices.index"
                                        />
                                        <SortableHeader
                                            label="件名"
                                            sortField="title"
                                            currentSort={sortBy}
                                            currentDirection={sortDirection}
                                            queryParams={params}
                                            routeName="invoices.index"
                                        />
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            顧客
                                        </th>
                                        <SortableHeader
                                            label="見積日"
                                            sortField="estimate_date"
                                            currentSort={sortBy}
                                            currentDirection={sortDirection}
                                            queryParams={params}
                                            routeName="invoices.index"
                                        />
                                        <SortableHeader
                                            label="合計金額"
                                            sortField="total_amount"
                                            currentSort={sortBy}
                                            currentDirection={sortDirection}
                                            queryParams={params}
                                            routeName="invoices.index"
                                            className="text-right"
                                        />
                                        <th className="relative px-6 py-3">
                                            <span className="sr-only">
                                                詳細
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {invoices.data.length > 0 ? (
                                        invoices.data.map((invoice) => (
                                            <tr
                                                key={invoice.id}
                                                className="cursor-pointer transition-colors duration-150 hover:bg-gray-50"
                                                onClick={() =>
                                                    router.get(
                                                        route(
                                                            'invoices.show',
                                                            invoice.id
                                                        )
                                                    )
                                                }
                                            >
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    <StatusBadge
                                                        status={invoice.status}
                                                    />
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                    {invoice.estimate_number}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {invoice.title}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {invoice.customer?.name ||
                                                        '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {formatDate(
                                                        invoice.estimate_date
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                                    ¥
                                                    {Number(
                                                        invoice.total_amount
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium"></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-6 py-10 text-center text-sm text-gray-500"
                                            >
                                                登録されている見積・請求がありません。
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination data={invoices} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
