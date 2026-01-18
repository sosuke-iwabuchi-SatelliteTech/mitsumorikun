import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import NumberInput from '@/Components/NumberInput';

export default function Create({ auth }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        quantity: 1,
        unit_price: 0,
        unit: '',
        tax_type: 'exc' as 'inc' | 'exc',
        remarks: '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setData(e.target.name as any, e.target.value);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('invoice-items.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    見積項目登録
                </h2>
            }
        >
            <Head title="見積項目登録" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form
                                onSubmit={submit}
                                className="max-w-xl space-y-6"
                            >
                                <div>
                                    <InputLabel
                                        htmlFor="name"
                                        value="項目名称"
                                    />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        className="mt-1 block w-full"
                                        value={data.name}
                                        onChange={handleChange}
                                        required
                                        isFocused
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel
                                            htmlFor="unit_price"
                                            value="単価"
                                        />
                                        <NumberInput
                                            id="unit_price"
                                            name="unit_price"
                                            className="mt-1 block w-full"
                                            value={data.unit_price}
                                            onChange={handleChange}
                                            required
                                        />
                                        <InputError
                                            message={errors.unit_price}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="quantity"
                                            value="数量"
                                        />
                                        <NumberInput
                                            id="quantity"
                                            name="quantity"
                                            step="0.01"
                                            className="mt-1 block w-full"
                                            value={data.quantity}
                                            onChange={handleChange}
                                            required
                                        />
                                        <InputError
                                            message={errors.quantity}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="unit" value="単位" />
                                    <TextInput
                                        id="unit"
                                        name="unit"
                                        className="mt-1 block w-full"
                                        value={data.unit}
                                        onChange={handleChange}
                                    />
                                    <InputError
                                        message={errors.unit}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel value="税区分" />
                                    <div className="mt-2 flex gap-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio text-indigo-600"
                                                name="tax_type"
                                                value="exc"
                                                checked={
                                                    data.tax_type === 'exc'
                                                }
                                                onChange={handleChange as any}
                                            />
                                            <span className="ml-2">税抜</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio text-indigo-600"
                                                name="tax_type"
                                                value="inc"
                                                checked={
                                                    data.tax_type === 'inc'
                                                }
                                                onChange={handleChange as any}
                                            />
                                            <span className="ml-2">税込</span>
                                        </label>
                                    </div>
                                    <InputError
                                        message={errors.tax_type}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="remarks"
                                        value="備考"
                                    />
                                    <textarea
                                        id="remarks"
                                        name="remarks"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.remarks}
                                        onChange={handleChange}
                                        rows={3}
                                    />
                                    <InputError
                                        message={errors.remarks}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-4">
                                    <Link
                                        href={route('invoice-items.index')}
                                        className="text-sm text-gray-600 underline hover:text-gray-900"
                                    >
                                        キャンセル
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        保存
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
