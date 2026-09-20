# Mohamed Nishath - Networking & IT Support Portfolio

A React portfolio with an animated networking theme, a personal portrait, IT support content, and a private Laravel admin area for managing profile information, projects, technical notes, and contact messages.

## Project structure

- `portfolio-frontend/` - React and Vite website and admin interface.
- `portfolio-backend/` - Laravel API, authentication, database migrations, and tests.

The frontend previously lived at the repository root. Run frontend commands inside `portfolio-frontend` with this version.

## First-time setup

Install Node.js 22.12 or newer, PHP 8.2 or newer, and Composer. The backend environment example uses SQLite; alternatively configure your MySQL connection in the backend `.env` file before running migrations.

From a new checkout, set up the backend:

```powershell
cd portfolio-backend
composer install
Copy-Item .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan portfolio:admin your@email.com --name="Your Name"
php artisan serve --host=127.0.0.1 --port=8000
```

If Laravel asks to create the SQLite database, accept. The admin command prompts privately for your password. For an existing installation, preserve its `.env`, database, and uploaded files.

In a second terminal, starting from the repository root:

```powershell
cd portfolio-frontend
npm ci
Copy-Item .env.example .env
npm run dev
```

Open the website at <http://localhost:5173/> or <http://127.0.0.1:5173/>. Open the admin login directly at <http://localhost:5173/admin/login>. Keep both servers running. If using MySQL, keep it running as well. Run other Vite projects on a different port to avoid localhost conflicts.

## Content and administration

The public site includes the bundled portrait and networking/IT support lab blueprints. Use the admin area to update the About section, skills, work history, qualifications, photo, CV, projects, and articles. Projects and articles support drafts and publishing. Laravel enforces administrator access to all management endpoints.

Admin accounts, saved content, contact messages, and uploaded files belong to each installation's database and storage; they are not included in Git. Local environment files, dependencies, generated builds, and runtime logs are also excluded.

## Checks and deployment

```powershell
cd portfolio-frontend
npm run lint
npm run build
cd ../portfolio-backend
php artisan test
```

See [the setup, editing, and deployment guide](portfolio-frontend/NETWORKING_REDESIGN.md) for production API configuration, private admin setup, and browser checks. Uploading this repository to GitHub does not deploy the website; the admin area requires a running Laravel backend and database.
