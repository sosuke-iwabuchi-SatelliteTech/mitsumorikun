import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { EstimateTemplate } from '@/types/estimateTemplate';
import EstimateTemplateForm from '@/Components/EstimateTemplateForm';

interface Props extends PageProps {
    template: EstimateTemplate;
    invoiceItems: any[];
}

export default function Edit({ auth, template, invoiceItems }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    テンプレート編集: {template.name}
                </h2>
            }
        >
            <Head title="テンプレート編集" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <EstimateTemplateForm
                                template={template}
                                invoiceItems={invoiceItems}
                                submitRoute={route(
                                    'estimate-templates.update',
                                    template.id
                                )}
                                submitMethod="patch"
                                backRoute={route('estimate-templates.index')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
