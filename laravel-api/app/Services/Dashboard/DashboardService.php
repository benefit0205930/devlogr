<?php

namespace App\Services\Dashboard;

use App\Enums\DashboardMode;
use App\Models\Bookmark;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class DashboardService
{
    /**
     * 新規案件とみなす日数の閾値（作成日から何日以内を新規とするか）
     */
    private const NEW_PROJECT_DAYS_THRESHOLD = 3;

    public function getSummary(User $user, DashboardMode $mode): array
    {
        return $mode->isClient()
            ? $this->buildClientSummary($user)
            : $this->buildWorkerSummary($user);
    }

    public function getTodayTasks(User $user, DashboardMode $mode): Collection
    {
        return $mode->isClient()
            ? $this->buildClientTasks($user)
            : $this->buildWorkerTasks($user);
    }

    public function getRecommendations(User $user, DashboardMode $mode): Collection
    {
        return $mode->isClient()
            ? $this->buildClientRecommendations($user)
            : $this->buildWorkerRecommendations($user);
    }

    public function getSavedProjects(User $user, DashboardMode $mode): Collection
    {
        return $mode->isClient()
            ? $this->buildClientProgressProjects($user)
            : $this->buildWorkerSavedProjects($user);
    }

    public function getSupportResources(DashboardMode $mode): Collection
    {
        return collect(config("dashboard.support_resources.{$mode->value}", []));
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
            'isNew' => $isRecommendation && $project->created_at?->greaterThan(now()->subDays(self::NEW_PROJECT_DAYS_THRESHOLD)),
            'workload' => $project->estimated_duration ?? '相談して決定',
            'rewardRange' => '月額目安: ¥' . $budgetMin . '〜¥' . $budgetMax,
        ];
    }

    protected function formatClientProjectCard(Project $project): array
    {
        $budgetMin = number_format($project->budget_min);
        $budgetMax = number_format($project->budget_max);
        $applications = $project->application_count ?? 0;
        $deadline = $project->deadline?->toIso8601String();
        $description = $project->description ? Str::limit($project->description, 140) : null;
        $summary = '応募 ' . $applications . '件';

        if ($description) {
            $summary .= ' / ' . $description;
        }

        return [
            'id' => (string) $project->id,
            'title' => $project->title,
            'summary' => $summary,
            'budgetRange' => '予算 ¥' . $budgetMin . '〜¥' . $budgetMax,
            'dueDate' => $deadline,
            'skills' => $project->required_skills ?? [],
            'href' => '/client/projects/' . $project->id,
            'isNew' => $project->created_at?->greaterThan(now()->subDays(self::NEW_PROJECT_DAYS_THRESHOLD)),
            'workload' => $project->estimated_duration ?? '相談して決定',
        ];
    }

    protected function buildClientSummary(User $user): array
    {
        $metrics = $this->buildSummaryMetrics($user);
        $openProjects = $metrics['openProjects'];
        $inProgressProjects = $metrics['inProgressProjects'];
        $completedAwaitingReview = $metrics['completedProjects'];

        $unreadMessages = (int) ($this->projectsForUser($user)
            ->whereIn('status', ['open', 'in_progress'])
            ->sum('application_count') ?? 0);

        $variant = $this->resolveClientVariant($openProjects, $inProgressProjects, $completedAwaitingReview);

        $summary = [
            'userName' => $user->name ?? Str::before($user->email, '@'),
            'headline' => $this->buildClientHeadline($openProjects, $unreadMessages),
            'openProjects' => $openProjects,
            'inProgressProjects' => $inProgressProjects,
            'unreadMessages' => $unreadMessages,
            'pendingReviews' => $completedAwaitingReview,
            'nextActionText' => $this->buildClientNextActionText($openProjects, $unreadMessages),
            'variant' => $variant,
            'specialMessage' => $this->clientSpecialMessage($variant),
        ];

        return [
            'mode' => DashboardMode::Client->value,
            'summary' => $summary,
            'ctaVariants' => $this->ctaVariantsForMode(DashboardMode::Client),
        ];
    }

    protected function buildWorkerSummary(User $user): array
    {
        $metrics = $this->buildSummaryMetrics($user);
        $openProjects = $metrics['openProjects'];
        $inProgressProjects = $metrics['inProgressProjects'];
        $completedAwaitingReview = $metrics['completedProjects'];

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
            'mode' => DashboardMode::Worker->value,
            'summary' => $summary,
            'ctaVariants' => $this->ctaVariantsForMode(DashboardMode::Worker),
        ];
    }

    protected function buildClientTasks(User $user): Collection
    {
        $openProjects = $this->projectsForUser($user)
            ->where('status', 'open')
            ->orderByDesc('application_count')
            ->orderBy('deadline')
            ->get();

        $tasks = $openProjects->map(function (Project $project) {
            $deadline = $project->deadline;
            $dueDate = $deadline?->toIso8601String();
            $daysUntil = $deadline ? now()->diffInDays($deadline, false) : null;

            return [
                'id' => 'client-review-' . $project->id,
                'title' => '「' . $project->title . '」の応募者を確認する',
                'description' => '現在 ' . ($project->application_count ?? 0) . ' 件の応募が届いています。',
                'dueDate' => $dueDate,
                'type' => 'review',
                'ctaLabel' => '応募者を確認',
                'ctaHref' => '/client/projects/' . $project->id . '/applications',
                'priority' => $this->priorityFromDaysUntil($daysUntil),
                'status' => 'pending',
                'priorityLabel' => $this->clientPriorityLabel($project->application_count ?? 0, $daysUntil),
                'reminderLink' => '/client/projects/' . $project->id . '/notifications',
            ];
        });

        $completedProjects = $this->projectsForUser($user)
            ->where('status', 'completed')
            ->latest('updated_at')
            ->take(3)
            ->get()
            ->map(function (Project $project) {
                return [
                    'id' => 'client-feedback-' . $project->id,
                    'title' => '「' . $project->title . '」へのレビューを送信する',
                    'description' => '完了レポートの確認とフィードバック送信をお願い致します。',
                    'type' => 'submission',
                    'ctaLabel' => 'レビューを書く',
                    'ctaHref' => '/client/projects/' . $project->id . '/reviews',
                    'priority' => 'medium',
                    'status' => 'pending',
                    'priorityLabel' => '完了から日数が空く前に返信しましょう',
                    'reminderLink' => '/client/projects/' . $project->id . '/reminders',
                ];
            });

        $tasks = $tasks->merge($completedProjects);

        if ($tasks->isEmpty()) {
            $tasks->push([
                'id' => 'client-create-project',
                'title' => '最初の案件を公開してみましょう',
                'description' => '案件を投稿すると応募者とのやり取りをここで管理できます。',
                'type' => 'reminder',
                'ctaLabel' => '案件を作成する',
                'ctaHref' => '/projects/create',
                'priority' => 'low',
                'status' => 'pending',
                'priorityLabel' => '今週中に案件を公開してみましょう',
                'reminderLink' => '/support/onboarding/client',
            ]);
        }

        return $tasks->take(5);
    }

    protected function buildWorkerTasks(User $user): Collection
    {
        $projects = $this->projectsForUser($user)
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

    protected function buildClientRecommendations(User $user): Collection
    {
        return $this->projectsForUser($user)
            ->where('status', 'open')
            ->orderByDesc('application_count')
            ->orderBy('deadline')
            ->limit(6)
            ->get()
            ->map(fn(Project $project) => $this->formatClientProjectCard($project));
    }

    protected function buildWorkerRecommendations(User $user): Collection
    {
        // N+1クエリを防ぐため、リレーションを事前にロード
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

    protected function buildClientProgressProjects(User $user): Collection
    {
        return $this->projectsForUser($user)
            ->where('status', 'in_progress')
            ->latest('updated_at')
            ->limit(6)
            ->get()
            ->map(fn(Project $project) => $this->formatClientProjectCard($project));
    }

    protected function buildWorkerSavedProjects(User $user): Collection
    {
        return Bookmark::query()
            ->with('project')
            ->where('user_id', $user->id)
            ->latest()
            ->get()
            ->filter(fn(Bookmark $bookmark) => $bookmark->project !== null)
            ->map(fn(Bookmark $bookmark) => $this->formatProjectCard($bookmark->project));
    }

    protected function projectsForUser(User $user): Builder
    {
        return Project::query()->where('user_id', $user->id);
    }

    /**
     * サマリー用のメトリクス（公開中・進行中・完了案件数）を取得
     *
     * @param User $user
     * @return array{openProjects: int, inProgressProjects: int, completedProjects: int}
     */
    protected function buildSummaryMetrics(User $user): array
    {
        $aggregates = $this->projectsForUser($user)
            ->selectRaw(implode(', ', [
                "SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_count",
                "SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_count",
                "SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count",
            ]))
            ->first();

        return [
            'openProjects' => (int) ($aggregates?->open_count ?? 0),
            'inProgressProjects' => (int) ($aggregates?->in_progress_count ?? 0),
            'completedProjects' => (int) ($aggregates?->completed_count ?? 0),
        ];
    }

    protected function resolveClientVariant(int $openProjects, int $inProgressProjects, int $completedAwaitingReview): string
    {
        if ($openProjects === 0 && $inProgressProjects === 0 && $completedAwaitingReview === 0) {
            return 'firstVisit';
        }

        if ($openProjects === 0 && $inProgressProjects > 0) {
            return 'holiday';
        }

        return 'default';
    }

    protected function buildClientHeadline(int $openProjects, int $unreadMessages): string
    {
        if ($unreadMessages > 0) {
            return '応募者とのコミュニケーションを進めて採用を決めましょう。';
        }

        if ($openProjects > 0) {
            return '公開中の案件の応募状況を定期的に確認しましょう。';
        }

        return '最初の案件を投稿してパートナー探しを始めましょう。';
    }

    protected function buildClientNextActionText(int $openProjects, int $unreadMessages): ?string
    {
        if ($unreadMessages > 0) {
            return '未対応の応募があります。早めに返信するとマッチ率が高まります。';
        }

        if ($openProjects > 0) {
            return '応募が届き次第、ここで対応状況を確認できます。';
        }

        return '案件作成ウィザードで募集情報を5分で登録できます。';
    }

    protected function clientSpecialMessage(string $variant): ?string
    {
        return match ($variant) {
            'firstVisit' => '初回セットアップを進めると採用活動がスムーズになります。',
            'holiday' => '進行中の案件を整えて、次の募集準備を進めておきましょう。',
            default => null,
        };
    }

    protected function clientPriorityLabel(int $applications, ?int $daysUntil): string
    {
        $urgency = $this->priorityFromDaysUntil($daysUntil);

        return match ($urgency) {
            'high' => '応募 ' . $applications . '件 / 期限が迫っています',
            'medium' => '応募 ' . $applications . '件 / 今週中に対応',
            default => '応募 ' . $applications . '件 / 計画的に確認しましょう',
        };
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

    protected function ctaVariantsForMode(DashboardMode $mode): array
    {
        return config("dashboard.cta_variants.{$mode->value}", []);
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
