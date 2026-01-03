import { useForm } from '@inertiajs/react';
import { Invoice, InvoiceDetail } from '@/types/invoice';
import { Customer } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    submitRoute: string;
    submitMethod: 'post' | 'put' | 'patch';
}

export default function InvoiceForm({ invoice, customers, invoiceItems, submitRoute, submitMethod }: Props) {
    const { data, setData, post, put, patch, processing, errors } = useForm({
        customer_id: invoice?.customer_id || '',
        title: invoice?.title || '',
        estimate_date: invoice?.estimate_date ? new Date(invoice.estimate_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        delivery_deadline: invoice?.delivery_deadline ? new Date(invoice.delivery_deadline).toISOString().split('T')[0] : '',
        construction_address: invoice?.construction_address || '',
        payment_terms: invoice?.payment_terms || '',
        expiration_date: invoice?.expiration_date ? new Date(invoice.expiration_date).toISOString().split('T')[0] : '',
        remarks: invoice?.remarks || '',
        total_amount: invoice?.total_amount || 0,
        tax_amount: invoice?.tax_amount || 0,
        details: invoice?.details?.map(d => ({
            item_name: d.item_name,
            quantity: Number(d.quantity),
            unit_price: Number(d.unit_price),
            unit: d.unit,
            tax_rate: Number(d.tax_rate),
            tax_classification: d.tax_classification,
            amount: Number(d.amount),
            group_name: d.group_name,
            remarks: d.remarks,
        })) || []
    });

    const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
    const [masterSearchQuery, setMasterSearchQuery] = useState('');

    const filteredMasterItems = invoiceItems.filter(item =>
        item.name.toLowerCase().includes(masterSearchQuery.toLowerCase())
    );

    const calculateTotals = (details: any[]) => {
        let total = 0;
        let tax = 0;

        details.forEach(item => {
            const amount = Math.floor(Number(item.quantity) * Number(item.unit_price));
            total += amount;
            if (item.tax_classification === 'exclusive') {
                tax += Math.floor(amount * Number(item.tax_rate));
            }
        });

        return { total_amount: total + tax, tax_amount: tax };
    };

    useEffect(() => {
        const { total_amount, tax_amount } = calculateTotals(data.details);
        setData(d => ({ ...d, total_amount, tax_amount }));
    }, [data.details]);

    const addLine = () => {
        setData('details', [...data.details, {
            item_name: '',
            quantity: 1,
            unit_price: 0,
            unit: '',
            tax_rate: 0.10,
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
        
        if (field === 'quantity' || field === 'unit_price') {
            newDetails[index].amount = Math.floor(Number(newDetails[index].quantity) * Number(newDetails[index].unit_price));
        }

        setData('details', newDetails);
    };

    const handleMasterSelect = (item: InvoiceItemMaster) => {
        setData('details', [...data.details, {
            item_name: item.name,
            quantity: Number(item.quantity),
            unit_price: Number(item.unit_price),
            unit: item.unit,
            tax_rate: item.tax_rate / 100,
            tax_classification: item.tax_type === 'inc' ? 'inclusive' : 'exclusive',
            amount: Math.floor(Number(item.quantity) * Number(item.unit_price)),
            group_name: '',
            remarks: item.remarks || '',
        }]);
        setIsMasterModalOpen(false);
        setMasterSearchQuery('');
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (submitMethod === 'post') post(submitRoute);
        else if (submitMethod === 'put') put(submitRoute);
        else patch(submitRoute);
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <InputLabel htmlFor="customer_id" value="顧客" />
                    <select
                        id="customer_id"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={data.customer_id}
                        onChange={(e) => setData('customer_id', e.target.value)}
                        required
                    >
                        <option value="">選択してください</option>
                        {customers.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
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
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">品名</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">数量</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">単位</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">単価</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">金額</th>
                                <th className="px-3 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <AnimatePresence initial={false}>
                                {data.details.map((line, index) => (
                                    <motion.tr
                                        key={index}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
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
                                            <TextInput
                                                type="number"
                                                className="block w-full text-sm"
                                                value={line.unit_price}
                                                onChange={(e) => updateLine(index, 'unit_price', e.target.value)}
                                                required
                                            />
                                        </td>
                                        <td className="px-3 py-2 text-sm text-right font-medium">
                                            ¥{(line.quantity * line.unit_price).toLocaleString()}
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
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Mobile view */}
                <div className="md:hidden space-y-4">
                    <AnimatePresence initial={false}>
                        {data.details.map((line, index) => (
                            <motion.div
                                key={index}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0, overflow: 'hidden' }}
                                transition={{ duration: 0.2 }}
                                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3"
                            >
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-gray-500 uppercase">明細 #{index + 1}</span>
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
                                    <span className="font-bold">¥{(line.quantity * line.unit_price).toLocaleString()}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
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
                </div>
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
                <PrimaryButton disabled={processing}>
                    保存する
                </PrimaryButton>
            </div>

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
        </form>
    );
}
