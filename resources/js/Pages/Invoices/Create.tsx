import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps, Customer, InvoiceItem } from '@/types';
import InvoiceForm from '@/Components/InvoiceForm';

interface Props extends PageProps {
    customers: Customer[];
    invoiceItems: any[]; // Use any for now or define a more specific type
}

export default function Create({ auth, customers, invoiceItems }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    新規見積作成
                </h2>
            }
        >
            <Head title="新規見積作成" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <InvoiceForm
                                customers={customers}
                                invoiceItems={invoiceItems}
                                submitRoute={route('invoices.store')}
                                submitMethod="post"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
