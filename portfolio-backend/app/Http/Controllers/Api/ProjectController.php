<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::where('is_published', true);
        if ($request->has('featured')) {
            $query->where('is_featured', true);
        }
        $projects = $query->latest()->paginate(10);
        return ProjectResource::collection($projects);
    }

    public function show($slug)
    {
        $project = Project::where('slug', $slug)->where('is_published', true)->firstOrFail();
        return new ProjectResource($project);
    }

    public function adminIndex()
    {
        return ProjectResource::collection(Project::latest()->paginate(10));
    }

    public function adminShow(int $id)
    {
        return new ProjectResource(Project::findOrFail($id));
    }

    public function store(StoreProjectRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        $data['slug'] = $data['slug'] ?? Str::slug($data['title']);

        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $request->file('featured_image')->store('projects', 'public');
        }

        $project = Project::create($data);
        return new ProjectResource($project);
    }

    public function update(UpdateProjectRequest $request, $id)
    {
        $project = Project::findOrFail($id);
        $data = $request->validated();

        if ($request->hasFile('featured_image')) {
            if ($project->featured_image) {
                Storage::disk('public')->delete($project->featured_image);
            }
            $data['featured_image'] = $request->file('featured_image')->store('projects', 'public');
        }

        $project->update($data);
        return new ProjectResource($project);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();
        return response()->json(['message' => 'Project deleted.']);
    }
}
