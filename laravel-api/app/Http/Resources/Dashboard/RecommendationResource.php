<?php

namespace App\Http\Resources\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecommendationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this['id'],
            'title' => $this['title'],
            'summary' => $this['summary'],
            'budgetRange' => $this['budgetRange'] ?? null,
            'dueDate' => $this['dueDate'] ?? null,
            'skills' => $this['skills'] ?? [],
            'href' => $this['href'],
            'isNew' => $this['isNew'] ?? false,
            'workload' => $this['workload'] ?? null,
            'rewardRange' => $this['rewardRange'] ?? null,
        ];
    }
}
