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
}
