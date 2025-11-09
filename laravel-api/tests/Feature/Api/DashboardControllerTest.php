<?php

namespace Tests\Feature\Api;

use App\Models\Bookmark;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_summary_requires_authentication(): void
    {
        $this->getJson('/api/dashboard/summary')->assertUnauthorized();
    }

    public function test_summary_returns_expected_shape_for_authenticated_user(): void
    {
        $user = User::factory()->create(['name' => 'Test User']);
        Project::factory()->count(2)->for($user)->open()->create();
        Project::factory()->for($user)->inProgress()->create();
        Project::factory()->for($user)->completed()->create();

        Sanctum::actingAs($user);

        $this->getJson('/api/dashboard/summary')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'mode',
                    'summary' => [
                        'userName',
                        'headline',
                        'openProjects',
                        'inProgressProjects',
                        'unreadMessages',
                        'pendingReviews',
                        'nextActionText',
                        'variant',
                        'specialMessage',
                    ],
                    'ctaVariants',
                ],
            ])
            ->assertJsonFragment([
                'mode' => 'worker',
            ]);
    }

    public function test_tasks_returns_pending_items_based_on_projects(): void
    {
        $user = User::factory()->create();
        $urgentProject = Project::factory()
            ->for($user)
            ->open()
            ->create([
                'deadline' => now()->addDay(),
            ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/dashboard/tasks')->assertOk();

        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'title',
                    'type',
                    'priority',
                    'status',
                ],
            ],
        ]);

        $this->assertTrue(
            collect($response->json('data'))->pluck('id')->contains('project-' . $urgentProject->id)
        );
    }

    public function test_recommendations_excludes_own_and_bookmarked_projects(): void
    {
        $user = User::factory()->create();
        $ownProject = Project::factory()->for($user)->open()->create();
        $otherProject = Project::factory()->open()->create();
        $bookmarkedProject = Project::factory()->open()->create();

        Bookmark::factory()->for($user)->for($bookmarkedProject)->create();

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/dashboard/recommendations')->assertOk();
        $ids = collect($response->json('data'))->pluck('id');

        $this->assertFalse($ids->contains((string) $ownProject->id));
        $this->assertFalse($ids->contains((string) $bookmarkedProject->id));
        $this->assertTrue($ids->contains((string) $otherProject->id));
    }

    public function test_saved_projects_returns_bookmarked_entries(): void
    {
        $user = User::factory()->create();
        $bookmarkedProject = Project::factory()->open()->create();
        Bookmark::factory()->for($user)->for($bookmarkedProject)->create();

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/dashboard/saved-projects')->assertOk();
        $ids = collect($response->json('data'))->pluck('id');

        $this->assertTrue($ids->contains((string) $bookmarkedProject->id));
    }

    public function test_support_resources_returns_static_links(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->getJson('/api/dashboard/resources')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'title', 'href', 'category'],
                ],
            ]);
    }

    public function test_client_summary_returns_expected_metrics(): void
    {
        $user = User::factory()->create(['name' => 'Client User']);
        Project::factory()->for($user)->open()->create([
            'application_count' => 4,
        ]);
        Project::factory()->for($user)->inProgress()->create([
            'application_count' => 2,
        ]);
        Project::factory()->for($user)->completed()->create();

        Sanctum::actingAs($user);

        $this->getJson('/api/dashboard/summary?mode=client')
            ->assertOk()
            ->assertJsonFragment([
                'mode' => 'client',
            ])
            ->assertJsonPath('data.summary.openProjects', 1)
            ->assertJsonPath('data.summary.inProgressProjects', 1)
            ->assertJsonPath('data.summary.pendingReviews', 1)
            ->assertJsonPath('data.summary.unreadMessages', 6);
    }

    public function test_client_tasks_prioritize_open_projects(): void
    {
        $user = User::factory()->create();
        $urgentProject = Project::factory()->for($user)->open()->create([
            'deadline' => now()->addDay(),
            'application_count' => 5,
        ]);
        Project::factory()->for($user)->completed()->create();

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/dashboard/tasks?mode=client')->assertOk();

        $titles = collect($response->json('data'))->pluck('title');

        $this->assertTrue(
            $titles->contains('「' . $urgentProject->title . '」の応募者を確認する')
        );
    }

    public function test_client_recommendations_return_owned_projects(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->for($user)->open()->create();
        Project::factory()->open()->create();

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/dashboard/recommendations?mode=client')->assertOk();
        $ids = collect($response->json('data'))->pluck('id');

        $this->assertTrue($ids->contains((string) $project->id));
    }

    public function test_client_support_resources_returns_custom_links(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->getJson('/api/dashboard/resources?mode=client')
            ->assertOk()
            ->assertJsonFragment([
                'category' => 'guide',
            ]);
    }

    public function test_invalid_mode_falls_back_to_worker_mode(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // 空文字列の場合
        $this->getJson('/api/dashboard/summary?mode=')
            ->assertOk()
            ->assertJsonFragment([
                'mode' => 'worker',
            ]);

        // 無効な値の場合
        $this->getJson('/api/dashboard/summary?mode=invalid')
            ->assertOk()
            ->assertJsonFragment([
                'mode' => 'worker',
            ]);

        // 大文字の場合（小文字に正規化されない）
        $this->getJson('/api/dashboard/summary?mode=CLIENT')
            ->assertOk()
            ->assertJsonFragment([
                'mode' => 'worker',
            ]);
    }

    public function test_client_mode_with_no_projects_returns_empty_state(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/dashboard/summary?mode=client')
            ->assertOk()
            ->assertJsonFragment([
                'mode' => 'client',
            ]);

        $response->assertJsonPath('data.summary.openProjects', 0)
            ->assertJsonPath('data.summary.inProgressProjects', 0)
            ->assertJsonPath('data.summary.pendingReviews', 0)
            ->assertJsonPath('data.summary.unreadMessages', 0)
            ->assertJsonPath('data.summary.variant', 'firstVisit');
    }

    public function test_client_tasks_returns_empty_state_when_no_projects(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/dashboard/tasks?mode=client')->assertOk();

        $tasks = collect($response->json('data'));
        $this->assertCount(1, $tasks);
        $this->assertEquals('client-create-project', $tasks->first()['id']);
    }
}
