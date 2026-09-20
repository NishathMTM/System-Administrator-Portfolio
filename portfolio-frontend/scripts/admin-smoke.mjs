// Browser integration checks using Node 22+ built-ins and Chrome DevTools.
// Start a dedicated headless Chrome with --remote-debugging-port=9222, then:
// node scripts/admin-smoke.mjs --url http://localhost:5173 --out artifacts/admin
// ALL API requests are mocked. No credentials or mutations reach a real server.
// Backend authorization/persistence must be verified separately by Laravel tests.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const options = Object.fromEntries(process.argv.slice(2).flatMap((value, index, args) =>
  value.startsWith('--') ? [[value.slice(2), args[index + 1]]] : []));
const endpoint = String(options.endpoint || 'http://127.0.0.1:9222').replace(/\/$/, '');
const origin = String(options.url || 'http://localhost:5173').replace(/\/$/, '');
const output = path.resolve(String(options.out || 'artifacts/admin'));
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

class DevTools {
  constructor(socket) {
    this.socket = socket;
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
    socket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        clearTimeout(pending.timeout);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
      } else {
        for (const listener of this.listeners.get(message.method) || []) listener(message.params);
      }
    });
  }

  static async connect(url) {
    const socket = new WebSocket(url);
    await new Promise((resolve, reject) => {
      socket.addEventListener('open', resolve, { once: true });
      socket.addEventListener('error', reject, { once: true });
    });
    return new DevTools(socket);
  }

  on(name, listener) { this.listeners.set(name, [...(this.listeners.get(name) || []), listener]); }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.id;
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP timed out: ${method}`));
      }, 15000);
      this.pending.set(id, { resolve, reject, timeout });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  }

  async until(expression, message, timeout = 12000) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (await this.evaluate(expression)) return;
      await delay(100);
    }
    throw new Error(message);
  }
}

const report = { mode: 'Mocked API, isolated browser context; no live data or credentials used', checks: [], screenshots: [], requests: [], runtimeErrors: [] };
const mockToken = 'browser-smoke-only-not-a-real-auth-token';
const mockUser = { id: 9001, name: 'Mohamed Nishath', email: 'browser-only@example.test', is_admin: true };
let profile = {
  id: 1, full_name: 'Mohamed Nishath', title: 'Networking & IT Support Professional',
  bio: 'Connecting systems. Supporting people.', about_heading: 'Technology that works for people.',
  about_body: 'This is a temporary browser fixture. The live portfolio is unchanged.',
  skills: ['Networking', 'IT support'], experience: '', education: '', certifications: '',
  profile_image: `${origin}/images/mohamed-nishath.png`, resume_file: null,
  github_url: '', linkedin_url: '', twitter_url: '',
};
let projects = [{
  id: 101, title: 'Example networking lab', slug: 'example-networking-lab',
  description: 'A browser fixture for testing portfolio content management.',
  technologies: ['Routing', 'Switching'], is_published: true, is_featured: false,
  featured_image: null, github_link: null, live_link: null,
  created_at: '2026-09-19T00:00:00.000Z', updated_at: '2026-09-19T00:00:00.000Z',
}];
let signedIn = false;
let rejectLogin = true;
let apiBase;
let client;
let browser;
let browserContextId;

const header = (headers, name) => Object.entries(headers).find(([key]) => key.toLowerCase() === name)?.[1] || '';
const collection = values => ({ data: values, meta: { current_page: 1, last_page: 1, per_page: 10, total: values.length }, links: { prev: null, next: null } });

async function requestFields(request) {
  if (!request.postData) return {};
  const type = header(request.headers, 'content-type');
  if (type.includes('application/json')) return JSON.parse(request.postData);
  if (type.includes('multipart/form-data')) {
    return Object.fromEntries(await new Response(request.postData, { headers: { 'Content-Type': type } }).formData());
  }
  return Object.fromEntries(new URLSearchParams(request.postData));
}

async function fulfill(requestId, status, data = {}) {
  await client.send('Fetch.fulfillRequest', {
    requestId, responseCode: status,
    responseHeaders: [
      { name: 'Content-Type', value: 'application/json' },
      { name: 'Access-Control-Allow-Origin', value: origin },
      { name: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS' },
      { name: 'Access-Control-Allow-Headers', value: 'Content-Type, Accept, Authorization, X-Requested-With' },
      { name: 'Cache-Control', value: 'no-store' },
    ],
    body: status === 204 ? '' : Buffer.from(JSON.stringify(data)).toString('base64'),
  });
}

async function intercept({ requestId, request }) {
  const url = new URL(request.url);
  // Vite serves frontend modules from /src/api/*.js; those are not API calls.
  const apiIndex = url.pathname.startsWith('/api/') ? 0 : -1;
  const mutation = !['GET', 'HEAD', 'OPTIONS'].includes(request.method);
  if (apiIndex < 0) {
    // Fail closed if an unexpected mutation goes to a URL outside /api/.
    if (mutation) {
      report.runtimeErrors.push(`Blocked unexpected mutation: ${request.method} ${url.pathname}`);
      return fulfill(requestId, 400, { message: 'Unexpected mutation blocked by browser test.' });
    }
    return client.send('Fetch.continueRequest', { requestId });
  }

  apiBase ||= `${url.origin}${url.pathname.slice(0, apiIndex + 4)}`;
  const route = url.pathname.slice(apiIndex + 4);
  if (request.method === 'OPTIONS') return fulfill(requestId, 204);
  const fields = await requestFields(request);
  const method = fields._method || request.method;
  const authorized = signedIn && header(request.headers, 'authorization') === `Bearer ${mockToken}`;
  const loggedRequest = { method, route, authorized };
  if (mutation && route !== '/login') loggedRequest.fields = fields;
  report.requests.push(loggedRequest);

  if (route === '/login' && method === 'POST') {
    if (rejectLogin) return fulfill(requestId, 422, { message: 'The provided credentials are incorrect.', errors: { email: ['The provided credentials are incorrect.'] } });
    signedIn = true;
    return fulfill(requestId, 200, { token: mockToken, user: mockUser });
  }
  if (route === '/profile' && method === 'GET') return fulfill(requestId, 200, { data: profile });
  if (route === '/projects' && method === 'GET') return fulfill(requestId, 200, collection(projects.filter(project => project.is_published)));
  if (route === '/blogs' && method === 'GET') return fulfill(requestId, 200, collection([]));
  if (!authorized) return fulfill(requestId, 401, { message: 'Unauthenticated.' });
  if (route === '/user') return fulfill(requestId, 200, mockUser);
  if (route === '/logout' && method === 'POST') {
    signedIn = false;
    return fulfill(requestId, 200, { message: 'Logged out successfully.' });
  }
  if (route === '/profile' && method === 'POST') {
    profile = { ...profile, ...fields, skills: JSON.parse(fields.skills) };
    return fulfill(requestId, 200, { data: profile });
  }
  if (route === '/admin/projects') return fulfill(requestId, 200, collection(projects));
  if (route.startsWith('/admin/projects/')) {
    const project = projects.find(item => item.id === Number(route.split('/').at(-1)));
    return fulfill(requestId, project ? 200 : 404, project ? { data: project } : { message: 'Not found.' });
  }
  if (route === '/projects' && method === 'POST') {
    const project = {
      id: 202, ...fields, technologies: JSON.parse(fields.technologies),
      is_published: fields.is_published === '1', is_featured: fields.is_featured === '1',
      slug: fields.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), featured_image: null,
      created_at: '2026-09-19T01:00:00.000Z', updated_at: '2026-09-19T01:00:00.000Z',
    };
    projects.unshift(project);
    return fulfill(requestId, 201, { data: project });
  }
  if (route === '/projects/202' && method === 'PUT') {
    const current = projects.find(project => project.id === 202);
    Object.assign(current, fields, {
      technologies: JSON.parse(fields.technologies), is_published: fields.is_published === '1', is_featured: fields.is_featured === '1',
    });
    return fulfill(requestId, 200, { data: current });
  }
  if (route === '/projects/202' && method === 'DELETE') {
    projects = projects.filter(project => project.id !== 202);
    return fulfill(requestId, 200, { message: 'Project deleted.' });
  }
  if (['/admin/blogs', '/contacts'].includes(route) && method === 'GET') return fulfill(requestId, 200, collection([]));
  report.runtimeErrors.push(`Unhandled mock API: ${method} ${route}`);
  return fulfill(requestId, 404, { message: 'No browser fixture configured for this endpoint.' });
}

async function navigate(route) {
  await client.send('Page.navigate', { url: `${origin}${route}` });
  await client.until("document.readyState === 'complete' && Boolean(document.querySelector('h1'))", `Page did not load: ${route}`);
}

async function click(selector) {
  assert(await client.evaluate(`(() => { const element = document.querySelector(${JSON.stringify(selector)}); if (!element) return false; element.click(); return true; })()`), `Missing control: ${selector}`);
}

async function fill(values) {
  await client.evaluate(`(() => {
    for (const [name, value] of Object.entries(${JSON.stringify(values)})) {
      const element = document.querySelector('form [name="' + name + '"]');
      if (!element) throw new Error('Missing form field: ' + name);
      const prototype = element.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(prototype, 'value').set.call(element, value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
  })()`);
}

async function snapshot(label, width = 1440) {
  await client.send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 600 });
  await client.evaluate('document.fonts.ready.then(() => true)');
  await delay(180);
  const viewport = await client.evaluate('({ width: innerWidth, documentWidth: document.documentElement.scrollWidth })');
  assert(viewport.documentWidth <= viewport.width + 1, `Horizontal overflow on ${label} at ${width}px`);
  const metrics = await client.send('Page.getLayoutMetrics');
  const screenshot = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
    clip: { x: 0, y: 0, width, height: Math.min(metrics.cssContentSize.height, 14000), scale: 1 } });
  const filename = `${label}-${width}.png`;
  await writeFile(path.join(output, filename), Buffer.from(screenshot.data, 'base64'));
  report.screenshots.push(filename);
}

try {
  await mkdir(output, { recursive: true });
  const version = await (await fetch(`${endpoint}/json/version`)).json();
  browser = await DevTools.connect(version.webSocketDebuggerUrl);
  ({ browserContextId } = await browser.send('Target.createBrowserContext'));
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank', browserContextId });
  const targetUrl = new URL(version.webSocketDebuggerUrl);
  targetUrl.pathname = `/devtools/page/${targetId}`;
  client = await DevTools.connect(targetUrl.href);
  client.on('Runtime.exceptionThrown', ({ exceptionDetails }) => report.runtimeErrors.push(exceptionDetails.exception?.description || exceptionDetails.text));
  client.on('Fetch.requestPaused', params => {
    intercept(params).catch(async error => {
      report.runtimeErrors.push(error.message);
      await fulfill(params.requestId, 500, { message: 'Browser fixture failed.' }).catch(() => {});
    });
  });
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] });
  await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });

  await navigate('/');
  assert(await client.evaluate("![...document.querySelectorAll('a')].some(link => { const href = link.getAttribute('href') || ''; return href === '/login' || href === '/admin' || href.startsWith('/admin/'); })"), 'Public website exposes an admin navigation link');
  assert(await client.evaluate("!document.querySelector('.admin-sidebar')"), 'Public page contains admin workspace');
  report.checks.push('Public navigation contains no admin or login links');

  await navigate('/admin/projects');
  await client.until("location.pathname === '/admin/login' && Boolean(document.querySelector('[name=password]'))", 'Anonymous admin route did not redirect to login');
  assert(!report.requests.some(request => request.route.startsWith('/admin/')), 'Anonymous route fetched private admin data');
  report.checks.push('Anonymous admin URL redirects before requesting private content');
  await snapshot('login');
  await fill({ email: mockUser.email, password: 'mock-password-only-123' });
  await client.evaluate("document.querySelector('form').requestSubmit()");
  await client.until("Boolean(document.querySelector('[role=alert]'))", 'Failed login feedback is missing');
  assert(await client.evaluate("localStorage.getItem('admin_token') === null"), 'Failed login stored a token');
  rejectLogin = false;
  await client.evaluate("document.querySelector('form').requestSubmit()");
  await client.until("location.pathname === '/admin' && Boolean(document.querySelector('.admin-dashboard-card'))", 'Admin login did not open dashboard');
  report.checks.push('Login feedback, token storage, and administrator dashboard work with mocked authentication');
  await snapshot('dashboard');

  await click('a[href="/admin/profile"]');
  await client.until("Boolean(document.querySelector('[name=about_body]'))", 'Profile form did not load');
  const updated = {
    bio: 'Browser-tested networking and IT support introduction.',
    about_heading: 'A connected portfolio, updated in the admin workspace.',
    about_body: 'Temporary browser-only copy. No live content was changed.\n\nA second paragraph checks formatting.',
    skills: 'Networking, IT support, Troubleshooting', experience: 'Browser fixture: experience entry.',
    education: 'Browser fixture: education entry.', certifications: 'Browser fixture: certification entry.',
  };
  await fill(updated);
  await client.evaluate("document.querySelector('form').requestSubmit()");
  await client.until("document.querySelector('.admin-notice-success')?.textContent.includes('Profile saved')", 'Profile save feedback missing');
  const profileWrite = report.requests.find(request => request.method === 'POST' && request.route === '/profile');
  assert(profileWrite?.authorized, 'Profile write did not include authorization');
  assert(profileWrite.fields.about_body.replace(/\r\n/g, '\n') === updated.about_body, 'Profile paragraph content changed in multipart submission');
  assert(JSON.stringify(JSON.parse(profileWrite.fields.skills)) === JSON.stringify(['Networking', 'IT support', 'Troubleshooting']), 'Profile skills were not submitted as a JSON array');
  for (const key of ['about_heading', 'experience', 'education', 'certifications']) assert(profileWrite.fields[key] === updated[key], `Missing profile field: ${key}`);
  await snapshot('profile');

  const profileReads = report.requests.filter(request => request.method === 'GET' && request.route === '/profile').length;
  await client.evaluate("window.__adminSmokeDocument = 'same-document-check'");
  await click('a[href="/about"]');
  await client.until(`location.pathname === '/about' && document.body.innerText.includes(${JSON.stringify(updated.about_heading)})`, 'Saved profile did not appear on About');
  assert(await client.evaluate(`document.body.innerText.includes(${JSON.stringify(updated.education)}) && document.body.innerText.includes(${JSON.stringify(updated.certifications)})`), 'Qualification fields were not rendered on About');
  await click('a.brand');
  await client.until(`location.pathname === '/' && document.body.innerText.includes(${JSON.stringify(updated.bio)})`, 'Saved introduction did not appear on Home');
  assert(await client.evaluate("window.__adminSmokeDocument === 'same-document-check'"), 'Public profile verification reloaded the page');
  assert(profileReads === report.requests.filter(request => request.method === 'GET' && request.route === '/profile').length, 'Profile was refetched instead of updating shared context');
  report.checks.push('Profile multipart save updates Home and About immediately without reload or refetch');

  await navigate('/admin/projects');
  await click('a[href="/admin/projects/create"]');
  await client.until("Boolean(document.querySelector('[name=technologies]'))", 'New project form missing');
  const projectTitle = 'Browser-only IT support project';
  await fill({ title: projectTitle, description: 'Temporary project created only inside the mocked browser fixture.', technologies: 'LAN, IT support, Troubleshooting' });
  assert(await client.evaluate("!document.querySelector('[name=is_published]').checked"), 'New projects should start as private drafts');
  await client.evaluate("document.querySelector('form').requestSubmit()");
  await client.until("location.pathname === '/admin/projects' && Boolean(document.querySelector('a[href=\"/admin/projects/edit/202\"]'))", 'New draft did not appear in project manager');
  const createWrite = report.requests.find(request => request.method === 'POST' && request.route === '/projects');
  assert(createWrite?.fields.is_published === '0', 'Draft create request did not explicitly send is_published=0');
  assert(JSON.stringify(JSON.parse(createWrite.fields.technologies)) === JSON.stringify(['LAN', 'IT support', 'Troubleshooting']), 'Project technologies were not JSON encoded');
  assert(await client.evaluate("document.querySelector('a[href=\"/admin/projects/edit/202\"]').closest('tr').innerText.includes('Draft')"), 'Draft badge missing');
  await navigate('/projects');
  await client.until("!document.body.innerText.includes('Loading') && Boolean(document.querySelector('h1'))", 'Public projects are still loading');
  assert(await client.evaluate(`!document.body.innerText.includes(${JSON.stringify(projectTitle)})`), 'Draft appeared on public Projects page');
  report.checks.push('Creating a draft sends explicit privacy state and JSON technologies; public list excludes draft fixture');

  await navigate('/admin/projects');
  await click('a[href="/admin/projects/edit/202"]');
  await client.until(`document.querySelector('[name=title]')?.value === ${JSON.stringify(projectTitle)}`, 'Project edit did not load stored data');
  assert(report.requests.some(request => request.method === 'GET' && request.route === '/admin/projects/202'), 'Edit form did not use admin ID endpoint');
  await click('[name=is_published]');
  await client.evaluate("document.querySelector('form').requestSubmit()");
  await client.until("location.pathname === '/admin/projects' && document.querySelector('a[href=\"/admin/projects/edit/202\"]')?.closest('tr').innerText.includes('Published')", 'Published project state missing');
  assert(report.requests.some(request => request.method === 'PUT' && request.route === '/projects/202' && request.fields.is_published === '1'), 'Project publication did not send PUT override and published flag');
  await snapshot('projects');
  await navigate('/projects');
  await client.until(`document.body.innerText.includes(${JSON.stringify(projectTitle)})`, 'Published project was not rendered publicly');
  report.checks.push('ID-based project edit publishes correctly and public projects render the saved item');

  await navigate('/admin/projects');
  await client.until("Boolean(document.querySelector('a[href=\"/admin/projects/edit/202\"]'))", 'Project list missing before deletion');
  const openDelete = "document.querySelector('a[href=\"/admin/projects/edit/202\"]').closest('tr').querySelector('button').click()";
  await client.evaluate(openDelete);
  await client.until("Boolean(document.querySelector('.admin-delete-confirm'))", 'Delete confirmation missing');
  assert(!report.requests.some(request => request.method === 'DELETE'), 'Project deleted before confirmation');
  await client.evaluate("[...document.querySelectorAll('.admin-delete-confirm button')].find(button => button.textContent === 'Keep it').click()");
  await client.until("!document.querySelector('.admin-delete-confirm')", 'Cancel deletion did not close confirmation');
  assert(!report.requests.some(request => request.method === 'DELETE'), 'Cancel deletion sent a delete request');
  await client.evaluate(openDelete);
  await client.until("Boolean(document.querySelector('.admin-delete-confirm'))", 'Second deletion confirmation missing');
  await client.evaluate("[...document.querySelectorAll('.admin-delete-confirm button')].find(button => button.textContent === 'Delete permanently').click()");
  await client.until(`Boolean(document.querySelector('.admin-table')) && !document.querySelector('.admin-table').innerText.includes(${JSON.stringify(projectTitle)})`, 'Deleted project remains in list');
  assert(report.requests.filter(request => request.method === 'DELETE' && request.route === '/projects/202').length === 1, 'Confirmed deletion did not send exactly one DELETE');
  report.checks.push('Project deletion requires explicit confirmation; cancellation preserves the item');

  await snapshot('projects', 390);
  await click('a.admin-brand');
  await client.until("Boolean(document.querySelector('.admin-dashboard-card'))", 'Mobile dashboard missing');
  await snapshot('dashboard', 390);
  await click('a[href="/admin/profile"]');
  await client.until("Boolean(document.querySelector('[name=about_body]'))", 'Mobile profile form missing');
  await snapshot('profile', 390);
  report.checks.push('Dashboard, profile, and project management fit desktop and mobile viewports');

  await client.evaluate("[...document.querySelectorAll('button')].find(button => button.textContent === 'Sign out').click()");
  await client.until("location.pathname === '/admin/login' && localStorage.getItem('admin_token') === null", 'Logout did not clear token and return to login');
  assert(!signedIn && report.requests.some(request => request.route === '/logout' && request.authorized), 'Logout did not request authenticated token revocation from the mock API');
  const oldTokenStatus = await client.evaluate(`fetch(${JSON.stringify(`${apiBase}/user`)}, { headers: { Authorization: ${JSON.stringify(`Bearer ${mockToken}`)} } }).then(response => response.status)`);
  assert(oldTokenStatus === 401, 'Mock API did not reject the signed-out token');
  await navigate('/admin/profile');
  await client.until("location.pathname === '/admin/login'", 'Signed-out user could reopen private profile');
  await snapshot('login', 390);
  report.checks.push('Logout requests token revocation, clears browser access, and restores route protection (mock server)');

  assert(report.runtimeErrors.length === 0, `Browser runtime errors: ${report.runtimeErrors.join('\n')}`);
  report.passed = true;
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ mocked: true, checksPassed: report.checks.length, screenshots: report.screenshots.length, runtimeErrors: report.runtimeErrors.length, report: path.join(output, 'report.json') }, null, 2));
} catch (error) {
  report.passed = false;
  report.failure = error.message;
  if (client) {
    report.lastPage = await client.evaluate('({ route: location.pathname, text: document.body.innerText.slice(0, 1600) })').catch(() => null);
  }
  await mkdir(output, { recursive: true });
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.error(error.message);
  process.exitCode = 1;
} finally {
  client?.socket.close();
  if (browserContextId) await browser?.send('Target.disposeBrowserContext', { browserContextId }).catch(() => {});
  browser?.socket.close();
}
