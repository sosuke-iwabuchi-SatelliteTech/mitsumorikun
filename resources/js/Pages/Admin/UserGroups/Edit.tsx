import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { FormEvent } from 'react';
import { UserGroup } from '@/types';

interface Props {
    userGroup: UserGroup;
}

export default function Edit({ userGroup }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        name: userGroup.name,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        patch(route('admin.user-groups.update', userGroup.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    グループ編集
                </h2>
            }
        >
            <Head title="グループ編集" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg border border-gray-100">
                        <div className="p-6">
                            <form onSubmit={submit} className="max-w-xl">
                                <div>
                                    <InputLabel htmlFor="name" value="グループ名" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="mt-6 flex items-center justify-end">
                                    <Link
                                        href={route('admin.user-groups.index')}
                                        className="text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none"
                                    >
                                        キャンセル
                                    </Link>
                                    <PrimaryButton className="ms-4" disabled={processing}>
                                        更新
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
