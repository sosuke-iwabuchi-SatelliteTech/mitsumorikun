export interface InvoiceDetail {
    id: string;
    invoice_id: string;
    item_name: string;
    quantity: number;
    unit_price: number;
    unit: string | null;
    tax_rate: number;
    tax_classification: 'inclusive' | 'exclusive';
    amount: number;
    group_name: string | null;
    display_order: number;
    remarks: string | null;
}

export interface Invoice {
    id: string;
    user_group_id: string;
    customer_id: string;
    estimate_number: string;
    version: number;
    status: 'creating' | 'submitted' | 'order_received' | 'invoice_creating' | 'invoice_submitted' | 'payment_confirmed';
    document_type?: 'estimate' | 'invoice';
    title: string;
    estimate_date: string;
    delivery_deadline: string | null;
    construction_address: string | null;
    payment_terms: string | null;
    expiration_date: string | null;
    remarks: string | null;
    total_amount: number;
    tax_amount: number;
    issuer_name: string | null;
    issuer_registration_number: string | null;
    issuer_address: string | null;
    issuer_tel: string | null;
    issuer_fax: string | null;
    bank_name: string | null;
    branch_name: string | null;
    account_type: string | null;
    account_number: string | null;
    account_holder: string | null;
    japan_post_bank_symbol: string | null;
    japan_post_bank_number: string | null;
    japan_post_bank_account_holder: string | null;
    created_at: string;
    updated_at: string;
    customer?: {
        id: string;
        name: string;
    };
    details?: InvoiceDetail[];
}
