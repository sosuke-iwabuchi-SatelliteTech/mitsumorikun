import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { UserGroup, PaginatedData, PageProps } from '@/types';

interface GroupWithCount extends UserGroup {
    users_count: number;
}

interface Props extends PageProps {
    userGroups: PaginatedData<GroupWithCount>;
}

export default function Index({ userGroups }: Props) {
    const handleDelete = (id: string, name: string) => {
        if (confirm(`グループ「${name}」を削除してもよろしいですか？`)) {
            router.delete(route('admin.user-groups.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
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
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">グループ名</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">所属ユーザー数</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">作成日</th>
                                        <th className="relative px-6 py-3"><span className="sr-only">操作</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {userGroups.data.map((group) => (
                                        <tr key={group.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{group.name}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{group.users_count} 名</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{new Date(group.created_at).toLocaleDateString('ja-JP')}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-4">
                                                <Link
                                                    href={route('admin.user-groups.edit', group.id)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    編集
                                                </Link>
                                                {group.users_count === 0 && (
                                                    <button
                                                        onClick={() => handleDelete(group.id, group.name)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        削除
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-center">
                        {userGroups.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`mx-1 px-3 py-1 rounded border ${link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
