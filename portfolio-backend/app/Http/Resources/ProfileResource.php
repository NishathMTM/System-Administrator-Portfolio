<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProfileResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'title' => $this->title,
            'bio' => $this->bio,
            'about_heading' => $this->about_heading,
            'about_body' => $this->about_body,
            'skills' => $this->skills,
            'experience' => $this->experience,
            'education' => $this->education,
            'certifications' => $this->certifications,
            'profile_image' => $this->publicFileUrl($this->profile_image),
            'resume_file' => $this->publicFileUrl($this->resume_file),
            'github_url' => $this->github_url,
            'linkedin_url' => $this->linkedin_url,
            'twitter_url' => $this->twitter_url,
        ];
    }

    private function publicFileUrl(?string $path): ?string
    {
        return $path && Storage::disk('public')->exists($path)
            ? asset('storage/' . $path)
            : null;
    }
}
