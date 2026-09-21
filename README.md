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

### Deploy the frontend to Netlify

Connect this GitHub repository and deploy branch `main`. The root `netlify.toml` supplies the settings:

| Setting | Value |
| --- | --- |
| Base directory | `portfolio-frontend` |
| Build command | `npm run build` |
| Publish directory | `dist` (relative to the base directory) |
| Node.js version | `22` |

Netlify installs the frontend dependencies automatically. The publish directory resolves to `portfolio-frontend/dist` in the repository. Do not publish the repository root, `src`, or `public`. After pushing changes, deploy the latest `main` commit from Netlify's Deploys page if automatic deployment is not enabled.

`public/_redirects` is copied into `dist` by Vite and enables direct visits and refreshes for the public pages and `/admin/login`. API, upload, and missing asset URLs keep their normal error responses. Add any future frontend route to this file when extending the app.

For a manual drag-and-drop deployment, first run `npm run build` inside `portfolio-frontend`, then upload the **`dist` folder** containing `index.html`, `_redirects`, `assets`, and `images`. Uploading the source repository without building it will not deploy the app.

Host the Laravel backend with a database and persistent uploads, then add `VITE_API_URL=https://your-api.example.com/api` in Netlify's environment variables and rebuild. Configure backend CORS to allow the Netlify site. The public portfolio has bundled defaults; admin login, saved content, and contact submissions require the hosted API.

### Deploy the frontend to Vercel

Import this GitHub repository, select branch `main`, and set **Root Directory** to **`portfolio-frontend`**. The included `vercel.json` sets the Vite framework, `npm ci`, `npm run build`, and output directory `dist`. It also serves the app when visitors directly open or refresh routes such as `/about`, `/projects`, and `/admin/login`.

If your existing Vercel project uses the repository root (`.`), the root `vercel.json` instead builds `portfolio-frontend` and publishes `portfolio-frontend/dist`. Use one of these two roots; do not select `src`, `public`, `dist`, or `portfolio-backend`. Deploy the latest commit after changing settings, and use that deployment's Visit link. An older deployment URL continues to show its older build.

This deploys the React frontend. Deploy Laravel with a database and persistent file storage on a PHP-capable host, then set **`VITE_API_URL`** in Vercel to its HTTPS API address, such as `https://your-api.example.com/api`, and redeploy. Configure the backend to allow your Vercel site's origin and serve upload URLs over HTTPS. Without that backend connection, the bundled public portfolio can display, but admin login, saved content updates, and contact submissions will not work. `/api` and `/storage` are deliberately excluded from the frontend's HTML fallback.
