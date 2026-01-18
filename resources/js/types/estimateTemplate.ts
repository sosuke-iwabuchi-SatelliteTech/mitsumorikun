export interface EstimateTemplateDetail {
    id: string;
    estimate_template_id: string;
    item_name: string;
    quantity: number;
    unit: string | null;
    unit_price: number;
    tax_classification: 'inclusive' | 'exclusive';
    amount: number;
    group_name: string | null;
    remarks: string | null;
}

export interface EstimateTemplate {
    id: string;
    user_group_id: string;
    name: string;
    remarks: string | null;
    details?: EstimateTemplateDetail[];
    created_at: string;
    updated_at: string;
}
