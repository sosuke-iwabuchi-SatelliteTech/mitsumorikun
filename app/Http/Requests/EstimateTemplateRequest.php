<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EstimateTemplateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'remarks' => 'nullable|string',
            'details' => 'required|array|min:1',
            'details.*.id' => 'nullable|uuid',
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
            'name' => 'テンプレート名',
            'remarks' => '備考',
            'details' => '明細',
            'details.*.item_name' => '品名',
            'details.*.quantity' => '数量',
            'details.*.unit_price' => '単価',
            'details.*.unit' => '単位',
            'details.*.tax_classification' => '税区分',
        ];
    }
}
