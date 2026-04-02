<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FinancialRecordResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'amount'     => $this->amount,
            'type'       => $this->type,
            'category'   => $this->category,
            'date'       => $this->date->toDateString(),
            'notes'      => $this->notes,
            'created_by' => $this->user_id,
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
