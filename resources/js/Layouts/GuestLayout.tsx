import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div className="mb-2 flex items-center gap-4">
                <ApplicationLogo className="h-20 w-20" />
                <h1
                    className="text-4xl font-bold text-green-600"
                    style={{
                        fontFamily:
                            "'Hiragino Kaku Gothic ProN', 'Hiragino Sans', sans-serif",
                        letterSpacing: '0.05em',
                    }}
                >
                    みつもーりー
                </h1>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
