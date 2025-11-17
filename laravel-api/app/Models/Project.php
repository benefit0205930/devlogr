<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'category',
        'technologies',
        'required_skills',
        'budget_min',
        'budget_max',
        'deadline',
        'estimated_duration',
        'user_id',
        'status',
        'application_count'
    ];

    protected $casts = [
        'deadline' => 'date',
        'technologies' => 'array',
        'required_skills' => 'array',
        'application_count' => 'integer'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    public function bookmarkedBy()
    {
        return $this->belongsToMany(User::class, 'bookmarks')->withTimestamps();
    }

    // フィルタリング用スコープメソッド

    // カテゴリフィルタ
    public function scopeFilterByCategories(Builder $query, array $categories): Builder
    {
        if (empty($categories)) return $query;
        return $query->whereIn('category', $categories);
    }

    // 価格範囲フィルタ
    public function scopeFilterByPriceRange(Builder $query, ?int $min, ?int $max): Builder
    {
        if ($min !== null) {
            $query->where('budget_max', '>=', $min);
        }
        if ($max !== null) {
            $query->where('budget_min', '<=', $max);
        }
        return $query;
    }

    // ステータスフィルタ
    public function scopeFilterByStatus(Builder $query, array $statuses): Builder
    {
        if (empty($statuses)) return $query;
        return $query->whereIn('status', $statuses);
    }

    // 期限フィルタ
    public function scopeFilterByDaysRemaining(Builder $query, ?int $days): Builder
    {
        if ($days === null) return $query;

        $targetDate = now()->addDays($days);
        return $query->where('deadline', '<=', $targetDate)->where('deadline', '>=', now());
    }

    // 技術スタックフィルタ
    public function scopeFilterByTechnologies(Builder $query, array $technologies): Builder
    {
        if (empty($technologies)) return $query;

        return $query->where(function ($q) use ($technologies) {
            foreach ($technologies as $tech) {
                $q->orWhereJsonContains('technologies', $tech);
            }
        });
    }

    // 検索キーワード
    public function scopeSearch(Builder $query, ?string $keyword): Builder
    {
        if (empty($keyword)) return $query;

        return $query->where(function ($q) use ($keyword) {
            $q->where('title', 'like', "%{$keyword}%")
                ->orWhere('description', 'like', "%{$keyword}%");
        });
    }

    // 除外キーワード
    public function scopeExcludeKeywords(Builder $query, array $keywords): Builder
    {
        if (empty($keywords)) return $query;

        return $query->whereNot(function ($q) use ($keywords) {
            foreach ($keywords as $keyword) {
                $q->orWhere(function ($subQ) use ($keyword) {
                    $subQ->where('title', 'like', "%{$keyword}%")
                        ->orWhere('description', 'like', "%{$keyword}%");
                });
            }
        });
    }

    // ブックマークフィルタ
    public function scopeBookmarkedBy(Builder $query, ?int $userId): Builder
    {
        if ($userId === null) return $query;

        return $query->whereHas('bookmarkedBy', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        });
    }

    // ソート
    public function scopeSortBy(Builder $query, string $sortBy): Builder
    {
        return match ($sortBy) {
            'newest' => $query->latest(),
            'popular' => $query->orderBy('application_count', 'desc'),
            'price_high' => $query->orderBy('budget_max', 'desc'),
            'price_low' => $query->orderBy('budget_min', 'asc'),
            'deadline_soon' => $query->orderBy('deadline', 'asc'),
            'application_few' => $query->orderBy('application_count', 'asc'),
            'application_many' => $query->orderBy('application_count', 'desc'),
            default => $query->latest(), // recommended は後でAIスコアリングなど実装
        };
    }
}
