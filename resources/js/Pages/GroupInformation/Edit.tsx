import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';

interface UserGroupDetail {
    invoice_company_name?: string;
    invoice_registration_number?: string;
    zip_code?: string;
    address1?: string;
    address2?: string;
    phone_number?: string;
    fax_number?: string;
    email?: string;
    seal_image_path?: string;
    account_method?: 'bank' | 'japan_post' | 'none';
    bank_name?: string;
    branch_name?: string;
    account_type?: string;
    account_number?: string;
    account_holder?: string;
    japan_post_bank_symbol?: string;
    japan_post_bank_number?: string;
    japan_post_bank_account_holder?: string;
    pdf_font?: 'ipa' | 'klee';
}

interface UserGroup {
    id: string;
    name: string;
    detail?: UserGroupDetail;
}

export default function Edit({ userGroup }: { userGroup: UserGroup }) {
    const [activeTab, setActiveTab] = useState<'basic' | 'account'>('basic');

    const basicForm = useForm({
        invoice_company_name: userGroup.detail?.invoice_company_name || '',
        invoice_registration_number: userGroup.detail?.invoice_registration_number || '',
        zip_code: userGroup.detail?.zip_code || '',
        address1: userGroup.detail?.address1 || '',
        address2: userGroup.detail?.address2 || '',
        phone_number: userGroup.detail?.phone_number || '',
        fax_number: userGroup.detail?.fax_number || '',
        email: userGroup.detail?.email || '',
        pdf_font: userGroup.detail?.pdf_font || 'ipa',
        seal_image: null as File | null,
        delete_seal: false,
    });

    const accountForm = useForm({
        account_method: userGroup.detail?.account_method || 'bank',
        bank_name: userGroup.detail?.bank_name || '',
        branch_name: userGroup.detail?.branch_name || '',
        account_type: userGroup.detail?.account_type || '',
        account_number: userGroup.detail?.account_number || '',
        account_holder: userGroup.detail?.account_holder || '',
        japan_post_bank_symbol: userGroup.detail?.japan_post_bank_symbol || '',
        japan_post_bank_number: userGroup.detail?.japan_post_bank_number || '',
        japan_post_bank_account_holder: userGroup.detail?.japan_post_bank_account_holder || '',
    });

    const submitBasic: FormEventHandler = (e) => {
        e.preventDefault();
        // Laravel doesn't support PATCH with multipart/form-data, so we use POST with manual _method
        basicForm.post(route('group-information.update-basic'), {
            forceFormData: true,
            onSuccess: () => {
                basicForm.setData({
                    ...basicForm.data,
                    seal_image: null,
                    delete_seal: false,
                });
            },
        });
    };

    const submitAccount: FormEventHandler = (e) => {
        e.preventDefault();
        accountForm.patch(route('group-information.update-account'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    会社情報管理
                </h2>
            }
        >
            <Head title="会社情報管理" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('basic')}
                                    className={`${
                                        activeTab === 'basic'
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
                                >
                                    見積/請求書記載事項
                                </button>
                                <button
                                    onClick={() => setActiveTab('account')}
                                    className={`${
                                        activeTab === 'account'
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
                                >
                                    口座情報
                                </button>
                            </nav>
                        </div>

                        {activeTab === 'basic' && (
                            <form onSubmit={submitBasic} className="mt-6 space-y-6">
                                <div className="space-y-6">
                                    <div>
                                        <InputLabel htmlFor="invoice_company_name" value="会社名（見積・請求書記載用）" />
                                        <TextInput
                                            id="invoice_company_name"
                                            className="mt-1 block w-full"
                                            value={basicForm.data.invoice_company_name}
                                            onChange={(e) => basicForm.setData('invoice_company_name', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={basicForm.errors.invoice_company_name} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="invoice_registration_number" value="Invoice登録番号" />
                                        <TextInput
                                            id="invoice_registration_number"
                                            className="mt-1 block w-full"
                                            value={basicForm.data.invoice_registration_number}
                                            onChange={(e) => basicForm.setData('invoice_registration_number', e.target.value)}
                                            placeholder='T1234567890123'
                                        />
                                        <InputError className="mt-2" message={basicForm.errors.invoice_registration_number} />
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <InputLabel htmlFor="zip_code" value="郵便番号" />
                                            <TextInput
                                                id="zip_code"
                                                className="mt-1 block w-full"
                                                value={basicForm.data.zip_code}
                                                onChange={(e) => basicForm.setData('zip_code', e.target.value)}
                                            />
                                            <InputError className="mt-2" message={basicForm.errors.zip_code} />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="phone_number" value="電話番号" />
                                            <TextInput
                                                id="phone_number"
                                                className="mt-1 block w-full"
                                                value={basicForm.data.phone_number}
                                                onChange={(e) => basicForm.setData('phone_number', e.target.value)}
                                            />
                                            <InputError className="mt-2" message={basicForm.errors.phone_number} />
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="address1" value="住所1" />
                                        <TextInput
                                            id="address1"
                                            className="mt-1 block w-full"
                                            value={basicForm.data.address1}
                                            onChange={(e) => basicForm.setData('address1', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={basicForm.errors.address1} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="address2" value="住所2" />
                                        <TextInput
                                            id="address2"
                                            className="mt-1 block w-full"
                                            value={basicForm.data.address2}
                                            onChange={(e) => basicForm.setData('address2', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={basicForm.errors.address2} />
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <InputLabel htmlFor="fax_number" value="FAX番号" />
                                            <TextInput
                                                id="fax_number"
                                                className="mt-1 block w-full"
                                                value={basicForm.data.fax_number}
                                                onChange={(e) => basicForm.setData('fax_number', e.target.value)}
                                            />
                                            <InputError className="mt-2" message={basicForm.errors.fax_number} />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="email" value="Eメール" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                className="mt-1 block w-full"
                                                value={basicForm.data.email}
                                                onChange={(e) => basicForm.setData('email', e.target.value)}
                                            />
                                            <InputError className="mt-2" message={basicForm.errors.email} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <InputLabel value="社判（角印）" />
                                            <div className="mt-2 space-y-4">
                                                {/* プレビュー表示 */}
                                                {(basicForm.data.seal_image || (userGroup.detail?.seal_image_path && !basicForm.data.delete_seal)) && (
                                                    <div className="relative inline-block border rounded p-2 bg-gray-50">
                                                        <img
                                                            src={basicForm.data.seal_image 
                                                                ? URL.createObjectURL(basicForm.data.seal_image) 
                                                                : route('group-information.seal')}
                                                            alt="Seal Preview"
                                                            className="h-32 w-32 object-contain"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (basicForm.data.seal_image) {
                                                                    basicForm.setData('seal_image', null);
                                                                } else {
                                                                    basicForm.setData('delete_seal', true);
                                                                }
                                                            }}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-sm"
                                                            title="削除"
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="file"
                                                        id="seal_image"
                                                        className="hidden"
                                                        accept="image/png"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                basicForm.setData({
                                                                    ...basicForm.data,
                                                                    seal_image: file,
                                                                    delete_seal: false,
                                                                });
                                                            }
                                                        }}
                                                    />
                                                    <PrimaryButton
                                                        type="button"
                                                        disabled={basicForm.processing}
                                                        onClick={() => document.getElementById('seal_image')?.click()}
                                                    >
                                                        画像を選択
                                                    </PrimaryButton>
                                                    <span className="text-xs text-gray-500">※透過PNG形式, 2MB以内</span>
                                                </div>
                                                <InputError className="mt-2" message={basicForm.errors.seal_image} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-6">
                                        <InputLabel htmlFor="pdf_font" value="PDFフォント設定" />
                                        <div className="mt-2 flex gap-8">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="pdf_font"
                                                    value="ipa"
                                                    checked={basicForm.data.pdf_font === 'ipa'}
                                                    onChange={(e) => basicForm.setData('pdf_font', 'ipa')}
                                                    className="border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700">IPAexゴシック (標準)</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="pdf_font"
                                                    value="klee"
                                                    checked={basicForm.data.pdf_font === 'klee'}
                                                    onChange={(e) => basicForm.setData('pdf_font', 'klee')}
                                                    className="border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700">Klee One</span>
                                            </label>
                                        </div>
                                        <InputError className="mt-2" message={basicForm.errors.pdf_font} />
                                        <p className="mt-2 text-xs text-gray-500">※見積書、請求書のPDF出力時に適用されます。</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 border-t pt-6">
                                    <PrimaryButton disabled={basicForm.processing}>保存</PrimaryButton>
                                    <Transition
                                        show={basicForm.recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-gray-600">保存しました。</p>
                                    </Transition>
                                </div>
                            </form>
                        )}

                        {activeTab === 'account' && (
                            <form onSubmit={submitAccount} className="mt-6 space-y-6">
                                <div className="space-y-8">
                                    <div className="flex gap-8 border-b pb-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="account_method"
                                                value="bank"
                                                checked={accountForm.data.account_method === 'bank'}
                                                onChange={(e) => accountForm.setData('account_method', 'bank')}
                                                className="border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">銀行口座を表示する</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="account_method"
                                                value="japan_post"
                                                checked={accountForm.data.account_method === 'japan_post'}
                                                onChange={(e) => accountForm.setData('account_method', 'japan_post')}
                                                className="border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">ゆうちょ銀行を表示する</span>
                                        </label>
                                    </div>

                                    {accountForm.data.account_method === 'bank' && (
                                        <div className="rounded-lg border border-gray-200 p-4 bg-gray-50/50">
                                            <h3 className="mb-4 text-lg font-medium text-gray-900 border-b pb-2">銀行口座</h3>
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                    <div>
                                                        <InputLabel htmlFor="bank_name" value="金融機関名" />
                                                        <TextInput
                                                            id="bank_name"
                                                            className="mt-1 block w-full shadow-none"
                                                            value={accountForm.data.bank_name}
                                                            onChange={(e) => accountForm.setData('bank_name', e.target.value)}
                                                        />
                                                        <InputError className="mt-2" message={accountForm.errors.bank_name} />
                                                    </div>
                                                    <div>
                                                        <InputLabel htmlFor="branch_name" value="支店名" />
                                                        <TextInput
                                                            id="branch_name"
                                                            className="mt-1 block w-full shadow-none"
                                                            value={accountForm.data.branch_name}
                                                            onChange={(e) => accountForm.setData('branch_name', e.target.value)}
                                                        />
                                                        <InputError className="mt-2" message={accountForm.errors.branch_name} />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                                    <div>
                                                        <InputLabel htmlFor="account_type" value="口座種別" />
                                                        <select
                                                            id="account_type"
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-none focus:border-indigo-500 focus:ring-indigo-500"
                                                            value={accountForm.data.account_type}
                                                            onChange={(e) => accountForm.setData('account_type', e.target.value)}
                                                        >
                                                            <option value="">選択してください</option>
                                                            <option value="普通">普通</option>
                                                            <option value="当座">当座</option>
                                                        </select>
                                                        <InputError className="mt-2" message={accountForm.errors.account_type} />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <InputLabel htmlFor="account_number" value="口座番号" />
                                                        <TextInput
                                                            id="account_number"
                                                            className="mt-1 block w-full shadow-none"
                                                            value={accountForm.data.account_number}
                                                            onChange={(e) => accountForm.setData('account_number', e.target.value)}
                                                        />
                                                        <InputError className="mt-2" message={accountForm.errors.account_number} />
                                                    </div>
                                                </div>

                                                <div>
                                                    <InputLabel htmlFor="account_holder" value="口座名義" />
                                                    <TextInput
                                                        id="account_holder"
                                                        className="mt-1 block w-full shadow-none"
                                                        value={accountForm.data.account_holder}
                                                        onChange={(e) => accountForm.setData('account_holder', e.target.value)}
                                                    />
                                                    <InputError className="mt-2" message={accountForm.errors.account_holder} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {accountForm.data.account_method === 'japan_post' && (
                                        <div className="rounded-lg border border-gray-200 p-4 bg-gray-50/50">
                                            <h3 className="mb-4 text-lg font-medium text-gray-900 border-b pb-2">ゆうちょ銀行</h3>
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                    <div>
                                                        <InputLabel htmlFor="japan_post_bank_symbol" value="記号（５桁）" />
                                                        <TextInput
                                                            id="japan_post_bank_symbol"
                                                            className="mt-1 block w-full shadow-none"
                                                            value={accountForm.data.japan_post_bank_symbol}
                                                            onChange={(e) => accountForm.setData('japan_post_bank_symbol', e.target.value)}
                                                        />
                                                        <InputError className="mt-2" message={accountForm.errors.japan_post_bank_symbol} />
                                                    </div>
                                                    <div>
                                                        <InputLabel htmlFor="japan_post_bank_number" value="番号（最大８桁）" />
                                                        <TextInput
                                                            id="japan_post_bank_number"
                                                            className="mt-1 block w-full shadow-none"
                                                            value={accountForm.data.japan_post_bank_number}
                                                            onChange={(e) => accountForm.setData('japan_post_bank_number', e.target.value)}
                                                        />
                                                        <InputError className="mt-2" message={accountForm.errors.japan_post_bank_number} />
                                                    </div>
                                                </div>

                                                <div>
                                                    <InputLabel htmlFor="japan_post_bank_account_holder" value="口座名義" />
                                                    <TextInput
                                                        id="japan_post_bank_account_holder"
                                                        className="mt-1 block w-full shadow-none"
                                                        value={accountForm.data.japan_post_bank_account_holder}
                                                        onChange={(e) => accountForm.setData('japan_post_bank_account_holder', e.target.value)}
                                                    />
                                                    <InputError className="mt-2" message={accountForm.errors.japan_post_bank_account_holder} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 border-t pt-6">
                                    <PrimaryButton disabled={accountForm.processing}>保存</PrimaryButton>
                                    <Transition
                                        show={accountForm.recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-gray-600">保存しました。</p>
                                    </Transition>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
