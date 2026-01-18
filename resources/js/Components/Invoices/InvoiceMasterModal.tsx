import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';

export interface InvoiceItemMaster {
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
    isOpen: boolean;
    onClose: () => void;
    onSelect: (item: InvoiceItemMaster) => void;
    items: InvoiceItemMaster[];
}

export default function InvoiceMasterModal({
    isOpen,
    onClose,
    onSelect,
    items,
}: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                        明細マスタから引用
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="mb-4">
                    <TextInput
                        className="block w-full"
                        placeholder="名称や備考で検索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="max-h-96 overflow-y-auto rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="sticky top-0 bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                                    品名
                                </th>
                                <th className="w-32 px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                                    単価
                                </th>
                                <th className="w-20 px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                                    単位
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {filteredItems.map((item) => (
                                <tr
                                    key={item.id}
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => onSelect(item)}
                                >
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        {item.name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        ¥{item.unit_price.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {item.unit}
                                    </td>
                                </tr>
                            ))}
                            {filteredItems.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-4 py-8 text-center text-sm text-gray-500"
                                    >
                                        見つかりませんでした
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose} disabled={false}>
                        キャンセル
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}
