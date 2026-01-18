import { useForm, Link } from '@inertiajs/react';
import { EstimateTemplate } from '@/types/estimateTemplate';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { useEffect, useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InvoiceItemMaster {
    id: number;
    name: string;
    quantity: number;
    unit_price: number;
    unit: string | null;
    tax_type: 'inc' | 'exc';
    remarks: string | null;
}

interface Props {
    template?: EstimateTemplate;
    invoiceItems: InvoiceItemMaster[];
    submitRoute: string;
    submitMethod: 'post' | 'put' | 'patch';
    backRoute: string;
}

export default function EstimateTemplateForm({ template, invoiceItems, submitRoute, submitMethod, backRoute }: Props) {
    const { data, setData, post, put, patch, processing, errors } = useForm({
        name: template?.name || '',
        remarks: template?.remarks || '',
        details: template?.details?.map(d => ({
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

    const filteredMasterItems = invoiceItems.filter(item =>
        item.name.toLowerCase().includes(masterSearchQuery.toLowerCase())
    );

    const addLine = () => {
        setData('details', [...data.details, {
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
        <Fragment>
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="テンプレート名" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        placeholder="例：片付け作業テンプレート"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="remarks" value="備考（任意）" />
                    <TextInput
                        id="remarks"
                        className="mt-1 block w-full"
                        value={data.remarks}
                        onChange={(e) => setData('remarks', e.target.value)}
                        placeholder="テンプレートの説明など"
                    />
                    <InputError message={errors.remarks} className="mt-2" />
                </div>

                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">明細項目</h3>
                    </div>

                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">品名</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">数量</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">単位</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">税</th>
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

                <div className="flex justify-end gap-x-4">
                    <Link
                        href={backRoute}
                        className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 flex items-center"
                    >
                        キャンセル
                    </Link>
                    <PrimaryButton disabled={processing}>
                        テンプレートを保存
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
        </Fragment>
    );
}
