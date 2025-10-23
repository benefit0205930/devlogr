<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $budgetMin = fake()->numberBetween(50000, 200000);
        $budgetMax = $budgetMin + fake()->numberBetween(10000, 150000);

        return [
            'title' => fake()->unique()->catchPhrase(),
            'description' => fake()->paragraph(),
            'category' => fake()->randomElement(['development', 'design', 'consulting']),
            'technologies' => fake()->randomElements(['Next.js', 'Laravel', 'TypeScript', 'Tailwind'], 2),
            'required_skills' => fake()->randomElements(['コミュニケーション', 'ドキュメント作成', 'レビュー'], 2),
            'budget_min' => $budgetMin,
            'budget_max' => $budgetMax,
            'deadline' => fake()->dateTimeBetween('now', '+3 weeks'),
            'estimated_duration' => fake()->randomElement(['週10時間〜', '2週間スプリント', '相談して決定']),
            'user_id' => User::factory(),
            'status' => fake()->randomElement(['open', 'in_progress', 'completed', 'draft']),
            'application_count' => fake()->numberBetween(0, 30),
        ];
    }

    public function open(): static
    {
        return $this->state(fn() => ['status' => 'open']);
    }

    public function inProgress(): static
    {
        return $this->state(fn() => ['status' => 'in_progress']);
    }

    public function completed(): static
    {
        return $this->state(fn() => ['status' => 'completed']);
    }
}
