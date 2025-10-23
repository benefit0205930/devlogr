<?php

namespace App\Http\Resources\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this['id'],
            'title' => $this['title'],
            'description' => $this['description'] ?? null,
            'dueDate' => $this['dueDate'] ?? null,
            'type' => $this['type'],
            'ctaLabel' => $this['ctaLabel'] ?? null,
            'ctaHref' => $this['ctaHref'] ?? null,
            'priority' => $this['priority'],
            'status' => $this['status'],
            'priorityLabel' => $this['priorityLabel'] ?? null,
            'reminderLink' => $this['reminderLink'] ?? null,
        ];
    }
}
