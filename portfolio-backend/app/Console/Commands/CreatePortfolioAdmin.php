<?php

namespace App\Console\Commands;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class CreatePortfolioAdmin extends Command
{
    protected $signature = 'portfolio:admin {email : Email address for the administrator} {--name= : Administrator display name}';

    protected $description = 'Create or update a portfolio administrator with a securely prompted password';

    public function handle(): int
    {
        if (! $this->input->isInteractive()) {
            $this->error('Run this command interactively so the password can be entered privately.');

            return self::FAILURE;
        }

        $email = mb_strtolower(trim($this->argument('email')));
        $identity = Validator::make(['email' => $email], ['email' => ['required', 'email', 'max:255']]);
        if ($identity->fails()) {
            $this->error($identity->errors()->first());

            return self::FAILURE;
        }

        $user = User::where('email', $email)->first();
        $name = $this->option('name') ?: ($user?->name ?: $this->ask('Display name'));
        // Disable visible-input fallback: passwords must never echo to a terminal or log.
        $password = $this->secret('New password (at least 12 characters, with letters and numbers)', false);
        $confirmation = $this->secret('Confirm new password', false);
        $validator = Validator::make([
            'name' => $name,
            'password' => $password,
            'password_confirmation' => $confirmation,
        ], [
            'name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'confirmed', Password::min(12)->letters()->numbers()],
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        DB::transaction(function () use ($user, $email, $name, $password) {
            $admin = $user ?? new User;
            $admin->fill(['email' => $email, 'name' => $name, 'password' => Hash::make($password)]);
            $admin->is_admin = true;
            $admin->save();
            $admin->tokens()->delete();

            if (! Profile::exists()) {
                Profile::create(['user_id' => $admin->id, 'full_name' => $name]);
            }
        });

        $this->info('Administrator saved. Sign in at /admin/login with this email and password.');

        return self::SUCCESS;
    }
}
