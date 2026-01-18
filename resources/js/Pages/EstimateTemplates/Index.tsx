import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps, PaginatedData } from '@/types';
import { EstimateTemplate } from '@/types/estimateTemplate';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import { useState } from 'react';

interface Props extends PageProps {
    templates: PaginatedData<EstimateTemplate>;
}

export default function Index({ auth, templates }: Props) {
    const [templateToDelete, setTemplateToDelete] =
        useState<EstimateTemplate | null>(null);
    const { delete: destroy, processing } = useForm({});

    const handleDelete = () => {
        if (!templateToDelete) return;
        destroy(route('estimate-templates.destroy', templateToDelete.id), {
            onSuccess: () => setTemplateToDelete(null),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        見積テンプレート管理
                    </h2>
                    <Link
                        href={route('estimate-templates.create')}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        新規テンプレート作成
                    </Link>
                </div>
            }
        >
            <Head title="見積テンプレート管理" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                テンプレート名
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                項目数
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                最終更新日
                                            </th>
                                            <th className="px-6 py-3 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {templates.data.map((template) => (
                                            <tr
                                                key={template.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {template.name}
                                                    </div>
                                                    {template.remarks && (
                                                        <div className="text-xs text-gray-500">
                                                            {template.remarks}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {template.details?.length ||
                                                        0}{' '}
                                                    項目
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {new Date(
                                                        template.updated_at
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="space-x-3 whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                    <Link
                                                        href={route(
                                                            'estimate-templates.edit',
                                                            template.id
                                                        )}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        編集
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            setTemplateToDelete(
                                                                template
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        削除
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {templates.data.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-6 py-10 text-center text-sm text-gray-500"
                                                >
                                                    テンプレートが登録されていません。
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination would go here if needed, but for templates it might be fewer items */}
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={!!templateToDelete}
                onClose={() => setTemplateToDelete(null)}
            >
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        テンプレートを削除しますか？
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        「{templateToDelete?.name}
                        」を削除します。この操作は取り消せません。
                    </p>
                    <div className="mt-6 flex justify-end gap-x-3">
                        <SecondaryButton
                            onClick={() => setTemplateToDelete(null)}
                            disabled={processing}
                        >
                            キャンセル
                        </SecondaryButton>
                        <button
                            onClick={handleDelete}
                            disabled={processing}
                            className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-700 disabled:opacity-25"
                        >
                            削除する
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
