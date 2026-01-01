import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Customer, PaginatedData, PageProps } from '@/types';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import SortableHeader from '@/Components/SortableHeader';
import PerPageSelector from '@/Components/PerPageSelector';
import { usePageParams } from '@/Hooks/usePageParams';

interface Props extends PageProps {
    customers: PaginatedData<Customer>;
    filters: {
        search: string;
        sort_by: string;
        sort_direction: 'asc' | 'desc';
        per_page: number;
    };
}

export default function Index({ auth, customers, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const { params, sortBy, sortDirection, perPage } = usePageParams();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('customers.index'), { ...params, search, page: 1 }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        顧客マスタ
                    </h2>
                    <Link
                        href={route('customers.create')}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200"
                    >
                        新規登録
                    </Link>
                </div>
            }
        >
            <Head title="顧客マスタ" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <form onSubmit={handleSearch} className="flex w-full max-w-md items-center gap-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="顧客名、担当者名、メールアドレスで検索..."
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            <button
                                type="submit"
                                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                検索
                            </button>
                        </form>

                        <PerPageSelector
                            currentPerPage={perPage}
                            queryParams={params}
                            routeName="customers.index"
                        />
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <SortableHeader
                                            label="顧客名称"
                                            sortField="name"
                                            currentSort={sortBy}
                                            currentDirection={sortDirection}
                                            queryParams={params}
                                            routeName="customers.index"
                                        />
                                        <SortableHeader
                                            label="担当者名"
                                            sortField="contact_person_name"
                                            currentSort={sortBy}
                                            currentDirection={sortDirection}
                                            queryParams={params}
                                            routeName="customers.index"
                                        />
                                        <SortableHeader
                                            label="電話番号"
                                            sortField="phone_number"
                                            currentSort={sortBy}
                                            currentDirection={sortDirection}
                                            queryParams={params}
                                            routeName="customers.index"
                                        />
                                        <SortableHeader
                                            label="メールアドレス"
                                            sortField="email"
                                            currentSort={sortBy}
                                            currentDirection={sortDirection}
                                            queryParams={params}
                                            routeName="customers.index"
                                        />
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">操作</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {customers.data.length > 0 ? (
                                        customers.data.map((customer) => (
                                            <tr key={customer.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                    {customer.name}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {customer.contact_person_name || '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {customer.phone_number || '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {customer.email || '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium flex justify-end gap-3">
                                                    <Link
                                                        href={route('customers.show', customer.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        詳細
                                                    </Link>
                                                    <Link
                                                        href={route('customers.edit', customer.id)}
                                                        className="text-amber-600 hover:text-amber-900"
                                                    >
                                                        編集
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                                                登録されている顧客がいません。
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination data={customers} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
