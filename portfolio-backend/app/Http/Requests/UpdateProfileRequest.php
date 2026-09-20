<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize()
    {
        return (bool) $this->user()?->is_admin;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('skills'))) {
            $skills = json_decode($this->input('skills'), true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $this->merge(['skills' => $skills]);
            }
        }
    }

    public function rules()
    {
        return [
            'full_name' => 'sometimes|string|max:255',
            'title' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'about_heading' => 'nullable|string|max:255',
            'about_body' => 'nullable|string|max:20000',
            'skills' => 'nullable|array|list|max:50',
            'skills.*' => 'required|string|max:100',
            'experience' => 'nullable|string|max:20000',
            'education' => 'nullable|string|max:20000',
            'certifications' => 'nullable|string|max:20000',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'resume_file' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'github_url' => 'nullable|url',
            'linkedin_url' => 'nullable|url',
            'twitter_url' => 'nullable|url',
        ];
    }
}
