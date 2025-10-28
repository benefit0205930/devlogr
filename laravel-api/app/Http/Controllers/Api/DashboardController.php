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
        $mode = $this->resolveMode($request);

        return new SummaryResource(
            $this->dashboardService->getSummary($request->user(), $mode)
        );
    }

    public function tasks(Request $request)
    {
        $mode = $this->resolveMode($request);

        return TaskResource::collection(
            $this->dashboardService->getTodayTasks($request->user(), $mode)
        );
    }

    public function recommendations(Request $request)
    {
        $mode = $this->resolveMode($request);

        return RecommendationResource::collection(
            $this->dashboardService->getRecommendations($request->user(), $mode)
        );
    }

    public function savedProjects(Request $request)
    {
        $mode = $this->resolveMode($request);

        return SavedProjectResource::collection(
            $this->dashboardService->getSavedProjects($request->user(), $mode)
        );
    }

    public function resources(Request $request)
    {
        $mode = $this->resolveMode($request);

        return ResourceLinkResource::collection(
            $this->dashboardService->getSupportResources($mode)
        );
    }

    private function resolveMode(Request $request): string
    {
        $mode = $request->query('mode', 'worker');

        return in_array($mode, ['worker', 'client'], true) ? $mode : 'worker';
    }
}
