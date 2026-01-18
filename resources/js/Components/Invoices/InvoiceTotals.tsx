interface Props {
    totalAmount: number;
    taxAmount: number;
}

export default function InvoiceTotals({ totalAmount, taxAmount }: Props) {
    return (
        <div className="flex flex-col items-end space-y-2 border-t pt-4">
            <div className="flex space-x-8 text-sm">
                <span className="text-gray-500">税抜合計:</span>
                <span className="font-medium">
                    ¥{(totalAmount - taxAmount).toLocaleString()}
                </span>
            </div>
            <div className="flex space-x-8 text-sm">
                <span className="text-gray-500">消費税:</span>
                <span className="font-medium">
                    ¥{taxAmount.toLocaleString()}
                </span>
            </div>
            <div className="flex space-x-8 text-lg font-bold">
                <span>総計:</span>
                <span className="text-indigo-600">
                    ¥{totalAmount.toLocaleString()}
                </span>
            </div>
        </div>
    );
}
