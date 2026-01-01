export interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at?: string;
    user_group_id: string;
    role: 'admin' | 'general';
    created_at: string;
    updated_at: string;
}

export interface UserGroup {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Customer {
    id: string;
    user_group_id: string;
    name: string;
    contact_person_name: string | null;
    address: string | null;
    phone_number: string | null;
    fax_number: string | null;
    email: string | null;
    remarks: string | null;
    created_at: string;
    updated_at: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
        is_impersonating: boolean;
    };
    flash: {
        message: string | null;
        error: string | null;
    };
};

export interface PaginatedData<T> {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number;
    to: number;
}
