import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { UserGroup, PaginatedData, PageProps } from '@/types';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import SortableHeader from '@/Components/SortableHeader';
import PerPageSelector from '@/Components/PerPageSelector';
import { usePageParams } from '@/Hooks/usePageParams';

interface GroupWithCount extends UserGroup {
    users_count: number;
}

interface Props extends PageProps {
    userGroups: PaginatedData<GroupWithCount>;
    filters: {
        search: string;
        sort_by: string;
        sort_direction: 'asc' | 'desc';
        per_page: number;
    };
}

export default function Index({ userGroups, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const { params, sortBy, sortDirection, perPage } = usePageParams();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('admin.user-groups.index'),
            { ...params, search, page: 1 },
            { preserveState: true }
        );
    };

    const handleDelete = (id: string, name: string) => {
        if (confirm(`グループ「${name}」を削除してもよろしいですか？`)) {
            router.delete(route('admin.user-groups.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        ユーザーグループ管理
                    </h2>
                    <Link
                        href={route('admin.user-groups.create')}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        新規グループ追加
                    </Link>
                </div>
            }
        >
            <Head title="ユーザーグループ管理" />

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
                                placeholder="グループ名で検索..."
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
                            routeName="admin.user-groups.index"
                        />
                    </div>

                    <div className="overflow-hidden border border-gray-100 bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <SortableHeader
                                            label="グループ名"
                                            sortField="name"
                                            currentSort={sortBy}
                                            currentDirection={sortDirection}
                                            queryParams={params}
                                            routeName="admin.user-groups.index"
                                        />
                                        <SortableHeader
                                            label="所属ユーザー数"
                                            sortField="users_count"
                                            currentSort={sortBy}
                                            currentDirection={sortDirection}
                                            queryParams={params}
                                            routeName="admin.user-groups.index"
                                        />
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            作成日
                                        </th>
                                        <th className="relative px-6 py-3">
                                            <span className="sr-only">
                                                編集
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {userGroups.data.map((group) => (
                                        <tr
                                            key={group.id}
                                            className="cursor-pointer transition-colors duration-150 hover:bg-gray-50"
                                            onClick={() =>
                                                router.get(
                                                    route(
                                                        'admin.user-groups.edit',
                                                        group.id
                                                    )
                                                )
                                            }
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                {group.name}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {group.users_count} 名
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {new Date(
                                                    group.created_at
                                                ).toLocaleDateString('ja-JP')}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium"></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination data={userGroups} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
