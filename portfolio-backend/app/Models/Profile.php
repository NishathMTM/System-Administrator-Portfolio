<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'user_id', 'full_name', 'title', 'bio', 'profile_image',
        'resume_file', 'github_url', 'linkedin_url', 'twitter_url',
        'about_heading', 'about_body', 'skills', 'experience', 'education', 'certifications',
    ];

    protected $casts = [
        'skills' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
