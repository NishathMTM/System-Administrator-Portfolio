<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize()
    {
        return (bool) $this->user()?->is_admin;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('technologies'))) {
            $technologies = json_decode($this->input('technologies'), true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $this->merge(['technologies' => $technologies]);
            }
        }
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:projects,slug',
            'description' => 'required|string',
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
