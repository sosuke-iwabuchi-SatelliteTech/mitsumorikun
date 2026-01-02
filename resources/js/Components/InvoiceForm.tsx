import { useForm } from '@inertiajs/react';
import { Invoice, InvoiceDetail } from '@/types/invoice';
import { Customer } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useEffect } from 'react';

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
        })) || [{
            item_name: '',
            quantity: 1,
            unit_price: 0,
            unit: '',
            tax_rate: 0.10,
            tax_classification: 'exclusive' as const,
            amount: 0,
            group_name: '',
            remarks: '',
        }]
    });

    const calculateTotals = (details: any[]) => {
        let total = 0;
        let tax = 0;

        details.forEach(item => {
            const amount = Number(item.quantity) * Number(item.unit_price);
            total += amount;
            if (item.tax_classification === 'exclusive') {
                tax += amount * Number(item.tax_rate);
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
            newDetails[index].amount = Number(newDetails[index].quantity) * Number(newDetails[index].unit_price);
        }

        setData('details', newDetails);
    };

    const handleItemSelect = (index: number, itemId: string) => {
        const item = invoiceItems.find(i => String(i.id) === itemId);
        if (item) {
            const newDetails = [...data.details];
            newDetails[index] = {
                ...newDetails[index],
                item_name: item.name,
                quantity: Number(item.quantity),
                unit_price: Number(item.unit_price),
                unit: item.unit,
                tax_rate: item.tax_rate / 100,
                tax_classification: item.tax_type === 'inc' ? 'inclusive' : 'exclusive',
                amount: Number(item.quantity) * Number(item.unit_price)
            };
            setData('details', newDetails);
        }
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
                    <button
                        type="button"
                        onClick={addLine}
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        行追加
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">マスタ選択</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">品名</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">数量</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">単位</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">単価</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">金額</th>
                                <th className="px-3 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.details.map((line, index) => (
                                <tr key={index}>
                                    <td className="px-3 py-2">
                                        <select
                                            className="block w-full rounded-md border-gray-300 text-sm"
                                            onChange={(e) => handleItemSelect(index, e.target.value)}
                                            value=""
                                        >
                                            <option value="">選択...</option>
                                            {invoiceItems.map(item => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
        </form>
    );
}
