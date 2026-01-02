import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage, router } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { PageProps } from '@/types';

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, flash } = usePage<PageProps>().props;
    const user = auth.user;
    const isImpersonating = auth.is_impersonating;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const handleStopImpersonating = () => {
        router.delete(route('impersonate.stop'));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {isImpersonating && (
                <div className="sticky top-0 z-50 flex items-center justify-center gap-4 bg-amber-500 px-4 py-2 text-center text-white shadow-md">
                    <span className="flex items-center gap-1 font-bold">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {user.name} として代理ログイン中です
                    </span>
                    <button
                        onClick={handleStopImpersonating}
                        className="rounded bg-white px-3 py-1 text-xs font-bold text-amber-600 transition-colors hover:bg-amber-50"
                    >
                        管理者に戻る
                    </button>
                </div>
            )}
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                                {user.role === 'general' && (
                                    <NavLink
                                        href={route('customers.index')}
                                        active={route().current('customers.*')}
                                    >
                                        顧客マスタ
                                    </NavLink>
                                )}
                                {user.role === 'general' && (
                                    <NavLink
                                        href={route('invoice-items.index')}
                                        active={route().current('invoice-items.*')}
                                    >
                                        見積項目マスタ
                                    </NavLink>
                                )}
                                {user.role === 'general' && (
                                    <NavLink
                                        href={route('group-information.edit')}
                                        active={route().current('group-information.*')}
                                    >
                                        会社情報管理
                                    </NavLink>
                                )}
                                {user.role === 'admin' && (
                                    <NavLink
                                        href={route('admin.users.index')}
                                        active={route().current(
                                            'admin.users.*'
                                        )}
                                    >
                                        ユーザー管理
                                    </NavLink>
                                )}
                                {user.role === 'admin' && (
                                    <NavLink
                                        href={route('admin.user-groups.index')}
                                        active={route().current(
                                            'admin.user-groups.*'
                                        )}
                                    >
                                        グループ管理
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        {user.role === 'general' && (
                                <ResponsiveNavLink
                                    href={route('customers.index')}
                                    active={route().current('customers.*')}
                                >
                                    顧客マスタ
                                </ResponsiveNavLink>
                            )}
                            {user.role === 'general' && (
                                <ResponsiveNavLink
                                    href={route('invoice-items.index')}
                                    active={route().current('invoice-items.*')}
                                >
                                    見積項目マスタ
                                </ResponsiveNavLink>
                            )}
                            {user.role === 'general' && (
                                <ResponsiveNavLink
                                    href={route('group-information.edit')}
                                    active={route().current('group-information.*')}
                                >
                                    会社情報管理
                                </ResponsiveNavLink>
                            )}
                        {user.role === 'admin' && (
                            <ResponsiveNavLink
                                href={route('admin.users.index')}
                                active={route().current('admin.users.*')}
                            >
                                ユーザー管理
                            </ResponsiveNavLink>
                        )}
                        {user.role === 'admin' && (
                            <ResponsiveNavLink
                                href={route('admin.user-groups.index')}
                                active={route().current('admin.user-groups.*')}
                            >
                                グループ管理
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
