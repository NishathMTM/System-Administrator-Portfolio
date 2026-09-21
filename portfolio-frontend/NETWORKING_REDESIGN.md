# Networking & IT support portfolio

The public portfolio includes the supplied portrait, animated network details, scroll reveals, an interactive topology, an IT support section, and responsive layouts. The Home page includes an animation pause control and respects the visitor's reduced-motion preference.

## Edit the website

Open `/admin/login` directly and sign in with an administrator account. Public navigation does not advertise the admin area. Authorization is also enforced by Laravel: visitors and authenticated non-admin accounts cannot access management endpoints or modify content.

- **About & profile:** edit the name, professional title, home introduction, About heading/body, skills, experience, education, certifications, photo, CV, and social links. Saved profile changes appear immediately when navigating to the public website.
- **Projects:** create, edit, delete, and publish networking or IT support work. New projects start as drafts in the editor. Drafts are unavailable through public listing and detail APIs.
- **Technical notes:** manage draft and published articles.
- **Messages:** read and manage contact enquiries.

The previous demo projects were moved to drafts without deleting them. The four clearly labeled lab blueprints are static learning resources at `/labs/:slug`, separate from CMS projects at `/projects/:slug`.

Your supplied photo is bundled at `public/images/mohamed-nishath.png` and copied to the local profile's public storage. A later photo upload in the admin panel takes precedence. The CV previously referenced in the database remains missing; no employment history or certifications have been invented.

## Local development

Start **MySQL** in the XAMPP Control Panel, then open two terminals. The backend needs the local MySQL database for saved profile content, admin access, and contact messages.

Backend, in the first terminal:

```powershell
cd "C:\xampp\htdocs\my portfolio\portfolio-backend"
php artisan serve --host=127.0.0.1 --port=8000
```

Frontend, in the second terminal:

```powershell
cd "C:\xampp\htdocs\my portfolio\portfolio-frontend"
npm run dev
```

Website: `http://localhost:5173/`. Admin: `http://localhost:5173/admin/login`. The equivalent `http://127.0.0.1:5173/` address opens the same portfolio.

The Vite configuration pins the frontend to `127.0.0.1:5173` and uses `strictPort`, so an occupied port produces an error instead of silently changing the website address. The backend runs at `127.0.0.1:8000`.

Start the frontend from the `my portfolio` folder shown above. If you also run the older `My-Portfolio` project, give it a different port (for example, `npm run dev -- --port 5174 --strictPort`). An older server listening on IPv6 localhost (`::1`) at port 5173 can otherwise make `localhost` display a different project from `127.0.0.1`.

Keep both terminal commands running while using the website. After restarting Windows or closing the servers, start MySQL and run both commands again. A browser bookmark does not start these servers; `ERR_CONNECTION_REFUSED` means the server at that address is not accepting connections.

## Deployment configuration

### Vercel frontend

Set the Vercel project's **Root Directory** to `portfolio-frontend`. Its `vercel.json` selects Vite, installs with `npm ci`, builds with `npm run build`, publishes `dist`, and adds the React Router page fallback. A second config at the repository root supports existing projects whose Root Directory is `.` by building and publishing the nested frontend. Do not use `src`, `public`, `dist`, or the Laravel directory as the Vercel root.

Deploy the latest GitHub commit after updating these settings. Use the newest deployment's Visit link, then check `/`, `/about`, and `/admin/login` directly. A successful build of an older commit will not include new configuration changes.

Host Laravel separately with a database and persistent storage. In Vercel's environment variables, set `VITE_API_URL` to the backend's HTTPS API URL ending in `/api`, allow the Vercel origin in backend CORS settings, and redeploy. The frontend-only deployment does not run PHP or provide a database. The public profile and bundled portrait have local fallbacks; admin editing and contact submissions require the live API. API, storage, and asset requests are excluded from the SPA fallback so failures are not disguised as HTML pages.

See [Vercel's Vite routing guidance](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas) and [build/root-directory settings](https://vercel.com/docs/builds/configure-a-build#root-directory).

### Laravel backend

Run backend migrations and `php artisan storage:link`. Existing portfolio owners receive the administrator role through the additive migration; unrelated users are not promoted. Existing credentials are preserved. No default-password account is created by the seeder.

Create an administrator or set a new private password interactively on your server:

```powershell
php artisan portfolio:admin your@email.com --name="Mohamed Nishath"
```

The command prompts privately for a password and confirmation; it also revokes that user's old tokens. Use a private password before publishing a database that previously used demo credentials.

The production frontend configuration uses `VITE_API_URL=/api`. Serve Laravel's API at `/api` and public uploads at `/storage` on the same HTTPS domain, or set `VITE_API_URL` to the separate HTTPS backend API URL before building. Only Laravel's `public` directory should be web-accessible. Set `APP_ENV=production`, `APP_DEBUG=false`, and the correct `APP_URL`. Configure frontend routes to fall back to `index.html`, while `/api` and `/storage` are handled by the backend.

Deploy the built `dist` directory and backend application; preserve the database and uploaded storage. This task prepares the local application and does not publish it to a hosting provider.

## Verification

Run `npm run lint` and `npm run build` in the frontend, and `php artisan test` in the backend. Backend tests use an isolated SQLite memory database, including admin access, draft visibility, profile persistence, and upgrade behavior.

The dependency-free browser scripts require Node 22+ and an isolated Chrome debugging instance on port 9222:

```powershell
node scripts/browser-smoke.mjs --url http://127.0.0.1:5173 --contact
node scripts/admin-smoke.mjs --url http://127.0.0.1:5173
```

The public smoke test mocks contact submission. The admin browser test mocks all API data and writes; it never changes the live portfolio or uses real credentials. Screenshots and reports are saved under the ignored `artifacts/` directory.
