<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Dashboard\RecommendationResource;
use App\Http\Resources\Dashboard\ResourceLinkResource;
use App\Http\Resources\Dashboard\SavedProjectResource;
use App\Http\Resources\Dashboard\SummaryResource;
use App\Http\Resources\Dashboard\TaskResource;
use App\Services\Dashboard\DashboardService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboardService,
    ) {}

    public function summary(Request $request): SummaryResource
    {
        return new SummaryResource(
            $this->dashboardService->getSummary($request->user())
        );
    }

    public function tasks(Request $request)
    {
        return TaskResource::collection(
            $this->dashboardService->getTodayTasks($request->user())
        );
    }

    public function recommendations(Request $request)
    {
        return RecommendationResource::collection(
            $this->dashboardService->getRecommendations($request->user())
        );
    }

    public function savedProjects(Request $request)
    {
        return SavedProjectResource::collection(
            $this->dashboardService->getSavedProjects($request->user())
        );
    }

    public function resources()
    {
        return ResourceLinkResource::collection(
            $this->dashboardService->getSupportResources()
        );
    }
}
