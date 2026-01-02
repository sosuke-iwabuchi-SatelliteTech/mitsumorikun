import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { InvoiceItem, PaginatedData, PageProps } from '@/types';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import SortableHeader from '@/Components/SortableHeader';
import PerPageSelector from '@/Components/PerPageSelector';
import { usePageParams } from '@/Hooks/usePageParams';

interface Props extends PageProps {
    items: PaginatedData<InvoiceItem>;
    filters: {
        search: string;
        sort_by: string;
        sort_direction: 'asc' | 'desc';
        per_page: number;
    };
}

export default function Index({ auth, items, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const { params, sortBy, sortDirection, perPage } = usePageParams();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('invoice-items.index'),
            { ...params, search, page: 1 },
            { preserveState: true }
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        見積項目マスタ
                    </h2>
                    <Link
                        href={route('invoice-items.create')}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        新規登録
                    </Link>
                </div>
            }
        >
            <Head title="見積項目マスタ" />

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
                                placeholder="項目名で検索..."
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
                            routeName="invoice-items.index"
                        />
                    </div>

                    <div className="overflow-hidden border border-gray-100 bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <SortableHeader
                                            label="項目名"
                                            sortField="name"
                                            currentSort={sortBy}
                                            currentDirection={sortDirection}
                                            queryParams={params}
                                            routeName="invoice-items.index"
                                        />
                                        <SortableHeader
                                            label="単価"
                                            sortField="unit_price"
                                            currentSort={sortBy}
                                            currentDirection={sortDirection}
                                            queryParams={params}
                                            routeName="invoice-items.index"
                                        />
                                        <SortableHeader
                                            label="数量"
                                            sortField="quantity"
                                            currentSort={sortBy}
                                            currentDirection={sortDirection}
                                            queryParams={params}
                                            routeName="invoice-items.index"
                                        />
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            単位
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            税区分 / 税率
                                        </th>
                                        <th
                                            scope="col"
                                            className="relative px-6 py-3"
                                        >
                                            <span className="sr-only">
                                                操作
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {items.data.length > 0 ? (
                                        items.data.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="transition-colors duration-150 hover:bg-gray-50"
                                            >
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                    {item.name}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {formatCurrency(item.unit_price)}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {item.quantity}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {item.unit || '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {item.tax_type === 'inc' ? '税込' : '税抜'} / {item.tax_rate}%
                                                </td>
                                                <td className="flex justify-end gap-3 whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                    <Link
                                                        href={route(
                                                            'invoice-items.edit',
                                                            item.id
                                                        )}
                                                        className="text-amber-600 hover:text-amber-900"
                                                    >
                                                        編集
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-10 text-center text-sm text-gray-500"
                                            >
                                                登録されている見積項目がいません。
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination data={items} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
