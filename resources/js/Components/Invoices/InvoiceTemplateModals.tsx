import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { EstimateTemplate } from '@/types/estimateTemplate';

interface Props {
    isApplyOpen: boolean;
    onApplyClose: () => void;
    isSaveOpen: boolean;
    onSaveClose: () => void;
    templates: EstimateTemplate[];
    onApply: (template: EstimateTemplate) => void;
    onSave: (name: string) => Promise<void>;
    isSavingTemplate: boolean;
}

export default function InvoiceTemplateModals({
    isApplyOpen,
    onApplyClose,
    isSaveOpen,
    onSaveClose,
    templates,
    onApply,
    onSave,
    isSavingTemplate,
}: Props) {
    const [templateSearchQuery, setTemplateSearchQuery] = useState('');
    const [newTemplateName, setNewTemplateName] = useState('');

    const filteredTemplates = templates.filter(
        (t) =>
            t.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
            t.remarks?.toLowerCase().includes(templateSearchQuery.toLowerCase())
    );

    const handleSaveSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(newTemplateName);
        setNewTemplateName('');
    };

    return (
        <>
            <Modal show={isApplyOpen} onClose={onApplyClose} maxWidth="2xl">
                <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900">
                            テンプレートから引用
                        </h2>
                        <button
                            onClick={onApplyClose}
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
                            value={templateSearchQuery}
                            onChange={(e) =>
                                setTemplateSearchQuery(e.target.value)
                            }
                        />
                    </div>

                    <div className="max-h-96 overflow-y-auto rounded-md border">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="sticky top-0 bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                                        テンプレート名
                                    </th>
                                    <th className="w-20 px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                                        項目数
                                    </th>
                                    <th className="px-4 py-2 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredTemplates.map((template) => (
                                    <tr
                                        key={template.id}
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() => onApply(template)}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="text-sm font-medium text-gray-900">
                                                {template.name}
                                            </div>
                                            {template.remarks && (
                                                <div className="text-xs text-gray-500">
                                                    {template.remarks}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {template.details?.length || 0}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
                                                適用
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredTemplates.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-4 py-8 text-center text-sm text-gray-500"
                                        >
                                            テンプレートがありません
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton
                            onClick={onApplyClose}
                            disabled={false}
                        >
                            キャンセル
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>

            <Modal show={isSaveOpen} onClose={onSaveClose} maxWidth="md">
                <form onSubmit={handleSaveSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        テンプレートとして保存
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        現在の明細内容を新しいテンプレートとして保存します。
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="newTemplateName"
                            value="テンプレート名"
                        />
                        <TextInput
                            id="newTemplateName"
                            className="mt-1 block w-full"
                            value={newTemplateName}
                            onChange={(e) => setNewTemplateName(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-x-3">
                        <SecondaryButton
                            onClick={onSaveClose}
                            disabled={isSavingTemplate}
                        >
                            キャンセル
                        </SecondaryButton>
                        <PrimaryButton disabled={isSavingTemplate}>
                            保存
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </>
    );
}
