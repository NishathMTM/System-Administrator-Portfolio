<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'featured_image' => $this->featured_image ? asset('storage/' . $this->featured_image) : null,
            'github_link' => $this->github_link,
            'live_link' => $this->live_link,
            'technologies' => $this->technologies,
            'is_featured' => $this->is_featured,
            'is_published' => $this->is_published,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
