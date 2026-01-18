import { useForm, Link, router } from '@inertiajs/react';
import api from '@/Utils/api';
import { Invoice } from '@/types/invoice';
import { Customer } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useEffect, useState, Fragment } from 'react';
import { AnimatePresence, Reorder } from 'framer-motion';
import { formatDate } from '@/Utils/date';
import { EstimateTemplate } from '@/types/estimateTemplate';
import { useInvoiceTotalsEffect } from '@/Hooks/useInvoiceCalculations';
import InvoiceDetailRow, { FormDetail } from './Invoices/InvoiceDetailRow';
import InvoiceDetailCard from './Invoices/InvoiceDetailCard';
import InvoiceTotals from './Invoices/InvoiceTotals';
import InvoiceMasterModal, {
    InvoiceItemMaster,
} from './Invoices/InvoiceMasterModal';
import CustomerSelectModal from './Invoices/CustomerSelectModal';
import InvoiceTemplateModals from './Invoices/InvoiceTemplateModals';

interface Props {
    invoice?: Invoice;
    customers: Customer[];
    invoiceItems: InvoiceItemMaster[];
    estimateTemplates: EstimateTemplate[];
    submitRoute: string;
    submitMethod: 'post' | 'put' | 'patch';
    backRoute: string;
}

export default function InvoiceForm({
    invoice,
    customers,
    invoiceItems,
    estimateTemplates,
    submitRoute,
    submitMethod,
    backRoute,
}: Props) {
    const [localCustomers, setLocalCustomers] = useState<Customer[]>(customers);

    useEffect(() => {
        setLocalCustomers(customers);
    }, [customers]);
    const { data, setData, post, put, patch, processing, errors } = useForm<{
        customer_id: string;
        title: string;
        estimate_date: string;
        delivery_deadline: string;
        construction_address: string;
        payment_terms: string;
        expiration_date: string;
        remarks: string;
        total_amount: number;
        tax_amount: number;
        details: FormDetail[];
    }>({
        customer_id: invoice?.customer_id || '',
        title: invoice?.title || '',
        estimate_date: formatDate(
            invoice?.estimate_date || new Date().toISOString(),
            'yyyy-MM-dd'
        ),
        delivery_deadline:
            formatDate(invoice?.delivery_deadline, 'yyyy-MM-dd') === '-'
                ? ''
                : formatDate(invoice?.delivery_deadline, 'yyyy-MM-dd'),
        construction_address: invoice?.construction_address || '',
        payment_terms: invoice?.payment_terms || '',
        expiration_date:
            formatDate(invoice?.expiration_date, 'yyyy-MM-dd') === '-'
                ? ''
                : formatDate(invoice?.expiration_date, 'yyyy-MM-dd'),
        remarks: invoice?.remarks || '',
        total_amount: invoice?.total_amount || 0,
        tax_amount: invoice?.tax_amount || 0,
        details:
            invoice?.details?.map((d, index) => ({
                id: d.id, // Keep existing ID if present
                tempId: d.id || `existing-${index}`,
                item_name: d.item_name,
                quantity: Number(d.quantity),
                unit_price: Number(d.unit_price),
                unit: d.unit,
                tax_classification: d.tax_classification,
                amount: Number(d.amount),
                group_name: d.group_name,
                remarks: d.remarks,
            })) || [],
    });

    const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isApplyTemplateModalOpen, setIsApplyTemplateModalOpen] =
        useState(false);
    const [isSaveAsTemplateModalOpen, setIsSaveAsTemplateModalOpen] =
        useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);

    useInvoiceTotalsEffect(data.details, setData);

    const selectedCustomer = localCustomers.find(
        (c) => String(c.id) === String(data.customer_id)
    );

    const addLine = () => {
        setData('details', [
            ...data.details,
            {
                tempId: `new-${Date.now()}-${data.details.length}`,
                item_name: '',
                quantity: 1,
                unit_price: 0,
                unit: '',
                tax_classification: 'exclusive',
                amount: 0,
                group_name: '',
                remarks: '',
            },
        ]);
    };

    const removeLine = (index: number) => {
        const newDetails = [...data.details];
        newDetails.splice(index, 1);
        setData('details', newDetails);
    };

    const updateLine = (index: number, field: string, value: any) => {
        const newDetails = [...data.details];
        newDetails[index] = { ...newDetails[index], [field]: value };

        if (
            field === 'quantity' ||
            field === 'unit_price' ||
            field === 'tax_classification'
        ) {
            newDetails[index].amount = Math.floor(
                Number(newDetails[index].quantity) *
                    Number(newDetails[index].unit_price)
            );
        }

        setData('details', newDetails);
    };

    const handleCustomerSelect = (customer: Customer) => {
        setData('customer_id', customer.id);
        setIsCustomerModalOpen(false);
    };

    const handleApplyTemplate = (template: EstimateTemplate) => {
        if (!template.details) return;

        const newDetails = [...data.details];
        template.details.forEach((detail, index) => {
            newDetails.push({
                tempId: `template-${Date.now()}-${index}`,
                item_name: detail.item_name,
                quantity: Number(detail.quantity),
                unit_price: Number(detail.unit_price),
                unit: detail.unit,
                tax_classification: detail.tax_classification,
                amount: Math.floor(
                    Number(detail.quantity) * Number(detail.unit_price)
                ),
                group_name: detail.group_name,
                remarks: detail.remarks,
            });
        });

        setData('details', newDetails);
        setIsApplyTemplateModalOpen(false);
    };

    const handleSaveAsTemplate = async (name: string) => {
        if (!name) return;

        setIsSavingTemplate(true);
        try {
            await api.post(route('estimate-templates.store'), {
                name: name,
                remarks: `${data.title} から保存`,
                details: data.details,
            });

            setIsSaveAsTemplateModalOpen(false);
            // TODO: Ideally we should refresh the template list here,
            // but Inertia will usually do it if we redirect or refresh.
            // Since this is a modal within a form, a full reload might be disruptive.
            // For now, let's just alert the user.
            alert('テンプレートとして保存しました。');
            router.reload({ only: ['estimateTemplates'] });
        } catch (error) {
            alert('テンプレートの保存に失敗しました。');
        } finally {
            setIsSavingTemplate(false);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (submitMethod === 'post') post(submitRoute);
        else if (submitMethod === 'put') put(submitRoute);
        else patch(submitRoute);
    };

    return (
        <Fragment>
            <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="customer_name" value="顧客" />
                        <TextInput
                            id="customer_name"
                            className="mt-1 block w-full cursor-pointer bg-gray-50"
                            value={selectedCustomer?.name || ''}
                            readOnly
                            placeholder="顧客を選択してください"
                            onClick={() => setIsCustomerModalOpen(true)}
                        />
                        <InputError
                            message={errors.customer_id}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="title" value="件名" />
                        <TextInput
                            id="title"
                            className="mt-1 block w-full"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="estimate_date" value="見積日" />
                        <TextInput
                            id="estimate_date"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.estimate_date}
                            onChange={(e) =>
                                setData('estimate_date', e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.estimate_date}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="delivery_deadline"
                            value="受け渡し期日"
                        />
                        <TextInput
                            id="delivery_deadline"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.delivery_deadline}
                            onChange={(e) =>
                                setData('delivery_deadline', e.target.value)
                            }
                        />
                        <InputError
                            message={errors.delivery_deadline}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="payment_terms"
                            value="支払い条件"
                        />
                        <TextInput
                            id="payment_terms"
                            className="mt-1 block w-full"
                            value={data.payment_terms}
                            onChange={(e) =>
                                setData('payment_terms', e.target.value)
                            }
                            placeholder="末日締め翌月末払い 等"
                        />
                        <InputError
                            message={errors.payment_terms}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="expiration_date"
                            value="見積有効期限"
                        />
                        <TextInput
                            id="expiration_date"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.expiration_date}
                            onChange={(e) =>
                                setData('expiration_date', e.target.value)
                            }
                        />
                        <InputError
                            message={errors.expiration_date}
                            className="mt-2"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <InputLabel
                            htmlFor="construction_address"
                            value="工事場所"
                        />
                        <TextInput
                            id="construction_address"
                            className="mt-1 block w-full"
                            value={data.construction_address}
                            onChange={(e) =>
                                setData('construction_address', e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                            見積明細
                        </h3>
                    </div>

                    <div className="hidden overflow-x-auto md:block">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="w-8 px-1 py-3"></th>
                                    <th className="px-3 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                        品名
                                    </th>
                                    <th className="w-20 px-3 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                        数量
                                    </th>
                                    <th className="w-20 px-3 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                        単位
                                    </th>
                                    <th className="w-24 px-3 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                        税
                                    </th>
                                    <th className="w-32 px-3 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                        単価
                                    </th>
                                    <th className="w-32 px-3 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                        金額
                                    </th>
                                    <th className="px-3 py-3"></th>
                                </tr>
                            </thead>
                            <Reorder.Group
                                axis="y"
                                values={data.details}
                                onReorder={(newDetails) =>
                                    setData('details', newDetails)
                                }
                                as="tbody"
                                className="divide-y divide-gray-200 bg-white"
                            >
                                <AnimatePresence initial={false}>
                                    {data.details.map((line, index) => (
                                        <InvoiceDetailRow
                                            key={line.tempId}
                                            line={line}
                                            index={index}
                                            updateLine={updateLine}
                                            removeLine={removeLine}
                                        />
                                    ))}
                                </AnimatePresence>
                            </Reorder.Group>
                        </table>
                    </div>

                    {/* Mobile view */}
                    <div className="space-y-4 md:hidden">
                        <Reorder.Group
                            axis="y"
                            values={data.details}
                            onReorder={(newDetails) =>
                                setData('details', newDetails)
                            }
                            className="space-y-4"
                        >
                            <AnimatePresence initial={false}>
                                {data.details.map((line, index) => (
                                    <InvoiceDetailCard
                                        key={line.tempId}
                                        line={line}
                                        index={index}
                                        updateLine={updateLine}
                                        removeLine={removeLine}
                                    />
                                ))}
                            </AnimatePresence>
                        </Reorder.Group>
                        {data.details.length === 0 && (
                            <div className="rounded-lg border-2 border-dashed border-gray-200 py-8 text-center text-sm text-gray-500">
                                明細がありません
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex gap-x-2">
                        <button
                            type="button"
                            onClick={addLine}
                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            <svg
                                className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                />
                            </svg>
                            行追加
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsMasterModalOpen(true)}
                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            <svg
                                className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                />
                            </svg>
                            登録ずみから引用
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsApplyTemplateModalOpen(true)}
                            className="inline-flex items-center rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 shadow-sm ring-1 ring-inset ring-indigo-300 hover:bg-indigo-100"
                        >
                            <svg
                                className="-ml-0.5 mr-1.5 h-4 w-4 text-indigo-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                />
                            </svg>
                            テンプレートを適用
                        </button>
                    </div>
                    {data.details.length > 0 && (
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsSaveAsTemplateModalOpen(true)
                                }
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                現在の明細をテンプレートとして保存
                            </button>
                        </div>
                    )}
                </div>

                <InvoiceTotals
                    totalAmount={data.total_amount}
                    taxAmount={data.tax_amount}
                />

                <div className="flex justify-end gap-x-4">
                    <Link
                        href={backRoute}
                        className="flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        キャンセル
                    </Link>
                    <PrimaryButton disabled={processing}>
                        保存する
                    </PrimaryButton>
                </div>
            </form>

            <InvoiceMasterModal
                isOpen={isMasterModalOpen}
                onClose={() => setIsMasterModalOpen(false)}
                items={invoiceItems}
                onSelect={(item) => {
                    setData('details', [
                        ...data.details,
                        {
                            tempId: `new-${Date.now()}-${data.details.length}`,
                            item_name: item.name,
                            quantity: Number(item.quantity),
                            unit_price: Number(item.unit_price),
                            unit: item.unit,
                            tax_classification:
                                item.tax_type === 'inc'
                                    ? 'inclusive'
                                    : 'exclusive',
                            amount: Math.floor(
                                Number(item.quantity) * Number(item.unit_price)
                            ),
                            group_name: '',
                            remarks: item.remarks || '',
                        },
                    ]);
                    setIsMasterModalOpen(false);
                }}
            />

            <CustomerSelectModal
                isOpen={isCustomerModalOpen}
                onClose={() => setIsCustomerModalOpen(false)}
                customers={localCustomers}
                onSelect={handleCustomerSelect}
            />

            <InvoiceTemplateModals
                isApplyOpen={isApplyTemplateModalOpen}
                onApplyClose={() => setIsApplyTemplateModalOpen(false)}
                isSaveOpen={isSaveAsTemplateModalOpen}
                onSaveClose={() => setIsSaveAsTemplateModalOpen(false)}
                templates={estimateTemplates}
                onApply={handleApplyTemplate}
                onSave={handleSaveAsTemplate}
                isSavingTemplate={isSavingTemplate}
            />
        </Fragment>
    );
}
