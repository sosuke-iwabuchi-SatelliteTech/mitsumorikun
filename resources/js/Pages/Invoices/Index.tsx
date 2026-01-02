import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PaginatedData, PageProps } from '@/types';
import { Invoice } from '@/types/invoice';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import StatusBadge from '@/Components/StatusBadge';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Props extends PageProps {
    invoices: PaginatedData<Invoice>;
}

export default function Index({ auth, invoices }: Props) {
    // Simple index for now, can add filtering later if needed
    
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
                    <div className="overflow-hidden border border-gray-100 bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            管理番号
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            版
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            件名
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            顧客
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            見積日
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            ステータス
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 text-right">
                                            合計金額
                                        </th>
                                        <th className="relative px-6 py-3">
                                            <span className="sr-only">操作</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {invoices.data.length > 0 ? (
                                        invoices.data.map((invoice) => (
                                            <tr
                                                key={invoice.id}
                                                className="transition-colors duration-150 hover:bg-gray-50"
                                            >
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                    {invoice.estimate_number}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    v{invoice.version}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {invoice.title}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {invoice.customer?.name || '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {invoice.estimate_date ? format(new Date(invoice.estimate_date), 'yyyy/MM/dd', { locale: ja }) : '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    <StatusBadge status={invoice.status} />
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 text-right">
                                                    ¥{Number(invoice.total_amount).toLocaleString()}
                                                </td>
                                                <td className="flex justify-end gap-3 whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                    <Link
                                                        href={route('invoices.show', invoice.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        詳細
                                                    </Link>
                                                    {(invoice.status === 'creating' || invoice.status === 'invoice_creating') && (
                                                        <Link
                                                            href={route('invoices.edit', invoice.id)}
                                                            className="text-amber-600 hover:text-amber-900"
                                                        >
                                                            編集
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={8}
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
