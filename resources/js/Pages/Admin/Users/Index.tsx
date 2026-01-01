import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { User, PaginatedData, PageProps } from '@/types';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import SortableHeader from '@/Components/SortableHeader';
import PerPageSelector from '@/Components/PerPageSelector';
import { usePageParams } from '@/Hooks/usePageParams';

interface Props extends PageProps {
    users: PaginatedData<User & { user_group?: { name: string } }>;
    filters: {
        search: string;
        sort_by: string;
        sort_direction: 'asc' | 'desc';
        per_page: number;
    };
}

export default function Index({ auth, users, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const { params, sortBy, sortDirection, perPage } = usePageParams();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('admin.users.index'),
            { ...params, search, page: 1 },
            { preserveState: true }
        );
    };

    const handleImpersonate = (userId: string) => {
        if (confirm('このユーザーとしてログインしますか？')) {
            router.post(route('impersonate.start', userId));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        ユーザー管理
                    </h2>
                    <Link
                        href={route('admin.users.create')}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        新規ユーザー作成
                    </Link>
                </div>
            }
        >
            <Head title="ユーザー管理" />

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
                                placeholder="名前、メールアドレスで検索..."
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
                            routeName="admin.users.index"
                        />
                    </div>

                    <div className="overflow-hidden border border-gray-100 bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <SortableHeader
                                            label="名前"
                                            sortField="name"
                                            currentSort={sortBy}
                                            currentDirection={sortDirection}
                                            queryParams={params}
                                            routeName="admin.users.index"
                                        />
                                        <SortableHeader
                                            label="メールアドレス"
                                            sortField="email"
                                            currentSort={sortBy}
                                            currentDirection={sortDirection}
                                            queryParams={params}
                                            routeName="admin.users.index"
                                        />
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            グループ
                                        </th>
                                        <SortableHeader
                                            label="ロール"
                                            sortField="role"
                                            currentSort={sortBy}
                                            currentDirection={sortDirection}
                                            queryParams={params}
                                            routeName="admin.users.index"
                                        />
                                        <th className="relative px-6 py-3">
                                            <span className="sr-only">
                                                操作
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                {user.name}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {user.email}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {user.user_group?.name || '-'}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                        user.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}
                                                >
                                                    {user.role === 'admin'
                                                        ? '管理者'
                                                        : '一般'}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                {user.id !== auth.user.id && (
                                                    <button
                                                        onClick={() =>
                                                            handleImpersonate(
                                                                user.id
                                                            )
                                                        }
                                                        className="font-semibold text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        代理ログイン
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination data={users} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
