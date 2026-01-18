import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import EstimateTemplateForm from '@/Components/EstimateTemplateForm';

interface Props extends PageProps {
    invoiceItems: any[];
}

export default function Create({ auth, invoiceItems }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    新規テンプレート作成
                </h2>
            }
        >
            <Head title="新規テンプレート作成" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <EstimateTemplateForm
                                invoiceItems={invoiceItems}
                                submitRoute={route('estimate-templates.store')}
                                submitMethod="post"
                                backRoute={route('estimate-templates.index')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
