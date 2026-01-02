<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GroupInformationRequest extends FormRequest
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
            'invoice_company_name' => 'nullable|string|max:255',
            'invoice_registration_number' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:10',
            'address1' => 'nullable|string|max:255',
            'address2' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'fax_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'account_method' => 'nullable|string|in:bank,japan_post',
            'use_bank' => 'boolean',
            'bank_name' => 'nullable|string|max:255',
            'branch_name' => 'nullable|string|max:255',
            'account_type' => 'nullable|string|max:50',
            'account_number' => 'nullable|string|max:20',
            'account_holder' => 'nullable|string|max:255',
            'use_japan_post' => 'boolean',
            'japan_post_bank_symbol' => 'nullable|string|max:10',
            'japan_post_bank_number' => 'nullable|string|max:20',
            'japan_post_bank_account_holder' => 'nullable|string|max:255',
            'seal_image' => 'nullable|image|mimes:png|max:2048',
            'delete_seal' => 'nullable|boolean',
        ];
    }
}
