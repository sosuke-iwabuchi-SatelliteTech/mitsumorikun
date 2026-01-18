import { Reorder } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import TextInput from '@/Components/TextInput';

export interface FormDetail {
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

interface Props {
    line: FormDetail;
    index: number;
    updateLine: (index: number, field: string, value: any) => void;
    removeLine: (index: number) => void;
}

export default function InvoiceDetailRow({
    line,
    index,
    updateLine,
    removeLine,
}: Props) {
    return (
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
                <div className="cursor-grab p-1 text-gray-400 hover:text-gray-600 active:cursor-grabbing">
                    <GripVertical className="h-4 w-4" />
                </div>
            </td>
            <td className="px-3 py-2">
                <TextInput
                    className="block w-full text-sm"
                    value={line.item_name}
                    onChange={(e) =>
                        updateLine(index, 'item_name', e.target.value)
                    }
                    required
                />
            </td>
            <td className="px-3 py-2">
                <TextInput
                    type="number"
                    step="0.01"
                    className="block w-full text-sm"
                    value={line.quantity}
                    onChange={(e) =>
                        updateLine(index, 'quantity', e.target.value)
                    }
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
                    className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={line.tax_classification}
                    onChange={(e) =>
                        updateLine(index, 'tax_classification', e.target.value)
                    }
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
                    onChange={(e) =>
                        updateLine(index, 'unit_price', e.target.value)
                    }
                    required
                />
            </td>
            <td className="px-3 py-2 text-right text-sm font-medium">
                ¥
                {(
                    Number(line.quantity) * Number(line.unit_price)
                ).toLocaleString()}
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
    );
}
