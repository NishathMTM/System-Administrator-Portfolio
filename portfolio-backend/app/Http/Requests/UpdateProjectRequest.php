<?php
namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class UpdateProjectRequest extends StoreProjectRequest
{
    public function authorize()
    {
        return (bool) $this->user()?->is_admin;
    }

    public function rules()
    {
        return [
            'title' => 'sometimes|string|max:255',
            'slug' => ['sometimes', 'string', Rule::unique('projects')->ignore($this->project)],
            'description' => 'sometimes|string',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'github_link' => 'nullable|url',
            'live_link' => 'nullable|url',
            'technologies' => 'nullable|array|list|max:50',
            'technologies.*' => 'required|string|max:100',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
        ];
    }
}
