<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::with(['user', 'bookmarkedBy']);

        // デフォルトでopenのみ表示（statusフィルタがない場合）
        if (!$request->has('status')) {
            $query->where('status', 'open');
        }

        // カテゴリフィルタ
        if ($request->has('categories')) {
            $categories = explode(',', $request->categories);
            $query->filterByCategories($categories);
        }

        // 価格範囲フィルタ
        $query->filterByPriceRange(
            $request->input('budget_min') ? (int)$request->input('budget_min') : null,
            $request->input('budget_max') ? (int)$request->input('budget_max') : null
        );

        // ステータスフィルタ
        if ($request->has('status')) {
            $statuses = is_array($request->status)
                ? $request->status
                : explode(',', $request->status);
            $query->filterByStatus($statuses);
        }

        // 期限フィルタ
        if ($request->has('days_remaining')) {
            $query->filterByDaysRemaining((int)$request->days_remaining);
        }

        // 技術スタックフィルタ
        if ($request->has('technologies')) {
            $technologies = explode(',', $request->technologies);
            $query->filterByTechnologies($technologies);
        }

        // 検索キーワード
        if ($request->has('search')) {
            $query->search($request->search);
        }

        // 除外キーワード
        if ($request->has('exclude_keywords')) {
            $excludeKeywords = explode(',', $request->exclude_keywords);
            $query->excludeKeywords($excludeKeywords);
        }

        // ブックマークのみ
        if ($request->boolean('bookmarked_only') && Auth::check()) {
            $query->bookmarkedBy(Auth::id());
        }

        // ソート
        $sortBy = $request->input('sort', 'newest');
        $query->sortBy($sortBy);

        // ページネーション
        $perPage = $request->input('per_page', 12);
        $projects = $query->paginate($perPage);

        // 現在のユーザーのブックマーク状態を追加
        if (Auth::check()) {
            /** @var User $user */
            $user = Auth::user();
            $bookmarkedProjectIds = $user->bookmarkedProjects()
                ->whereIn('project_id', $projects->pluck('id'))
                ->pluck('project_id')
                ->toArray();

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
