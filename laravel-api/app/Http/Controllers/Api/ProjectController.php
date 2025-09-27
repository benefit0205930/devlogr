<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('user')->where('status', 'open')
            ->latest()
            ->paginate(10);

        // ログインユーザーがいる場合、各プロジェクトのブックマーク状態を追加
        if (Auth::check()) {
            /** @var User $user */
            $user = Auth::user();
            $bookmarkedProjectIds = $user->bookmarkedProjects()->pluck('project_id')->toArray();

            $projects->getCollection()->transform(function ($project) use ($bookmarkedProjectIds) {
                $project->is_bookmarked = in_array($project->id, $bookmarkedProjectIds);
                return $project;
            });
        }

        return response()->json($projects);
    }

    public function show($id)
    {
        $project = Project::with('user')->findOrFail($id);

        // ログインユーザーがいる場合、ブックマーク状態を追加
        if (Auth::check()) {
            /** @var User $user */
            $user = Auth::user();
            $project->is_bookmarked = $user->bookmarkedProjects()
                ->where('project_id', $project->id)
                ->exists();
        }

        return response()->json($project);
    }
}
