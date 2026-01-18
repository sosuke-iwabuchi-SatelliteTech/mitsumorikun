import { useEffect } from 'react';

export interface BaseDetail {
    quantity: number | string;
    unit_price: number | string;
    tax_classification: 'inclusive' | 'exclusive';
}

export const calculateTotals = (details: BaseDetail[]) => {
    let grandTotal = 0;
    let totalTax = 0;

    details.forEach((item) => {
        const amount = Math.floor(
            Number(item.quantity) * Number(item.unit_price)
        );
        const taxRate = 0.1;

        if (item.tax_classification === 'exclusive') {
            const tax = Math.trunc(amount * taxRate);
            grandTotal += amount + tax;
            totalTax += tax;
        } else {
            // For inclusive, the amount already includes tax.
            // Tax = Amount - (Amount / (1 + rate))
            const tax = Math.trunc(amount - amount / (1 + taxRate));
            grandTotal += amount;
            totalTax += tax;
        }
    });

    return { total_amount: grandTotal, tax_amount: totalTax };
};

export const useInvoiceTotalsEffect = (
    details: BaseDetail[],
    setData: (updater: (data: any) => any) => void
) => {
    useEffect(() => {
        const { total_amount, tax_amount } = calculateTotals(details);
        setData((d: any) => ({ ...d, total_amount, tax_amount }));
    }, [details]);
};
