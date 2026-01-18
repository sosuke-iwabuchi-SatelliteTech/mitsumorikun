import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Customer } from '@/types';
import { customerService } from '@/Services/customers';
import { handleApiError } from '@/Utils/apiErrors';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (customer: Customer) => void;
    customers: Customer[];
}

export default function CustomerSelectModal({
    isOpen,
    onClose,
    onSelect,
    customers,
}: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
    const [localCustomers, setLocalCustomers] = useState<Customer[]>(customers);
    const [isSubmittingQuickCustomer, setIsSubmittingQuickCustomer] =
        useState(false);
    const [ajaxErrors, setAjaxErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setLocalCustomers(customers);
    }, [customers]);

    const {
        data: customerData,
        setData: setCustomerData,
        reset: resetCustomer,
    } = useForm({
        name: '',
        contact_person_name: '',
        address: '',
    });

    const filteredCustomers = localCustomers.filter(
        (customer) =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.contact_person_name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            customer.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleQuickCustomerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingQuickCustomer(true);
        setAjaxErrors({});

        try {
            const result = await customerService.store(customerData);
            const newCustomer = result.customer;
            setLocalCustomers((prev) => [...prev, newCustomer]);
            onSelect(newCustomer);
            setIsQuickCreateOpen(false);
            resetCustomer();
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

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                {!isQuickCreateOpen ? (
                    <>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-medium text-gray-900">
                                顧客を選択
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
                                placeholder="顧客名、担当者名、住所で検索..."
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
                                            顧客名
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                                            担当者
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredCustomers.map((customer) => (
                                        <tr
                                            key={customer.id}
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() => onSelect(customer)}
                                        >
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {customer.name}
                                                </div>
                                                {customer.address && (
                                                    <div className="text-xs text-gray-500">
                                                        {customer.address}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {customer.contact_person_name}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredCustomers.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={2}
                                                className="px-4 py-8 text-center text-sm text-gray-500"
                                            >
                                                見つかりませんでした
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-between">
                            <button
                                type="button"
                                onClick={() => setIsQuickCreateOpen(true)}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                + 新しく顧客を登録する
                            </button>
                            <SecondaryButton onClick={onClose} disabled={false}>
                                キャンセル
                            </SecondaryButton>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleQuickCustomerSubmit}>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-medium text-gray-900">
                                顧客をクイック登録
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <InputLabel htmlFor="name" value="顧客名" />
                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={customerData.name}
                                    onChange={(e) =>
                                        setCustomerData('name', e.target.value)
                                    }
                                    required
                                />
                                {ajaxErrors.name && (
                                    <InputError
                                        message={ajaxErrors.name}
                                        className="mt-2"
                                    />
                                )}
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="contact_person_name"
                                    value="担当者名"
                                />
                                <TextInput
                                    id="contact_person_name"
                                    className="mt-1 block w-full"
                                    value={customerData.contact_person_name}
                                    onChange={(e) =>
                                        setCustomerData(
                                            'contact_person_name',
                                            e.target.value
                                        )
                                    }
                                />
                                {ajaxErrors.contact_person_name && (
                                    <InputError
                                        message={ajaxErrors.contact_person_name}
                                        className="mt-2"
                                    />
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="address" value="住所" />
                                <TextInput
                                    id="address"
                                    className="mt-1 block w-full"
                                    value={customerData.address}
                                    onChange={(e) =>
                                        setCustomerData(
                                            'address',
                                            e.target.value
                                        )
                                    }
                                />
                                {ajaxErrors.address && (
                                    <InputError
                                        message={ajaxErrors.address}
                                        className="mt-2"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-x-3">
                            <SecondaryButton
                                onClick={() => setIsQuickCreateOpen(false)}
                                disabled={isSubmittingQuickCustomer}
                            >
                                戻る
                            </SecondaryButton>
                            <PrimaryButton disabled={isSubmittingQuickCustomer}>
                                登録して選択
                            </PrimaryButton>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
}
