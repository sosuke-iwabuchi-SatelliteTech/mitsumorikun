import { Invoice } from '@/types/invoice';

interface Props {
    status: Invoice['status'];
}

const statusMap = {
    creating: { label: '見積作成中', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    submitted: { label: '見積提出済み', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    order_received: { label: '受注', color: 'bg-green-100 text-green-800 border-green-200' },
    invoice_creating: { label: '請求書作成中', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    invoice_submitted: { label: '請求書提出済み', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    payment_confirmed: { label: '入金確認済み', color: 'bg-purple-100 text-purple-800 border-purple-200' },
};

export default function StatusBadge({ status }: Props) {
    const config = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800 border-gray-200' };

    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium shadow-sm ${config.color}`}>
            {config.label}
        </span>
    );
}
