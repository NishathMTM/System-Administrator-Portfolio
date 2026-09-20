<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\ProfileResource;
use App\Models\Profile;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show()
    {
        $profile = Profile::with('user')->firstOrFail();
        return new ProfileResource($profile);
    }

    public function update(UpdateProfileRequest $request)
    {
        $profile = Profile::firstOrFail();
        $data = $request->validated();

        if ($request->hasFile('profile_image')) {
            if ($profile->profile_image) {
                Storage::disk('public')->delete($profile->profile_image);
            }
            $data['profile_image'] = $request->file('profile_image')->store('profiles', 'public');
        }

        if ($request->hasFile('resume_file')) {
            if ($profile->resume_file) {
                Storage::disk('public')->delete($profile->resume_file);
            }
            $data['resume_file'] = $request->file('resume_file')->store('resumes', 'public');
        }

        $profile->update($data);
        return new ProfileResource($profile);
    }
}
