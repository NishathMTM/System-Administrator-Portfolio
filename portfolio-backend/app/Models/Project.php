<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;

    protected $attributes = ['is_featured' => false, 'is_published' => true];

    protected $fillable = [
        'user_id', 'title', 'slug', 'description', 'featured_image',
        'github_link', 'live_link', 'technologies', 'is_featured', 'is_published',
    ];

    protected $casts = [
        'technologies' => 'array',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
