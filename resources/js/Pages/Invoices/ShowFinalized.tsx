import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Invoice } from '@/types/invoice';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Props extends PageProps {
    invoice: Invoice;
    finalized: Invoice;
}

const getDocType = (type: string) => {
    return type === 'invoice' ? '請求書' : '見積書';
};

export default function ShowFinalized({ auth, invoice, finalized }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {getDocType(finalized.document_type || 'estimate')}確定データ詳細: {finalized.estimate_number} (v{finalized.version})
                    </h2>
                    <div className="flex items-center gap-3">
                        <a
                            href={route('finalized-invoices.preview', finalized.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            PDFプレビュー
                        </a>
                        <a
                            href={route('finalized-invoices.download', finalized.id)}
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            PDFダウンロード
                        </a>
                        <Link
                            href={route('invoices.finalized', invoice.id)}
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            一覧へ戻る
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`${getDocType(finalized.document_type || 'estimate')}確定データ詳細 (v${finalized.version})`} />

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
                                    これは {format(new Date(finalized.created_at), 'yyyy年MM月dd日 HH:mm', { locale: ja })} に保存された確定データです。閲覧専用であり、現在のデータには影響しません。
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
                                        <h3 className="text-2xl font-bold text-gray-900">{finalized.title}</h3>
                                        <p className="text-gray-500 mt-1">管理番号: {finalized.estimate_number} {getDocType(finalized.document_type || 'estimate')} (v{finalized.version})</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">
                                            作成日: {format(new Date(finalized.created_at), 'yyyy/MM/dd', { locale: ja })}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">顧客名</h4>
                                        <p className="text-lg font-medium text-gray-900">{finalized.customer?.name} 様</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">有効期限</h4>
                                        <p className="text-gray-900">{finalized.expiration_date ? format(new Date(finalized.expiration_date), 'yyyy/MM/dd', { locale: ja }) : '-'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">納入期限</h4>
                                        <p className="text-gray-900">{finalized.delivery_deadline ? format(new Date(finalized.delivery_deadline), 'yyyy/MM/dd', { locale: ja }) : '-'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">工事場所 / 支払条件</h4>
                                        <p className="text-gray-900">{finalized.construction_address || '-'}</p>
                                        <p className="text-gray-900 text-sm mt-1">{finalized.payment_terms || '-'}</p>
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
                                            {finalized.details?.map((detail) => (
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
                                            <span>¥{Number(finalized.tax_amount).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                                            <span>合計金額</span>
                                            <span>¥{Number(finalized.total_amount).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {finalized.remarks && (
                                    <div className="mt-8 pt-8 border-t border-gray-100">
                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">備考</h4>
                                        <p className="text-gray-700 whitespace-pre-wrap">{finalized.remarks}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Issuer information (Snapshot) */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-sm">
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">発行者情報 (確定時)</h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-bold text-gray-900">{finalized.issuer_name}</p>
                                        <p className="text-gray-500">登録番号: {finalized.issuer_registration_number || '-'}</p>
                                    </div>
                                    <div className="text-gray-600">
                                        <p>{finalized.issuer_address}</p>
                                        <p>TEL: {finalized.issuer_tel}</p>
                                        <p>FAX: {finalized.issuer_fax}</p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <h5 className="font-bold text-gray-900 mb-2">振込先</h5>
                                    <div className="text-gray-600 space-y-1">
                                        <p>{finalized.bank_name} {finalized.branch_name}</p>
                                        <p>{finalized.account_type} {finalized.account_number}</p>
                                        <p>{finalized.account_holder}</p>
                                    </div>
                                    {finalized.japan_post_bank_number && (
                                        <div className="mt-3 pt-3 border-t border-gray-50 text-gray-600 space-y-1">
                                            <p>ゆうちょ銀行: {finalized.japan_post_bank_symbol}-{finalized.japan_post_bank_number}</p>
                                            <p>{finalized.japan_post_bank_account_holder}</p>
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
