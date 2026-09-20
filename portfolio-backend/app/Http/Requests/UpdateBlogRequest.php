<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBlogRequest extends FormRequest
{
    public function authorize()
    {
        return (bool) $this->user()?->is_admin;
    }

    public function rules()
    {
        return [
            'title' => 'sometimes|string|max:255',
            'slug' => ['sometimes', 'string', Rule::unique('blogs')->ignore($this->blog)],
            'content' => 'sometimes|string',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'sometimes|in:draft,published',
            'published_at' => 'nullable|date',
            'meta_description' => 'nullable|string|max:160',
        ];
    }
}
