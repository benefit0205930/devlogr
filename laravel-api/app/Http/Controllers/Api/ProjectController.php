<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('user')->where('status', 'open')
            ->latest()
            ->paginate(10);

        return response()->json($projects);
    }

    public function show($id)
    {
        $project = Project::with('user')->findOrFail($id);

        return response()->json($project);
    }
}
