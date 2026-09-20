<?php

namespace Tests\Feature;

use App\Http\Resources\ProfileResource;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileResourceTest extends TestCase
{
    public function test_existing_public_uploads_have_urls(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('profiles/photo.png', 'profile image');
        Storage::disk('public')->put('resumes/cv.pdf', 'resume');

        $profile = new Profile([
            'profile_image' => 'profiles/photo.png',
            'resume_file' => 'resumes/cv.pdf',
        ]);

        $data = (new ProfileResource($profile))->toArray(Request::create('/api/profile'));

        $this->assertSame(asset('storage/profiles/photo.png'), $data['profile_image']);
        $this->assertSame(asset('storage/resumes/cv.pdf'), $data['resume_file']);
    }

    public function test_missing_uploads_return_null_without_changing_stored_paths(): void
    {
        Storage::fake('public');

        $profile = new Profile([
            'profile_image' => 'profiles/missing.png',
            'resume_file' => 'resumes/missing.pdf',
        ]);

        $data = (new ProfileResource($profile))->toArray(Request::create('/api/profile'));

        $this->assertNull($data['profile_image']);
        $this->assertNull($data['resume_file']);
        $this->assertSame('profiles/missing.png', $profile->profile_image);
        $this->assertSame('resumes/missing.pdf', $profile->resume_file);
    }

    public function test_a_profile_without_uploads_has_null_urls(): void
    {
        Storage::fake('public');

        $data = (new ProfileResource(new Profile()))->toArray(Request::create('/api/profile'));

        $this->assertNull($data['profile_image']);
        $this->assertNull($data['resume_file']);
    }
}
