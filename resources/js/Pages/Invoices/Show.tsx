import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Invoice } from '@/types/invoice';
import StatusBadge from '@/Components/StatusBadge';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';

interface Props extends PageProps {
    invoice: Invoice;
    isLatest: boolean;
}

export default function Show({ auth, invoice, isLatest }: Props) {
    const [processing, setProcessing] = useState(false);

    const handleStatusChange = (status: Invoice['status']) => {
        if (confirm('ステータスを変更しますか？')) {
            router.patch(route('invoices.status', invoice.id), { status }, {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            });
        }
    };

    const handleRevision = () => {
        if (confirm('新しく訂正バージョンを作成しますか？')) {
            router.post(route('invoices.revision', invoice.id), {}, {
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        見積詳細: {invoice.status.startsWith('invoice') ? 'INV' : 'EST'}-{invoice.estimate_number}-{String(invoice.version).padStart(2, '0')}
                    </h2>
                    <div className="flex gap-x-3">
                        <Link
                            href={route('invoices.index')}
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            戻る
                        </Link>
                        {isLatest && (invoice.status === 'creating' || invoice.status === 'invoice_creating') && (
                            <Link
                                href={route('invoices.edit', invoice.id)}
                                className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500"
                            >
                                編集
                            </Link>
                        )}
                        <Link
                            href={route('invoices.history', invoice.id)}
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            履歴
                        </Link>
                        {isLatest && (invoice.status === 'submitted' || invoice.status === 'invoice_submitted') && (
                            <button
                                onClick={handleRevision}
                                disabled={processing}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                            >
                                訂正 (新Ver作成)
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`見積詳細${!isLatest ? ' (履歴)' : ''}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            {/* Primary info */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{invoice.title}</h3>
                                        <p className="text-gray-500">顧客: {invoice.customer?.name}</p>
                                    </div>
                                    <StatusBadge status={invoice.status} />
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 uppercase text-xs">見積日</p>
                                        <p className="font-medium">{invoice.estimate_date ? format(new Date(invoice.estimate_date), 'yyyy年MM月dd日', { locale: ja }) : '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 uppercase text-xs">有効期限</p>
                                        <p className="font-medium">{invoice.expiration_date ? format(new Date(invoice.expiration_date), 'yyyy年MM月dd日', { locale: ja }) : '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 uppercase text-xs">受け渡し期日</p>
                                        <p className="font-medium">{invoice.delivery_deadline ? format(new Date(invoice.delivery_deadline), 'yyyy年MM月dd日', { locale: ja }) : '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 uppercase text-xs">工事場所</p>
                                        <p className="font-medium">{invoice.construction_address || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Details Table */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <h4 className="text-lg font-medium mb-4">明細</h4>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="py-2 text-left text-xs font-medium text-gray-500">品名</th>
                                            <th className="py-2 text-right text-xs font-medium text-gray-500">数量</th>
                                            <th className="py-2 text-right text-xs font-medium text-gray-500">単価</th>
                                            <th className="py-2 text-right text-xs font-medium text-gray-500">小計</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {invoice.details?.map((detail) => (
                                            <tr key={detail.id}>
                                                <td className="py-3 text-sm">
                                                    <div className="font-medium text-gray-900">{detail.item_name}</div>
                                                    {detail.remarks && <div className="text-xs text-gray-500">{detail.remarks}</div>}
                                                </td>
                                                <td className="py-3 text-sm text-right">
                                                    {Number(detail.quantity).toLocaleString()} {detail.unit}
                                                </td>
                                                <td className="py-3 text-sm text-right">
                                                    ¥{Number(detail.unit_price).toLocaleString()}
                                                </td>
                                                <td className="py-3 text-sm text-right font-medium">
                                                    ¥{Number(detail.amount).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="mt-6 flex flex-col items-end space-y-1">
                                    <div className="text-sm text-gray-500">計: ¥{(Number(invoice.total_amount) - Number(invoice.tax_amount)).toLocaleString()}</div>
                                    <div className="text-sm text-gray-500">消費税: ¥{Number(invoice.tax_amount).toLocaleString()}</div>
                                    <div className="text-xl font-bold text-gray-900">合計: ¥{Number(invoice.total_amount).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Read-only alert for history */}
                            {!isLatest && (
                                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-amber-700">
                                                これは過去のバージョンです。編集やステータス変更は最新バージョンから行ってください。
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Status controls */}
                            {isLatest && (
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                                    <h4 className="text-lg font-medium mb-4">ステータス変更</h4>
                                    <div className="space-y-2">
                                        {[
                                            { key: 'creating', label: '見積作成中' },
                                            { key: 'submitted', label: '見積提出済み' },
                                            { key: 'order_received', label: '受注' },
                                            { key: 'invoice_creating', label: '請求書作成中' },
                                            { key: 'invoice_submitted', label: '請求書提出済み' },
                                            { key: 'payment_confirmed', label: '入金確認済み' },
                                        ].map((s) => (
                                            <button
                                                key={s.key}
                                                onClick={() => handleStatusChange(s.key as any)}
                                                disabled={processing || invoice.status === s.key}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                                    invoice.status === s.key
                                                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                                                        : 'hover:bg-gray-50 text-gray-600'
                                                }`}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Issuer information (Snapshot) */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-sm">
                                <h4 className="text-lg font-medium mb-4 text-gray-700">発行者情報</h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-400">名称</p>
                                        <p className="font-medium">{invoice.issuer_name || '未設定'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">登録番号</p>
                                        <p className="font-medium">{invoice.issuer_registration_number || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">住所</p>
                                        <p className="font-medium">{invoice.issuer_address || '-'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-xs text-gray-400">TEL</p>
                                            <p className="font-medium">{invoice.issuer_tel || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">FAX</p>
                                            <p className="font-medium">{invoice.issuer_fax || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
