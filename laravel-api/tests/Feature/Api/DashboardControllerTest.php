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
}
