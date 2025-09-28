<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class BookmarkController extends Controller
{
    // ブックマークの追加/削除
    public function toggle(Project $project)
    {
        /** @var User $user */
        $user = Auth::user();

        if ($user->bookmarkedProjects()->where('project_id', $project->id)->exists()) {
            // ブックマーク削除
            $user->bookmarkedProjects()->detach($project->id);
            return response()->json([
                'message' => 'ブックマークを解除しました。',
                'is_bookmarked' => false,
            ]);
        } else {
            // ブックマーク追加
            $user->bookmarkedProjects()->attach($project->id);
            return response()->json([
                'message' => 'ブックマークに追加しました。',
                'is_bookmarked' => true,
            ]);
        }
    }

    // ユーザーのブックマーク一覧を取得
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();

        $bookmarkedProjects = $user->bookmarkedProjects()
            ->with('user')
            ->where('status', 'open')
            ->latest('bookmarks.created_at')
            ->paginate(10);

        return response()->json($bookmarkedProjects);
    }
}
