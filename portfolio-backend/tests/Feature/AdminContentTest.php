<?php

namespace Tests\Feature;

use App\Models\Blog;
use App\Models\Profile;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminContentTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(bool $admin = false): User
    {
        $user = new User([
            'name' => 'Portfolio Owner',
            'email' => uniqid('owner-', true).'@example.test',
            'password' => Hash::make('private-password-123'),
        ]);
        $user->is_admin = $admin;
        $user->save();

        return $user;
    }

    private function privateEndpoints(): array
    {
        return [
            ['GET', '/api/admin/projects'],
            ['GET', '/api/admin/projects/1'],
            ['GET', '/api/admin/blogs'],
            ['GET', '/api/admin/blogs/1'],
            ['POST', '/api/profile'],
            ['POST', '/api/projects'],
            ['PUT', '/api/projects/1'],
            ['DELETE', '/api/projects/1'],
            ['POST', '/api/blogs'],
            ['PUT', '/api/blogs/1'],
            ['DELETE', '/api/blogs/1'],
            ['GET', '/api/contacts'],
            ['PATCH', '/api/contacts/1/read'],
            ['DELETE', '/api/contacts/1'],
            ['GET', '/api/user'],
        ];
    }

    public function test_guests_cannot_access_private_reads_or_mutations(): void
    {
        foreach ($this->privateEndpoints() as [$method, $url]) {
            $this->json($method, $url)->assertUnauthorized();
        }
    }

    public function test_authenticated_non_admins_cannot_access_private_reads_or_mutations(): void
    {
        Sanctum::actingAs($this->makeUser());

        foreach ($this->privateEndpoints() as [$method, $url]) {
            $this->json($method, $url)->assertForbidden();
        }
    }

    public function test_login_only_issues_tokens_to_administrators(): void
    {
        $visitor = $this->makeUser();
        $this->postJson('/api/login', ['email' => $visitor->email, 'password' => 'private-password-123'])
            ->assertUnprocessable()->assertJsonValidationErrors('email');
        $this->assertDatabaseCount('personal_access_tokens', 0);

        $admin = $this->makeUser(true);
        $this->postJson('/api/login', ['email' => $admin->email, 'password' => 'private-password-123'])
            ->assertOk()->assertJsonPath('user.is_admin', true)->assertJsonStructure(['token']);
        $this->assertDatabaseCount('personal_access_tokens', 1);
    }

    public function test_upgrade_preserves_data_and_only_promotes_existing_profile_owners(): void
    {
        $owner = $this->makeUser();
        $visitor = $this->makeUser();
        Profile::create(['user_id' => $owner->id, 'full_name' => 'Existing Owner', 'bio' => 'Existing biography.']);
        $project = Project::create([
            'user_id' => $owner->id, 'title' => 'Existing project', 'slug' => 'existing-project',
            'description' => 'Existing project content.',
        ]);

        // This test runs only against the forced SQLite in-memory connection.
        $this->assertSame('sqlite', config('database.default'));
        $this->assertSame(':memory:', config('database.connections.sqlite.database'));
        $migration = require database_path('migrations/2026_09_19_000001_add_portfolio_admin_and_content_fields.php');
        $migration->down();
        $migration->up();

        $this->assertTrue($owner->fresh()->is_admin);
        $this->assertFalse($visitor->fresh()->is_admin);
        $this->assertSame($owner->password, $owner->fresh()->password);
        $this->assertSame('Existing biography.', $owner->profile->bio);
        $this->assertSame('Existing project content.', $project->fresh()->description);
        $this->assertTrue($project->fresh()->is_published);
    }

    public function test_repeated_login_attempts_are_rate_limited(): void
    {
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/login', ['email' => 'unknown@example.test', 'password' => 'wrong'])
                ->assertUnprocessable();
        }

        $this->postJson('/api/login', ['email' => 'unknown@example.test', 'password' => 'wrong'])
            ->assertStatus(429);
    }

    public function test_admin_profile_updates_persist_and_are_visible_publicly(): void
    {
        $admin = $this->makeUser(true);
        $profile = Profile::create(['user_id' => $admin->id, 'full_name' => 'Portfolio Owner']);
        Sanctum::actingAs($admin);

        $this->post('/api/profile', [
            'about_heading' => 'Networking and IT support',
            'about_body' => "Helping people stay connected.\nPractical support for everyday technology.",
            'skills' => json_encode(['Network troubleshooting', 'IT support']),
            'experience' => 'Experience entered by the owner.',
            'education' => 'Education entered by the owner.',
            'certifications' => 'Certifications entered by the owner.',
        ], ['Accept' => 'application/json'])->assertOk()
            ->assertJsonPath('data.skills', ['Network troubleshooting', 'IT support']);

        $this->assertSame('Networking and IT support', $profile->fresh()->about_heading);
        $this->assertSame(['Network troubleshooting', 'IT support'], $profile->fresh()->skills);
        $this->getJson('/api/profile')->assertOk()
            ->assertJsonPath('data.education', 'Education entered by the owner.')
            ->assertJsonPath('data.experience', 'Experience entered by the owner.')
            ->assertJsonPath('data.certifications', 'Certifications entered by the owner.');

        $this->postJson('/api/profile', ['skills' => '[{"unexpected":"object"}]'])
            ->assertUnprocessable()->assertJsonValidationErrors('skills.0');
        $this->postJson('/api/profile', ['skills' => 'not-json'])
            ->assertUnprocessable()->assertJsonValidationErrors('skills');
        $this->postJson('/api/profile', ['skills' => '[]', 'about_body' => null])
            ->assertOk()->assertJsonPath('data.skills', [])->assertJsonPath('data.about_body', null);
    }

    public function test_project_drafts_are_private_and_admins_can_find_edit_and_publish_by_id(): void
    {
        $admin = $this->makeUser(true);
        $published = Project::create([
            'user_id' => $admin->id, 'title' => 'Published lab', 'slug' => 'published-lab',
            'description' => 'Public project description.',
        ]);
        $draft = Project::create([
            'user_id' => $admin->id, 'title' => 'Draft lab', 'slug' => 'draft-lab',
            'description' => 'Private project description.', 'is_published' => false,
        ]);

        $this->getJson('/api/projects')->assertOk()->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $published->id);
        $this->getJson('/api/projects/draft-lab')->assertNotFound();

        Sanctum::actingAs($admin);
        $this->getJson('/api/projects')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson('/api/projects/draft-lab')->assertNotFound();
        $this->getJson('/api/admin/projects')->assertOk()->assertJsonCount(2, 'data');
        $this->getJson('/api/admin/projects/'.$draft->id)->assertOk()
            ->assertJsonPath('data.is_published', false);

        $this->post('/api/projects/'.$draft->id, [
            '_method' => 'PUT', 'title' => 'Updated lab', 'is_published' => '1',
            'technologies' => json_encode(['Routing', 'Switching']),
        ], ['Accept' => 'application/json'])->assertOk()->assertJsonPath('data.is_published', true);
        $this->getJson('/api/projects/draft-lab')->assertOk()->assertJsonPath('data.title', 'Updated lab');
        $this->deleteJson('/api/projects/'.$draft->id)->assertOk();
        $this->getJson('/api/admin/projects/'.$draft->id)->assertNotFound();

        $this->postJson('/api/projects', [
            'title' => 'New draft', 'description' => 'New project content.', 'is_published' => false,
        ])->assertCreated()->assertJsonPath('data.is_published', false);
    }

    public function test_blog_drafts_are_only_available_in_admin_endpoints(): void
    {
        $admin = $this->makeUser(true);
        Blog::create([
            'user_id' => $admin->id, 'title' => 'Published note', 'slug' => 'published-note',
            'content' => 'Public content.', 'status' => 'published',
        ]);
        $draft = Blog::create([
            'user_id' => $admin->id, 'title' => 'Draft note', 'slug' => 'draft-note',
            'content' => 'Private content.', 'status' => 'draft',
        ]);
        $this->getJson('/api/blogs')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson('/api/blogs/draft-note')->assertNotFound();

        Sanctum::actingAs($admin);
        $this->getJson('/api/blogs')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson('/api/blogs/draft-note')->assertNotFound();
        $this->getJson('/api/admin/blogs')->assertOk()->assertJsonCount(2, 'data');
        $this->getJson('/api/admin/blogs/'.$draft->id)->assertOk()
            ->assertJsonPath('data.content', 'Private content.');
        $this->post('/api/blogs/'.$draft->id, [
            '_method' => 'PUT', 'content' => 'Updated content.', 'status' => 'published',
        ], ['Accept' => 'application/json'])->assertOk();
        $this->getJson('/api/blogs/draft-note')->assertOk()->assertJsonPath('data.content', 'Updated content.');
        $this->deleteJson('/api/blogs/'.$draft->id)->assertOk();
        $this->getJson('/api/admin/blogs/'.$draft->id)->assertNotFound();
    }
}
