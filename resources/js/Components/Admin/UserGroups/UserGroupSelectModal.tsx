import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import { UserGroup } from '@/types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (group: UserGroup) => void;
    userGroups: UserGroup[];
}

export default function UserGroupSelectModal({
    isOpen,
    onClose,
    onSelect,
    userGroups,
}: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredGroups = userGroups.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                        既存グループを選択
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
                        placeholder="グループ名で検索..."
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
                                    グループ名
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {filteredGroups.map((group) => (
                                <tr
                                    key={group.id}
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => onSelect(group)}
                                >
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        {group.name}
                                    </td>
                                </tr>
                            ))}
                            {filteredGroups.length === 0 && (
                                <tr>
                                    <td className="px-4 py-8 text-center text-sm text-gray-500">
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
