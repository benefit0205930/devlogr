<?php

namespace App\Services\Dashboard;

use App\Models\Bookmark;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class DashboardService
{
    public function getSummary(User $user): array
    {
        $openProjects = Project::query()
            ->where('user_id', $user->id)
            ->where('status', 'open')
            ->count();

        $inProgressProjects = Project::query()
            ->where('user_id', $user->id)
            ->where('status', 'in_progress')
            ->count();

        $completedAwaitingReview = Project::query()
            ->where('user_id', $user->id)
            ->where('status', 'completed')
            ->count();

        $variant = $this->resolveVariant();

        $summary = [
            'userName' => $user->name ?? Str::before($user->email, '@'),
            'headline' => $this->buildHeadline($openProjects, $inProgressProjects),
            'openProjects' => $openProjects,
            'inProgressProjects' => $inProgressProjects,
            'unreadMessages' => 0,
            'pendingReviews' => $completedAwaitingReview,
            'nextActionText' => $this->buildNextActionText($user),
            'variant' => $variant,
            'specialMessage' => $this->specialMessageForVariant($variant),
        ];

        return [
            'mode' => 'worker',
            'summary' => $summary,
            'ctaVariants' => $this->ctaVariantsForMode('worker'),
        ];
    }

    public function getTodayTasks(User $user): Collection
    {
        $projects = Project::query()
            ->where('user_id', $user->id)
            ->whereIn('status', ['open', 'in_progress'])
            ->orderBy('deadline')
            ->get();

        $tasks = $projects->map(function (Project $project) {
            $deadline = $project->deadline;
            $dueDate = $deadline?->toIso8601String();
            $daysUntil = $deadline ? now()->diffInDays($deadline, false) : null;

            return [
                'id' => 'project-' . $project->id,
                'title' => '「' . $project->title . '」の進捗を更新する',
                'description' => Str::limit($project->description, 120),
                'dueDate' => $dueDate,
                'type' => 'milestone',
                'ctaLabel' => '進捗を記録',
                'ctaHref' => '/projects/' . $project->id . '/milestones',
                'priority' => $this->priorityFromDaysUntil($daysUntil),
                'status' => 'pending',
                'priorityLabel' => $this->priorityLabel($daysUntil),
                'reminderLink' => '/projects/' . $project->id . '/reminders',
            ];
        });

        if ($tasks->isEmpty()) {
            $tasks->push([
                'id' => 'profile-refresh',
                'title' => 'プロフィールを更新して提案率を上げる',
                'description' => '得意スキルと直近実績を最新化するとおすすめ案件の精度が向上します。',
                'type' => 'reminder',
                'ctaLabel' => 'プロフィールを編集',
                'ctaHref' => '/profile',
                'priority' => 'low',
                'status' => 'pending',
                'priorityLabel' => '低優先: 今週中に見直し',
                'reminderLink' => '/notifications/reminders/profile',
            ]);
        }

        return $tasks->take(5);
    }

    public function getRecommendations(User $user): Collection
    {
        $bookmarkedIds = $user->bookmarkedProjects()->pluck('projects.id')->all();

        return Project::query()
            ->where('status', 'open')
            ->where('user_id', '!=', $user->id)
            ->when(!empty($bookmarkedIds), fn($query) => $query->whereNotIn('id', $bookmarkedIds))
            ->orderBy('deadline')
            ->limit(6)
            ->get()
            ->map(fn(Project $project) => $this->formatProjectCard($project, true));
    }

    public function getSavedProjects(User $user): Collection
    {
        return Bookmark::query()
            ->with('project')
            ->where('user_id', $user->id)
            ->latest()
            ->get()
            ->filter(fn(Bookmark $bookmark) => $bookmark->project !== null)
            ->map(fn(Bookmark $bookmark) => $this->formatProjectCard($bookmark->project));
    }

    public function getSupportResources(): Collection
    {
        return collect(config('dashboard.support_resources.worker', []));
    }

    protected function formatProjectCard(Project $project, bool $isRecommendation = false): array
    {
        $budgetMin = number_format($project->budget_min);
        $budgetMax = number_format($project->budget_max);

        return [
            'id' => (string) $project->id,
            'title' => $project->title,
            'summary' => Str::limit($project->description, 140),
            'budgetRange' => '¥' . $budgetMin . '〜¥' . $budgetMax,
            'dueDate' => $project->deadline?->toIso8601String(),
            'skills' => $project->technologies ?? [],
            'href' => '/projects/' . $project->id,
            'isNew' => $isRecommendation && $project->created_at?->greaterThan(now()->subDays(3)),
            'workload' => $project->estimated_duration ?? '相談して決定',
            'rewardRange' => '月額目安: ¥' . $budgetMin . '〜¥' . $budgetMax,
        ];
    }

    protected function priorityFromDaysUntil(?int $daysUntil): string
    {
        if ($daysUntil === null) {
            return 'medium';
        }

        return match (true) {
            $daysUntil <= 1 => 'high',
            $daysUntil <= 4 => 'medium',
            default => 'low',
        };
    }

    protected function priorityLabel(?int $daysUntil): string
    {
        if ($daysUntil === null) {
            return '優先: 期日を確認してください';
        }

        return match (true) {
            $daysUntil < 0 => '期限超過: 至急対応してください',
            $daysUntil <= 1 => '最優先: 24時間以内に対応',
            $daysUntil <= 4 => '優先: 今週中に対応',
            default => '低優先: 計画的に進めましょう',
        };
    }

    protected function resolveVariant(): string
    {
        if (now()->isWeekend()) {
            return 'holiday';
        }

        return 'default';
    }

    protected function specialMessageForVariant(string $variant): ?string
    {
        return match ($variant) {
            'holiday' => '今日はゆったりモード。軽めのタスクから片付けていきましょう。',
            default => null,
        };
    }

    protected function ctaVariantsForMode(string $mode): array
    {
        return config("dashboard.cta_variants.$mode", []);
    }

    protected function buildHeadline(int $openProjects, int $inProgressProjects): string
    {
        if ($inProgressProjects > 0) {
            return '進行中の案件を整理して、次の一手を決めましょう。';
        }

        if ($openProjects > 0) {
            return '公開中の案件をチェックして応募状況を確認しましょう。';
        }

        return '今日のおすすめ案件から次のチャンスを探してみませんか？';
    }

    protected function buildNextActionText(User $user): ?string
    {
        $bookmarkCount = $user->bookmarkedProjects()->count();

        if ($bookmarkCount > 0) {
            return '保存した案件に応募する準備ができています。';
        }

        return '新着のおすすめ案件が届いています。';
    }
}
