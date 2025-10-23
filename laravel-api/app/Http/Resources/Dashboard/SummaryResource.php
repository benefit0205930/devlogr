<?php

namespace App\Http\Resources\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SummaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'mode' => $this['mode'],
            'summary' => $this['summary'],
            'ctaVariants' => $this['ctaVariants'],
        ];
    }
}
