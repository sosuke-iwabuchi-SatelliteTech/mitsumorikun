<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_id' => 'required|uuid|exists:customers,id',
            'title' => 'required|string|max:255',
            'estimate_date' => 'required|date',
            'delivery_deadline' => 'nullable|date',
            'construction_address' => 'nullable|string|max:255',
            'payment_terms' => 'nullable|string|max:255',
            'expiration_date' => 'nullable|date',
            'remarks' => 'nullable|string',
            'total_amount' => 'required|numeric',
            'tax_amount' => 'required|numeric',
            'details' => 'required|array|min:1',
            'details.*.item_name' => 'required|string|max:255',
            'details.*.quantity' => 'required|numeric',
            'details.*.unit_price' => 'required|numeric',
            'details.*.unit' => 'nullable|string|max:50',
            'details.*.tax_classification' => 'required|string|in:inclusive,exclusive',
            'details.*.amount' => 'required|numeric',
            'details.*.group_name' => 'nullable|string|max:255',
            'details.*.remarks' => 'nullable|string',
        ];
    }

    public function attributes(): array
    {
        return [
            'customer_id' => '顧客',
            'title' => '件名',
            'estimate_date' => '見積日',
            'delivery_deadline' => '受け渡し期日',
            'construction_address' => '工事場所',
            'payment_terms' => '支払い条件',
            'expiration_date' => '見積有効期限',
            'remarks' => '備考',
            'total_amount' => '合計金額',
            'tax_amount' => '消費税',
            'details' => '明細',
            'details.*.item_name' => '品名',
            'details.*.quantity' => '数量',
            'details.*.unit_price' => '単価',
            'details.*.unit' => '単位',
            'details.*.tax_classification' => '税区分',
        ];
    }
}
