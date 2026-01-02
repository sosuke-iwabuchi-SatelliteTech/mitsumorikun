import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps, Customer } from '@/types';
import { Invoice } from '@/types/invoice';
import InvoiceForm from '@/Components/InvoiceForm';

interface Props extends PageProps {
    invoice: Invoice;
    customers: Customer[];
    invoiceItems: any[];
}

export default function Edit({ auth, invoice, customers, invoiceItems }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    見積編集: {invoice.estimate_number} (Ver.{invoice.version})
                </h2>
            }
        >
            <Head title="見積編集" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <InvoiceForm
                                invoice={invoice}
                                customers={customers}
                                invoiceItems={invoiceItems}
                                submitRoute={route('invoices.update', invoice.id)}
                                submitMethod="patch"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
