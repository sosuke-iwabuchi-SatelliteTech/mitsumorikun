import { useForm, Link, router } from '@inertiajs/react';
import api from '@/Utils/api';
import { customerService } from '@/Services/customers';
import { handleApiError, ValidationErrors } from '@/Utils/apiErrors';
import { Invoice, InvoiceDetail } from '@/types/invoice';
import { Customer } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { useEffect, useState, Fragment } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { formatDate } from '@/Utils/date';
import { GripVertical } from 'lucide-react';

import { EstimateTemplate } from '@/types/estimateTemplate';

interface InvoiceItemMaster {
    id: number;
    name: string;
    quantity: number;
    unit_price: number;
    unit: string | null;
    tax_type: 'inc' | 'exc';
    tax_rate: number;
    remarks: string | null;
}

interface Props {
    invoice?: Invoice;
    customers: Customer[];
    invoiceItems: InvoiceItemMaster[];
    estimateTemplates: EstimateTemplate[];
    submitRoute: string;
    submitMethod: 'post' | 'put' | 'patch';
    backRoute: string;
}

interface FormDetail {
    id?: string;
    tempId: string;
    item_name: string;
    quantity: number | string;
    unit_price: number | string;
    unit: string | null;
    tax_classification: 'inclusive' | 'exclusive';
    amount: number;
    group_name: string | null;
    remarks: string | null;
}

