import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Invoice } from '@/types/invoice';
import { format } from 'date-fns';

interface Props extends PageProps {
    invoice: Invoice;
    finalizedInvoices: Invoice[];
}

const getDocType = (type: string) => {
    return type === 'invoice' ? '請求書' : '見積書';
};

export default function FinalizedList({ auth, invoice, finalizedInvoices }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        作成済みデータ一覧: {invoice.estimate_number}
                    </h2>
                    <Link
                        href={route('invoices.show', invoice.id)}
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        戻る
                    </Link>
                </div>
            }
        >
            <Head title="作成済みデータ一覧" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">
                                {invoice.title} の作成済みデータ
                            </h3>

                            {!finalizedInvoices || finalizedInvoices.length === 0 ? (
                                <p className="text-gray-500 text-center py-10">保存されたデータがありません。</p>
                            ) : (
                                <div className="flow-root">
                                    <ul role="list" className="-mb-8">
                                        {finalizedInvoices.map((version, idx) => {
                                            return (
                                                <li key={version.id}>
                                                    <div 
                                                        className="relative pb-8 cursor-pointer group"
                                                        onClick={() => router.get(route('invoices.finalized.show', [invoice.id, version.id]))}
                                                    >
                                                        {idx !== finalizedInvoices.length - 1 ? (
                                                            <span
                                                                className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                                                                aria-hidden="true"
                                                            />
                                                        ) : null}
                                                        <div className="relative flex space-x-3">
                                                            <div>
                                                                <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-gray-400 group-hover:bg-indigo-500 transition-colors">
                                                                     <span className="text-white text-xs font-bold">
                                                                          v{version.version}
                                                                     </span>
                                                                 </span>
                                                             </div>
                                                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                                <div>
                                                                    <p className="text-sm text-gray-500">
                                                                        <span className="font-medium text-indigo-600 group-hover:text-indigo-900">
                                                                             {getDocType(version.document_type || 'estimate')} (v{version.version})
                                                                         </span>
                                                                     </p>
                                                                    <p className="mt-1 text-sm text-gray-500">
                                                                        金額: ¥{Number(version.total_amount).toLocaleString()}
                                                                    </p>
                                                                </div>
                                                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                                    <time dateTime={version.created_at}>
                                                                        {format(new Date(version.created_at), 'yyyy-MM-dd HH:mm')}
                                                                    </time>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
