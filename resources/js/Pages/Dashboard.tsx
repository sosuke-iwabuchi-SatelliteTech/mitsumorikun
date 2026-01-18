import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Invoice } from '@/types/invoice';

interface InvoiceStat {
    status: Invoice['status'];
    count: number;
    total_amount: string | number;
}

interface DashboardProps extends Record<string, unknown> {
    invoiceStats: InvoiceStat[];
}

const statusLabels: Record<Invoice['status'], string> = {
    creating: '作成中',
    submitted: '提出済',
    order_received: '受注',
    rejected: '失注',
    invoice_creating: '請求書作成中',
    invoice_submitted: '請求済',
    payment_confirmed: '入金確認',
};

const statusOrder: Invoice['status'][] = [
    'creating',
    'submitted',
    'order_received',
    'rejected',
    'invoice_creating',
    'invoice_submitted',
    'payment_confirmed',
];

export default function Dashboard({ invoiceStats }: PageProps<DashboardProps>) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const statsMap = invoiceStats.reduce(
        (acc, curr) => {
            acc[curr.status] = curr;
            return acc;
        },
        {} as Record<string, InvoiceStat>
    );

    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
        }).format(Number(amount));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    ダッシュボード
                </h2>
            }
        >
            <Head title="ダッシュボード" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {user.role === 'general' ? (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="flex items-center justify-between border-b border-gray-100 p-6 text-gray-900">
                                <div className="text-lg font-medium">
                                    見積・請求 状況サマリ
                                </div>
                                <Link
                                    href={route('invoices.index')}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    一覧を表示 &rarr;
                                </Link>
                            </div>
                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    ステータス
                                                </th>
                                                <th className="bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    件数
                                                </th>
                                                <th className="bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    合計金額
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {statusOrder.map((status) => {
                                                const stat = statsMap[
                                                    status
                                                ] || {
                                                    count: 0,
                                                    total_amount: 0,
                                                };
                                                return (
                                                    <tr key={status}>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                            {
                                                                statusLabels[
                                                                    status
                                                                ]
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                                            {stat.count} 件
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-gray-900">
                                                            {formatCurrency(
                                                                stat.total_amount
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h3 className="text-lg font-medium">
                                    ようこそ、管理者さん
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    左のメニューからユーザー管理やグループ管理を行えます。
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
