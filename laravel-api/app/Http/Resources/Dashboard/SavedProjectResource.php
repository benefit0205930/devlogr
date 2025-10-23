<?php

namespace App\Http\Resources\Dashboard;

use Illuminate\Http\Request;

class SavedProjectResource extends RecommendationResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);
        unset($data['isNew']);

        return $data;
    }
}
