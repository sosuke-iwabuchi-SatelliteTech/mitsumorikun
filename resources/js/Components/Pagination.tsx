import { Link } from '@inertiajs/react';
import { PaginatedData } from '@/types';

interface Props {
    data: PaginatedData<any>;
}

export default function Pagination({ data }: Props) {
    if (data.total <= data.per_page) return null;

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <Link
                    href={data.links[0].url || '#'}
                    className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${!data.links[0].url && 'cursor-not-allowed opacity-50'}`}
                >
                    前へ
                </Link>
                <Link
                    href={data.links[data.links.length - 1].url || '#'}
                    className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${!data.links[data.links.length - 1].url && 'cursor-not-allowed opacity-50'}`}
                >
                    次へ
                </Link>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">{data.from}</span> 〜{' '}
                        <span className="font-medium">{data.to}</span>{' '}
                        件目表示中（全{' '}
                        <span className="font-medium">{data.total}</span> 件）
                    </p>
                </div>
                <div>
                    <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                    >
                        {data.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                    link.active
                                        ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                                } ${!link.url && 'cursor-not-allowed opacity-50'}`}
                            />
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}
