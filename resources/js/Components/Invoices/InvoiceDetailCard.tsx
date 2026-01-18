import { Reorder } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { FormDetail } from './InvoiceDetailRow';

interface Props {
    line: FormDetail;
    index: number;
    updateLine: (index: number, field: string, value: any) => void;
    removeLine: (index: number) => void;
}

export default function InvoiceDetailCard({
    line,
    index,
    updateLine,
    removeLine,
}: Props) {
    return (
        <Reorder.Item
            key={line.tempId}
            value={line}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
                opacity: 0,
                scale: 0.95,
                height: 0,
                marginBottom: 0,
                overflow: 'hidden',
            }}
            transition={{ duration: 0.2 }}
            className="relative space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <div className="cursor-grab p-1 text-gray-400 hover:text-gray-600 active:cursor-grabbing">
                        <GripVertical className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold uppercase text-gray-500">
                        明細 #{index + 1}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => removeLine(index)}
                    className="text-sm text-red-600 hover:text-red-900"
                >
                    削除
                </button>
            </div>

            <div>
                <InputLabel value="品名" />
                <TextInput
                    className="mt-1 block w-full text-sm"
                    value={line.item_name}
                    onChange={(e) =>
                        updateLine(index, 'item_name', e.target.value)
                    }
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
                        onChange={(e) =>
                            updateLine(index, 'quantity', e.target.value)
                        }
                        required
                    />
                </div>
                <div>
                    <InputLabel value="単位" />
                    <TextInput
                        className="mt-1 block w-full text-sm"
                        value={line.unit || ''}
                        onChange={(e) =>
                            updateLine(index, 'unit', e.target.value)
                        }
                    />
                </div>
                <div>
                    <InputLabel value="税" />
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={line.tax_classification}
                        onChange={(e) =>
                            updateLine(
                                index,
                                'tax_classification',
                                e.target.value
                            )
                        }
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
                    onChange={(e) =>
                        updateLine(index, 'unit_price', e.target.value)
                    }
                    required
                />
            </div>

            <div className="flex items-center justify-between border-t pt-2 text-sm">
                <span className="text-gray-500">金額:</span>
                <span className="font-bold">
                    ¥
                    {(
                        Number(line.quantity) * Number(line.unit_price)
                    ).toLocaleString()}
                </span>
            </div>
        </Reorder.Item>
    );
}
