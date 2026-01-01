import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Create({ auth }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        contact_person_name: '',
        address: '',
        phone_number: '',
        fax_number: '',
        email: '',
        remarks: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('customers.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    顧客登録
                </h2>
            }
        >
            <Head title="顧客登録" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        顧客名称{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="contact_person_name"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        担当者名
                                    </label>
                                    <input
                                        type="text"
                                        id="contact_person_name"
                                        value={data.contact_person_name}
                                        onChange={(e) =>
                                            setData(
                                                'contact_person_name',
                                                e.target.value
                                            )
                                        }
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="phone_number"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            電話番号
                                        </label>
                                        <input
                                            type="text"
                                            id="phone_number"
                                            value={data.phone_number}
                                            onChange={(e) =>
                                                setData(
                                                    'phone_number',
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="fax_number"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            FAX番号
                                        </label>
                                        <input
                                            type="text"
                                            id="fax_number"
                                            value={data.fax_number}
                                            onChange={(e) =>
                                                setData(
                                                    'fax_number',
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        メールアドレス
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="address"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        住所
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        value={data.address}
                                        onChange={(e) =>
                                            setData('address', e.target.value)
                                        }
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="remarks"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        備考
                                    </label>
                                    <textarea
                                        id="remarks"
                                        rows={4}
                                        value={data.remarks}
                                        onChange={(e) =>
                                            setData('remarks', e.target.value)
                                        }
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-x-3 border-t border-gray-900/10 pt-6">
                                    <Link
                                        href={route('customers.index')}
                                        className="text-sm font-semibold leading-6 text-gray-900"
                                    >
                                        キャンセル
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                                    >
                                        保存
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
