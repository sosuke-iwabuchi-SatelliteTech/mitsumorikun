import { apiPost } from '@/Utils/api';
import { Customer } from '@/types';

export interface CustomerStoreRequest {
    name: string;
    contact_person_name?: string;
    address?: string;
    phone_number?: string;
    fax_number?: string;
    email?: string;
    remarks?: string;
}

export interface CustomerStoreResponse {
    message: string;
    customer: Customer;
}

/**
 * Customer API Service
 */
export const customerService = {
    /**
     * Create a new customer
     */
    store: (data: CustomerStoreRequest) => {
        return apiPost<CustomerStoreResponse>(route('customers.store'), data);
    },

    // Add more customer-related APIs here (e.g., list, update, delete)
};
