import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { InvoiceItem, PageProps } from '@/types';

interface Props extends PageProps {
    item: InvoiceItem;
}

export default function Show({ auth, item }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        見積項目詳細
                    </h2>
                    <Link
                        href={route('invoice-items.edit', item.id)}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        編集
                    </Link>
                </div>
            }
        >
            <Head title="見積項目詳細" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">項目名称</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{item.name}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">単価</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{formatCurrency(item.unit_price)}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">数量</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{item.quantity}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">単位</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{item.unit || '-'}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">税区分</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{item.tax_type === 'inc' ? '税込' : '税抜'}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">税率</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{item.tax_rate}%</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">備考</dt>
                                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{item.remarks || '-'}</dd>
                                </div>
                            </dl>

                            <div className="mt-8">
                                <Link
                                    href={route('invoice-items.index')}
                                    className="text-sm text-gray-600 underline hover:text-gray-900"
                                >
                                    一覧に戻る
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