export default function InvoiceForm({ invoice, customers, invoiceItems, estimateTemplates, submitRoute, submitMethod, backRoute }: Props) {
    const [localCustomers, setLocalCustomers] = useState<Customer[]>(customers);
    
    // テンプレート機能関連の状態
    const [isApplyTemplateModalOpen, setIsApplyTemplateModalOpen] = useState(false);
    const [isSaveAsTemplateModalOpen, setIsSaveAsTemplateModalOpen] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);


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
        estimate_date: formatDate(invoice?.estimate_date || new Date().toISOString(), 'yyyy-MM-dd'),
        delivery_deadline: formatDate(invoice?.delivery_deadline, 'yyyy-MM-dd') === '-' ? '' : formatDate(invoice?.delivery_deadline, 'yyyy-MM-dd'),
        construction_address: invoice?.construction_address || '',
        payment_terms: invoice?.payment_terms || '',
        expiration_date: formatDate(invoice?.expiration_date, 'yyyy-MM-dd') === '-' ? '' : formatDate(invoice?.expiration_date, 'yyyy-MM-dd'),
        remarks: invoice?.remarks || '',
        total_amount: invoice?.total_amount || 0,
        tax_amount: invoice?.tax_amount || 0,
        details: invoice?.details?.map((d, index) => ({
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
        })) || []
    });

    const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
    const [masterSearchQuery, setMasterSearchQuery] = useState('');
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [customerSearchQuery, setCustomerSearchQuery] = useState('');
    const [templateSearchQuery, setTemplateSearchQuery] = useState('');
    const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

    const { data: customerData, setData: setCustomerData, post: postCustomer, processing: customerProcessing, errors: customerErrors, reset: resetCustomer } = useForm({
        name: '',
        contact_person_name: '',
        address: '',
    });

    const filteredMasterItems = invoiceItems.filter(item =>
        item.name.toLowerCase().includes(masterSearchQuery.toLowerCase())
    );

    const filteredCustomers = localCustomers.filter(customer =>
        customer.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
        customer.contact_person_name?.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
        customer.address?.toLowerCase().includes(customerSearchQuery.toLowerCase())
    );

    const filteredTemplates = estimateTemplates.filter(template =>
        template.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
        template.remarks?.toLowerCase().includes(templateSearchQuery.toLowerCase())
    );

    const selectedCustomer = localCustomers.find(c => c.id === data.customer_id);

    const calculateTotals = (details: any[]) => {
        let grandTotal = 0;
        let totalTax = 0;

        details.forEach(item => {
            const amount = Math.floor(Number(item.quantity) * Number(item.unit_price));
            const taxRate = 0.10;
            
            if (item.tax_classification === 'exclusive') {
                const tax = Math.trunc(amount * taxRate);
                grandTotal += amount + tax;
                totalTax += tax;
            } else {
                // For inclusive, the amount already includes tax.
                // Tax = Amount - (Amount / (1 + rate))
                // We truncate the tax amount to round towards zero for both positive and negative values.
                const tax = Math.trunc(amount - (amount / (1 + taxRate)));
                grandTotal += amount;
                totalTax += tax;
            }
        });

        return { total_amount: grandTotal, tax_amount: totalTax };
    };

    useEffect(() => {
        const { total_amount, tax_amount } = calculateTotals(data.details);
        setData(d => ({ ...d, total_amount, tax_amount }));
    }, [data.details]);

    const addLine = () => {
        setData('details', [...data.details, {
            tempId: `new-${Date.now()}-${data.details.length}`,
            item_name: '',
            quantity: 1,
            unit_price: 0,
            unit: '',
            tax_classification: 'exclusive',
            amount: 0,
            group_name: '',
            remarks: '',
        }]);
    };

    const removeLine = (index: number) => {
        const newDetails = [...data.details];
        newDetails.splice(index, 1);
        setData('details', newDetails);
    };

    const updateLine = (index: number, field: string, value: any) => {
        const newDetails = [...data.details];
        newDetails[index] = { ...newDetails[index], [field]: value };
        
        if (field === 'quantity' || field === 'unit_price' || field === 'tax_classification') {
            newDetails[index].amount = Math.floor(Number(newDetails[index].quantity) * Number(newDetails[index].unit_price));
        }

        setData('details', newDetails);
    };

    const handleMasterSelect = (item: InvoiceItemMaster) => {
        setData('details', [...data.details, {
            tempId: `new-${Date.now()}-${data.details.length}`,
            item_name: item.name,
            quantity: Number(item.quantity),
            unit_price: Number(item.unit_price),
            unit: item.unit,
            tax_classification: item.tax_type === 'inc' ? 'inclusive' : 'exclusive',
            amount: Math.floor(Number(item.quantity) * Number(item.unit_price)),
            group_name: '',
            remarks: item.remarks || '',
        }]);
        setIsMasterModalOpen(false);
        setMasterSearchQuery('');
    };

    const handleCustomerSelect = (customer: Customer) => {
        setData('customer_id', customer.id);
        setIsCustomerModalOpen(false);
        setCustomerSearchQuery('');
        setIsQuickCreateOpen(false);
    };

    const [isSubmittingQuickCustomer, setIsSubmittingQuickCustomer] = useState(false);
    const [ajaxErrors, setAjaxErrors] = useState<ValidationErrors>({});

    const handleQuickCustomerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSubmittingQuickCustomer(true);
        setAjaxErrors({});

        try {
            const data = await customerService.store(customerData);

            const newCustomer = data.customer;
            setLocalCustomers(prev => [...prev, newCustomer]);
            setData('customer_id', newCustomer.id);
            
            setIsCustomerModalOpen(false);
            setIsQuickCreateOpen(false);
            resetCustomer();
            setCustomerSearchQuery('');
        } catch (error: any) {
            const { errors, message } = handleApiError(error);
            if (errors) {
                setAjaxErrors(errors);
            } else {
                alert(message);
            }
        } finally {
            setIsSubmittingQuickCustomer(false);
        }
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
                amount: Math.floor(Number(detail.quantity) * Number(detail.unit_price)),
                group_name: detail.group_name,
                remarks: detail.remarks,
            });
        });

        setData('details', newDetails);
        setIsApplyTemplateModalOpen(false);
    };

    const handleSaveAsTemplate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTemplateName) return;
        
        setIsSavingTemplate(true);
        try {
            await api.post(route('estimate-templates.store'), {
                name: newTemplateName,
                remarks: `${data.title} から保存`,
                details: data.details
            });
            
            setIsSaveAsTemplateModalOpen(false);
            setNewTemplateName('');
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
                        className="mt-1 block w-full bg-gray-50 cursor-pointer"
                        value={selectedCustomer?.name || ''}
                        readOnly
                        placeholder="顧客を選択してください"
                        onClick={() => setIsCustomerModalOpen(true)}
                    />
                    <InputError message={errors.customer_id} className="mt-2" />
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
                        onChange={(e) => setData('estimate_date', e.target.value)}
                        required
                    />
                    <InputError message={errors.estimate_date} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="delivery_deadline" value="受け渡し期日" />
                    <TextInput
                        id="delivery_deadline"
                        type="date"
                        className="mt-1 block w-full"
                        value={data.delivery_deadline}
                        onChange={(e) => setData('delivery_deadline', e.target.value)}
                    />
                    <InputError message={errors.delivery_deadline} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="payment_terms" value="支払い条件" />
                    <TextInput
                        id="payment_terms"
                        className="mt-1 block w-full"
                        value={data.payment_terms}
                        onChange={(e) => setData('payment_terms', e.target.value)}
                        placeholder="末日締め翌月末払い 等"
                    />
                    <InputError message={errors.payment_terms} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="expiration_date" value="見積有効期限" />
                    <TextInput
                        id="expiration_date"
                        type="date"
                        className="mt-1 block w-full"
                        value={data.expiration_date}
                        onChange={(e) => setData('expiration_date', e.target.value)}
                    />
                    <InputError message={errors.expiration_date} className="mt-2" />
                </div>

                <div className="md:col-span-2">
                    <InputLabel htmlFor="construction_address" value="工事場所" />
                    <TextInput
                        id="construction_address"
                        className="mt-1 block w-full"
                        value={data.construction_address}
                        onChange={(e) => setData('construction_address', e.target.value)}
                    />
                </div>
            </div>

            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">見積明細</h3>
                </div>

                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-1 py-3 w-8"></th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">品名</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">数量</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">単位</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">税</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">単価</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">金額</th>
                                <th className="px-3 py-3"></th>
                            </tr>
                        </thead>
                        <Reorder.Group 
                            axis="y" 
                            values={data.details} 
                            onReorder={(newDetails) => setData('details', newDetails)}
                            as="tbody" 
                            className="bg-white divide-y divide-gray-200"
                        >
                            <AnimatePresence initial={false}>
                                {data.details.map((line, index) => (
                                    <Reorder.Item
                                        key={line.tempId}
                                        value={line}
                                        as="tr"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="bg-white"
                                    >
                                        <td className="px-1 py-2 text-center">
                                            <div className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600">
                                                <GripVertical className="h-4 w-4" />
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <TextInput
                                                className="block w-full text-sm"
                                                value={line.item_name}
                                                onChange={(e) => updateLine(index, 'item_name', e.target.value)}
                                                required
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <TextInput
                                                type="number"
                                                step="0.01"
                                                className="block w-full text-sm"
                                                value={line.quantity}
                                                onChange={(e) => updateLine(index, 'quantity', e.target.value)}
                                                required
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <TextInput
                                                className="block w-full text-sm"
                                                value={line.unit || ''}
                                                onChange={(e) => updateLine(index, 'unit', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <select
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                value={line.tax_classification}
                                                onChange={(e) => updateLine(index, 'tax_classification', e.target.value)}
                                            >
                                                <option value="exclusive">別</option>
                                                <option value="inclusive">込</option>
                                            </select>
                                        </td>
                                        <td className="px-3 py-2">
                                            <TextInput
                                                type="number"
                                                className="block w-full text-sm"
                                                value={line.unit_price}
                                                onChange={(e) => updateLine(index, 'unit_price', e.target.value)}
                                                required
                                            />
                                        </td>
                                        <td className="px-3 py-2 text-sm text-right font-medium">
                                            ¥{(Number(line.quantity) * Number(line.unit_price)).toLocaleString()}
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <button
                                                type="button"
                                                onClick={() => removeLine(index)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                削除
                                            </button>
                                        </td>
                                    </Reorder.Item>
                                ))}
                            </AnimatePresence>
                        </Reorder.Group>
                    </table>
                </div>

                {/* Mobile view */}
                <div className="md:hidden space-y-4">
                    <Reorder.Group 
                        axis="y" 
                        values={data.details} 
                        onReorder={(newDetails) => setData('details', newDetails)}
                        className="space-y-4"
                    >
                        <AnimatePresence initial={false}>
                            {data.details.map((line, index) => (
                                <Reorder.Item
                                    key={line.tempId}
                                    value={line}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0, overflow: 'hidden' }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3 relative"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <div className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600">
                                                <GripVertical className="h-4 w-4" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 uppercase">明細 #{index + 1}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeLine(index)}
                                            className="text-red-600 hover:text-red-900 text-sm"
                                        >
                                            削除
                                        </button>
                                    </div>
                                    
                                    <div>
                                        <InputLabel value="品名" />
                                        <TextInput
                                            className="mt-1 block w-full text-sm"
                                            value={line.item_name}
                                            onChange={(e) => updateLine(index, 'item_name', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel value="数量" />
                                            <TextInput
                                                type="number"
                                                step="0.01"
                                                className="mt-1 block w-full text-sm"
                                                value={line.quantity}
                                                onChange={(e) => updateLine(index, 'quantity', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="単位" />
                                            <TextInput
                                                className="mt-1 block w-full text-sm"
                                                value={line.unit || ''}
                                                onChange={(e) => updateLine(index, 'unit', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="税" />
                                            <select
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                value={line.tax_classification}
                                                onChange={(e) => updateLine(index, 'tax_classification', e.target.value)}
                                            >
                                                <option value="exclusive">別</option>
                                                <option value="inclusive">込</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel value="単価" />
                                        <TextInput
                                            type="number"
                                            className="mt-1 block w-full text-sm"
                                            value={line.unit_price}
                                            onChange={(e) => updateLine(index, 'unit_price', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t text-sm">
                                        <span className="text-gray-500">金額:</span>
                                        <span className="font-bold">¥{(Number(line.quantity) * Number(line.unit_price)).toLocaleString()}</span>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </AnimatePresence>
                    </Reorder.Group>
                    {data.details.length === 0 && (
                        <div className="text-center py-8 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
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
                        <svg className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        行追加
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsMasterModalOpen(true)}
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        <svg className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        登録ずみから引用
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsApplyTemplateModalOpen(true)}
                        className="inline-flex items-center rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 shadow-sm ring-1 ring-inset ring-indigo-300 hover:bg-indigo-100"
                    >
                        <svg className="-ml-0.5 mr-1.5 h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        テンプレートを適用
                    </button>
                </div>
                {data.details.length > 0 && (
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={() => setIsSaveAsTemplateModalOpen(true)}
                            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                            現在の明細をテンプレートとして保存
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-end space-y-2 border-t pt-4">
                <div className="flex space-x-8 text-sm">
                    <span className="text-gray-500">税抜合計:</span>
                    <span className="font-medium">¥{(data.total_amount - data.tax_amount).toLocaleString()}</span>
                </div>
                <div className="flex space-x-8 text-sm">
                    <span className="text-gray-500">消費税:</span>
                    <span className="font-medium">¥{data.tax_amount.toLocaleString()}</span>
                </div>
                <div className="flex space-x-8 text-lg font-bold">
                    <span>総計:</span>
                    <span className="text-indigo-600">¥{data.total_amount.toLocaleString()}</span>
                </div>
            </div>

            <div className="flex justify-end gap-x-4">
                <Link
                    href={backRoute}
                    className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 flex items-center"
                >
                    キャンセル
                </Link>
                <PrimaryButton disabled={processing}>
                    保存する
                </PrimaryButton>
            </div>
        </form>

        <Modal show={isMasterModalOpen} onClose={() => setIsMasterModalOpen(false)} maxWidth="2xl">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-gray-900">マスタから引用</h2>
                        <button onClick={() => setIsMasterModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">閉じる</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="mb-4">
                        <TextInput
                            type="text"
                            placeholder="品名で検索..."
                            className="block w-full"
                            value={masterSearchQuery}
                            onChange={(e) => setMasterSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="max-h-96 overflow-y-auto border rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">品名</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-32">単価</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-20">単位</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredMasterItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleMasterSelect(item)}>
                                        <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">¥{item.unit_price.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{item.unit}</td>
                                    </tr>
                                ))}
                                {filteredMasterItems.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500">
                                            見つかりませんでした
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setIsMasterModalOpen(false)} disabled={false}>
                            キャンセル
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
            <Modal show={isCustomerModalOpen} onClose={() => setIsCustomerModalOpen(false)} maxWidth="2xl">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-gray-900">顧客を選択</h2>
                        <button onClick={() => setIsCustomerModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">閉じる</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="mb-4 flex items-center justify-between gap-x-4">
                        <div className="flex-grow">
                            <TextInput
                                type="text"
                                placeholder="顧客名、担当者名、住所で検索..."
                                className="block w-full"
                                value={customerSearchQuery}
                                onChange={(e) => {
                                    setCustomerSearchQuery(e.target.value);
                                    if (isQuickCreateOpen) setIsQuickCreateOpen(false);
                                }}
                                autoFocus
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
                            className="inline-flex items-center rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                        >
                            {isQuickCreateOpen ? '検索に戻る' : '新規登録'}
                        </button>
                    </div>

                    {!isQuickCreateOpen ? (
                        <div className="max-h-96 overflow-y-auto border rounded-md">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">顧客名</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">担当者</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">住所</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleCustomerSelect(customer)}>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">{customer.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{customer.contact_person_name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{customer.address}</td>
                                        </tr>
                                    ))}
                                    {filteredCustomers.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500">
                                                <p>見つかりませんでした</p>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickCreateOpen(true);
                                                        setCustomerData('name', customerSearchQuery);
                                                    }}
                                                    className="mt-2 text-indigo-600 hover:text-indigo-500 font-medium"
                                                >
                                                    「{customerSearchQuery}」で新規登録する
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <form onSubmit={handleQuickCustomerSubmit} className="space-y-4 p-4 border rounded-md bg-gray-50">
                            <h3 className="text-sm font-bold text-gray-700">顧客の簡易登録</h3>
                            <div>
                                <InputLabel value="顧客名称" />
                                <TextInput
                                    className="mt-1 block w-full"
                                    value={customerData.name}
                                    onChange={(e) => setCustomerData('name', e.target.value)}
                                    required
                                />
                                <InputError message={ajaxErrors.name} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel value="担当者名" />
                                <TextInput
                                    className="mt-1 block w-full"
                                    value={customerData.contact_person_name}
                                    onChange={(e) => setCustomerData('contact_person_name', e.target.value)}
                                />
                                <InputError message={ajaxErrors.contact_person_name} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel value="住所" />
                                <TextInput
                                    className="mt-1 block w-full"
                                    value={customerData.address}
                                    onChange={(e) => setCustomerData('address', e.target.value)}
                                />
                                <InputError message={ajaxErrors.address} className="mt-2" />
                            </div>
                            <div className="flex justify-end gap-x-2 pt-2">
                                <SecondaryButton onClick={() => setIsQuickCreateOpen(false)} disabled={isSubmittingQuickCustomer}>
                                    キャンセル
                                </SecondaryButton>
                                <PrimaryButton disabled={isSubmittingQuickCustomer}>
                                    登録して選択
                                </PrimaryButton>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setIsCustomerModalOpen(false)} disabled={false}>
                            キャンセル
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>

            <Modal show={isApplyTemplateModalOpen} onClose={() => setIsApplyTemplateModalOpen(false)} maxWidth="2xl">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-gray-900">テンプレートを適用</h2>
                        <button onClick={() => setIsApplyTemplateModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">閉じる</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="mb-4">
                        <TextInput
                            className="w-full"
                            placeholder="名称や備考で検索..."
                            value={templateSearchQuery}
                            onChange={(e) => setTemplateSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="max-h-96 overflow-y-auto border rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">テンプレート名</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-20">項目数</th>
                                    <th className="px-4 py-2 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTemplates.map((template) => (
                                    <tr key={template.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleApplyTemplate(template)}>
                                        <td className="px-4 py-3">
                                            <div className="text-sm font-medium text-gray-900">{template.name}</div>
                                            {template.remarks && <div className="text-xs text-gray-500">{template.remarks}</div>}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{template.details?.length || 0}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">適用</span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredTemplates.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500">
                                            テンプレートがありません
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setIsApplyTemplateModalOpen(false)} disabled={false}>
                            キャンセル
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>

            <Modal show={isSaveAsTemplateModalOpen} onClose={() => setIsSaveAsTemplateModalOpen(false)} maxWidth="md">
                <form onSubmit={handleSaveAsTemplate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">テンプレートとして保存</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        現在の明細内容を新しいテンプレートとして保存します。
                    </p>
                    
                    <div className="mt-6">
                        <InputLabel htmlFor="newTemplateName" value="テンプレート名" />
                        <TextInput
                            id="newTemplateName"
                            className="mt-1 block w-full"
                            value={newTemplateName}
                            onChange={(e) => setNewTemplateName(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-x-3">
                        <SecondaryButton onClick={() => setIsSaveAsTemplateModalOpen(false)} disabled={isSavingTemplate}>
                            キャンセル
                        </SecondaryButton>
                        <PrimaryButton disabled={isSavingTemplate}>
                            保存
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </Fragment>
    );
}
