<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();

        $projects = [
            [
                'title' => 'ECサイトのフロントエンド開発',
                'description' => 'React.jsを使用したECサイトのフロントエンド開発をお願いします。',
                'category' => 'Web開発',
                'budget_min' => 100000,
                'budget_max' => 300000,
                'deadline' => now()->addDays(30),
                'user_id' => $user->id,
            ],
            [
                'title' => 'テスト1',
                'description' => 'テスト1です。',
                'category' => 'デザイン',
                'budget_min' => 50000,
                'budget_max' => 100000,
                'deadline' => now()->addDays(14),
                'user_id' => $user->id,
            ],
            [
                'title' => '企業ロゴデザイン',
                'description' => '新規事業のロゴデザインを募集しています。',
                'category' => 'デザイン',
                'budget_min' => 50000,
                'budget_max' => 100000,
                'deadline' => now()->addDays(14),
                'user_id' => $user->id,
            ],
            [
                'title' => 'テスト3',
                'description' => 'テスト3です。',
                'category' => 'Web開発',
                'budget_min' => 50000,
                'budget_max' => 100000,
                'deadline' => now()->addDays(14),
                'user_id' => $user->id,
            ],
            [
                'title' => 'テスト4',
                'description' => 'テスト4です。',
                'category' => 'デザイン',
                'budget_min' => 50000,
                'budget_max' => 100000,
                'deadline' => now()->addDays(14),
                'user_id' => $user->id,
            ],
            [
                'title' => 'テスト5',
                'description' => 'テスト5です。',
                'category' => 'デザイン',
                'budget_min' => 50000,
                'budget_max' => 100000,
                'deadline' => now()->addDays(14),
                'user_id' => $user->id,
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}
