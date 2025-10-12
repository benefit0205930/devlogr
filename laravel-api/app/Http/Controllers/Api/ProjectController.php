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

    /**
     * 新規案件作成
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|min:5|max:100',
            'category' => 'required|string',
            'description' => 'required|string|min:50',
            'budget_min' => 'required|integer|min:0',
            'budget_max' => 'required|integer|min:0|gt:budget_min',
            'deadline' => 'required|date|after_or_equal:today',
            'technologies' => 'nullable|array',
            'technologies.*' => 'string',
            'required_skills' => 'nullable|array',
            'required_skills.*' => 'string',
            'estimated_duration' => 'nullable|string',
        ], [
            'title.required' => 'タイトルは必須です',
            'title.min' => 'タイトルは5文字以上で入力してください',
            'title.max' => 'タイトルは100文字以内で入力してください',
            'category.required' => 'カテゴリは必須です',
            'description.required' => '説明は必須です',
            'description.min' => '説明は50文字以上で入力してください',
            'budget_min.required' => '予算の下限は必須です',
            'budget_max.required' => '予算の上限は必須です',
            'budget_max.gt' => '予算の上限は下限より大きい値を設定してください',
            'deadline.required' => '締切日は必須です',
            'deadline.after' => '締切日は今日より後の日付を設定してください',
        ]);

        $project = Auth::user()->projects()->create([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'description' => $validated['description'],
            'budget_min' => $validated['budget_min'],
            'budget_max' => $validated['budget_max'],
            'deadline' => $validated['deadline'],
            'technologies' => $validated['technologies'] ?? [],
            'required_skills' => $validated['required_skills'] ?? [],
            'estimated_duration' => $validated['estimated_duration'] ?? null,
            'status' => 'open',
            'application_count' => 0,
        ]);

        return response()->json([
            'message' => '案件を作成しました',
            'project' => $project->load('user'),
        ], 201);
    }
}
