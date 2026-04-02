<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FinancialRecordRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'amount'   => ['required', 'numeric', 'min:0.01'],
            'type'     => ['required', 'in:income,expense'],
            'category' => ['required', 'string', 'max:100'],
            'date'     => ['required', 'date'],
            'notes'    => ['nullable', 'string', 'max:1000'],
        ];
    }
}
