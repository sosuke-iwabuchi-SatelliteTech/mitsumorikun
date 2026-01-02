import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Invoice } from '@/types/invoice';
import StatusBadge from '@/Components/StatusBadge';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Props extends PageProps {
    invoice: Invoice;
    history: Invoice;
}

const getDocType = (type: string) => {
    return type === 'invoice' ? '請求書' : '見積書';
};

export default function ShowHistory({ auth, invoice, history }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {getDocType(history.document_type || 'estimate')}履歴詳細: {history.estimate_number} (v{history.version})
                    </h2>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('invoices.history', invoice.id)}
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            履歴一覧へ戻る
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`${getDocType(history.document_type || 'estimate')}履歴詳細 (v${history.version})`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Read-only alert */}
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-amber-700">
                                    これは {format(new Date(history.created_at), 'yyyy年MM月dd日 HH:mm', { locale: ja })} に保存された断面情報です。閲覧専用であり、現在のデータには影響しません。
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Main Information */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <div className="flex items-start justify-between mb-8 pb-4 border-b border-gray-100">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{history.title}</h3>
                                        <p className="text-gray-500 mt-1">管理番号: {history.estimate_number} {getDocType(history.document_type || 'estimate')} (v{history.version})</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">
                                            作成日: {format(new Date(history.created_at), 'yyyy/MM/dd', { locale: ja })}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">顧客名</h4>
                                        <p className="text-lg font-medium text-gray-900">{history.customer?.name} 様</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">有効期限</h4>
                                        <p className="text-gray-900">{history.expiration_date ? format(new Date(history.expiration_date), 'yyyy/MM/dd', { locale: ja }) : '-'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">納入期限</h4>
                                        <p className="text-gray-900">{history.delivery_deadline ? format(new Date(history.delivery_deadline), 'yyyy/MM/dd', { locale: ja }) : '-'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">工事場所 / 支払条件</h4>
                                        <p className="text-gray-900">{history.construction_address || '-'}</p>
                                        <p className="text-gray-900 text-sm mt-1">{history.payment_terms || '-'}</p>
                                    </div>
                                </div>

                                {/* Details Table */}
                                <div className="mt-8">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">内容</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">単価</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {history.details?.map((detail) => (
                                                <tr key={detail.id}>
                                                    <td className="px-4 py-4 text-sm text-gray-900">
                                                        {detail.group_name && (
                                                            <span className="block text-xs text-indigo-500 font-bold mb-1">[{detail.group_name}]</span>
                                                        )}
                                                        {detail.item_name}
                                                        {detail.remarks && <span className="block text-xs text-gray-400 mt-1">{detail.remarks}</span>}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-500 text-right">{Number(detail.quantity).toLocaleString()} {detail.unit}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-500 text-right">¥{Number(detail.unit_price).toLocaleString()}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-900 font-medium text-right">¥{Number(detail.amount).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <div className="w-80 space-y-3">
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>消費税</span>
                                            <span>¥{Number(history.tax_amount).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                                            <span>合計金額</span>
                                            <span>¥{Number(history.total_amount).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {history.remarks && (
                                    <div className="mt-8 pt-8 border-t border-gray-100">
                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">備考</h4>
                                        <p className="text-gray-700 whitespace-pre-wrap">{history.remarks}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Issuer information (Snapshot) */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-sm">
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">発行者情報 (断面)</h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-bold text-gray-900">{history.issuer_name}</p>
                                        <p className="text-gray-500">登録番号: {history.issuer_registration_number || '-'}</p>
                                    </div>
                                    <div className="text-gray-600">
                                        <p>{history.issuer_address}</p>
                                        <p>TEL: {history.issuer_tel}</p>
                                        <p>FAX: {history.issuer_fax}</p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <h5 className="font-bold text-gray-900 mb-2">振込先</h5>
                                    <div className="text-gray-600 space-y-1">
                                        <p>{history.bank_name} {history.branch_name}</p>
                                        <p>{history.account_type} {history.account_number}</p>
                                        <p>{history.account_holder}</p>
                                    </div>
                                    {history.japan_post_bank_number && (
                                        <div className="mt-3 pt-3 border-t border-gray-50 text-gray-600 space-y-1">
                                            <p>ゆうちょ銀行: {history.japan_post_bank_symbol}-{history.japan_post_bank_number}</p>
                                            <p>{history.japan_post_bank_account_holder}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
