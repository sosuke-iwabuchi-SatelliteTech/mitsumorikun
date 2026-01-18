import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Invoice } from '@/types/invoice';
import { formatDate } from '@/Utils/date';

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
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {getDocType(finalized.document_type || 'estimate')}
                        確定データ詳細: {finalized.estimate_number} (v
                        {finalized.version})
                    </h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href={route(
                                'finalized-invoices.preview',
                                finalized.id
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                            PDFプレビュー
                        </a>
                        <a
                            href={route(
                                'finalized-invoices.download',
                                finalized.id
                            )}
                            className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
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
            <Head
                title={`${getDocType(finalized.document_type || 'estimate')}確定データ詳細 (v${finalized.version})`}
            />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Read-only alert */}
                    <div className="rounded-md border-l-4 border-amber-400 bg-amber-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-amber-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-amber-700">
                                    これは{' '}
                                    {formatDate(
                                        finalized.created_at,
                                        'yyyy年MM月dd日 HH:mm'
                                    )}{' '}
                                    に保存された確定データです。閲覧専用であり、現在のデータには影響しません。
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            {/* Main Information */}
                            <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                                <div className="mb-8 flex items-start justify-between border-b border-gray-100 pb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {finalized.title}
                                        </h3>
                                        <p className="mt-1 text-gray-500">
                                            管理番号:{' '}
                                            {finalized.estimate_number}{' '}
                                            {getDocType(
                                                finalized.document_type ||
                                                    'estimate'
                                            )}{' '}
                                            (v{finalized.version})
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">
                                            作成日:{' '}
                                            {formatDate(finalized.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-8 grid grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            顧客名
                                        </h4>
                                        <p className="text-lg font-medium text-gray-900">
                                            {finalized.customer?.name} 様
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            有効期限
                                        </h4>
                                        <p className="text-gray-900">
                                            {formatDate(
                                                finalized.expiration_date
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            納入期限
                                        </h4>
                                        <p className="text-gray-900">
                                            {formatDate(
                                                finalized.delivery_deadline
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            工事場所 / 支払条件
                                        </h4>
                                        <p className="text-gray-900">
                                            {finalized.construction_address ||
                                                '-'}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {finalized.payment_terms || '-'}
                                        </p>
                                    </div>
                                </div>

                                {/* Details Table */}
                                <div className="mt-8">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    内容
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    数量
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    単価
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    金額
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {finalized.details?.map(
                                                (detail) => (
                                                    <tr key={detail.id}>
                                                        <td className="px-4 py-4 text-sm text-gray-900">
                                                            {detail.group_name && (
                                                                <span className="mb-1 block text-xs font-bold text-indigo-500">
                                                                    [
                                                                    {
                                                                        detail.group_name
                                                                    }
                                                                    ]
                                                                </span>
                                                            )}
                                                            {detail.item_name}
                                                            {detail.remarks && (
                                                                <span className="mt-1 block text-xs text-gray-400">
                                                                    {
                                                                        detail.remarks
                                                                    }
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-4 text-right text-sm text-gray-500">
                                                            {Number(
                                                                detail.quantity
                                                            ).toLocaleString(
                                                                undefined,
                                                                {
                                                                    maximumFractionDigits: 2,
                                                                }
                                                            )}{' '}
                                                            {detail.unit}
                                                        </td>
                                                        <td className="px-4 py-4 text-right text-sm text-gray-500">
                                                            ¥
                                                            {Number(
                                                                detail.unit_price
                                                            ).toLocaleString()}
                                                        </td>
                                                        <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                                                            ¥
                                                            {Number(
                                                                detail.amount
                                                            ).toLocaleString()}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <div className="w-80 space-y-3">
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>消費税</span>
                                            <span>
                                                ¥
                                                {Number(
                                                    finalized.tax_amount
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t border-gray-200 pt-3 text-xl font-bold text-gray-900">
                                            <span>合計金額</span>
                                            <span>
                                                ¥
                                                {Number(
                                                    finalized.total_amount
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {finalized.remarks && (
                                    <div className="mt-8 border-t border-gray-100 pt-8">
                                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            備考
                                        </h4>
                                        <p className="whitespace-pre-wrap text-gray-700">
                                            {finalized.remarks}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Issuer information (Snapshot) */}
                            <div className="overflow-hidden bg-white p-6 text-sm shadow-sm sm:rounded-lg">
                                <h4 className="mb-4 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    発行者情報 (確定時)
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-bold text-gray-900">
                                            {finalized.issuer_name}
                                        </p>
                                        <p className="text-gray-500">
                                            登録番号:{' '}
                                            {finalized.issuer_registration_number ||
                                                '-'}
                                        </p>
                                    </div>
                                    <div className="text-gray-600">
                                        <p>{finalized.issuer_address}</p>
                                        <p>TEL: {finalized.issuer_tel}</p>
                                        <p>FAX: {finalized.issuer_fax}</p>
                                    </div>
                                </div>

                                <div className="mt-6 border-t border-gray-100 pt-6">
                                    <h5 className="mb-2 font-bold text-gray-900">
                                        振込先
                                    </h5>
                                    <div className="space-y-1 text-gray-600">
                                        <p>
                                            {finalized.bank_name}{' '}
                                            {finalized.branch_name}
                                        </p>
                                        <p>
                                            {finalized.account_type}{' '}
                                            {finalized.account_number}
                                        </p>
                                        <p>{finalized.account_holder}</p>
                                    </div>
                                    {finalized.japan_post_bank_number && (
                                        <div className="mt-3 space-y-1 border-t border-gray-50 pt-3 text-gray-600">
                                            <p>
                                                ゆうちょ銀行:{' '}
                                                {
                                                    finalized.japan_post_bank_symbol
                                                }
                                                -
                                                {
                                                    finalized.japan_post_bank_number
                                                }
                                            </p>
                                            <p>
                                                {
                                                    finalized.japan_post_bank_account_holder
                                                }
                                            </p>
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
