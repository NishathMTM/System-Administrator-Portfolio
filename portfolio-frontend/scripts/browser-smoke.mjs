// Attach to Chrome started with --headless --remote-debugging-port=9222 and a
// dedicated --user-data-dir. Uses only Node 22+ built-ins; no browser dependency.
// node scripts/browser-smoke.mjs --url http://localhost:5173 --out artifacts/browser
// Add --contact to test failed/successful contact POSTs with mocked responses.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const options = Object.fromEntries(process.argv.slice(2).flatMap((value, index, args) =>
  value.startsWith('--') ? [[value.slice(2), args[index + 1]?.startsWith('--') || !args[index + 1] ? true : args[index + 1]]] : []));
const endpoint = String(options.endpoint || 'http://127.0.0.1:9222');
const origin = String(options.url || 'http://localhost:5173').replace(/\/$/, '');
const widths = String(options.widths || '1440,390').split(',').map(Number);
const routes = String(options.routes || '/,/about,/projects,/blogs,/contact').split(',');
const output = path.resolve(String(options.out || 'artifacts/browser'));
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
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

  on(name, listener) {
    this.listeners.set(name, [...(this.listeners.get(name) || []), listener]);
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.id;
      const timeout = setTimeout(() => { this.pending.delete(id); reject(new Error(`CDP timed out: ${method}`)); }, 15000);
      this.pending.set(id, { resolve, reject, timeout });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  }

  async until(expression, message, timeout = 10000) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (await this.evaluate(expression)) return;
      await sleep(100);
    }
    throw new Error(message);
  }
}

let client;
const report = { pages: [], checks: [], runtimeErrors: [] };
try {
  await mkdir(output, { recursive: true });
  const targetResponse = await fetch(`${endpoint}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' });
  assert(targetResponse.ok, 'Chrome debugging endpoint is unavailable. Start Chrome before running this helper.');
  const target = await targetResponse.json();
  client = await DevTools.connect(target.webSocketDebuggerUrl);
  client.on('Runtime.exceptionThrown', ({ exceptionDetails }) => report.runtimeErrors.push(exceptionDetails.exception?.description || exceptionDetails.text));
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });

  for (const width of widths) {
    await client.send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 600 });
    for (const route of routes) {
      await client.send('Page.navigate', { url: `${origin}${route}` });
      await client.until("document.readyState === 'complete' && Boolean(document.querySelector('main h1, h1'))", `Page did not load: ${route}`);
      await client.until("![...document.querySelectorAll('[role=status]')].some(el => /^Loading/i.test(el.textContent.trim()))", `Page is still loading: ${route}`, 20000);
      await client.evaluate('document.fonts.ready.then(() => true)');
      await sleep(600);
      const page = await client.evaluate(`({
        route: location.pathname,
        title: document.title,
        heading: document.querySelector('h1')?.innerText,
        textLength: document.querySelector('main')?.innerText.length || document.body.innerText.length,
        viewport: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        brokenImages: [...document.images].filter(image => image.complete && image.currentSrc && image.naturalWidth === 0).map(image => image.currentSrc),
        overflow: [...document.querySelectorAll('main *, header, footer')].filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && (rect.right > innerWidth + 1 || rect.left < -1);
        }).slice(0, 10).map(el => ({ tag: el.tagName, class: el.className }))
      })`);
      report.pages.push({ width, ...page });
      assert(page.route === route, `Unexpected route: ${page.route}, expected ${route}`);
      assert(page.heading && page.textLength > 80, `Missing page content: ${route}`);
      assert(page.documentWidth <= page.viewport + 1, `Horizontal overflow at ${width}px on ${route}: ${JSON.stringify(page.overflow)}`);
      assert(page.brokenImages.length === 0, `Broken images on ${route}: ${page.brokenImages.join(', ')}`);

      if (route === '/') {
        const topology = await client.evaluate(`(() => {
          const buttons = [...document.querySelectorAll('.topology-node')];
          const button = buttons.find(item => item.textContent.includes('Firewall'));
          if (!button) return false;
          button.click();
          return true;
        })()`);
        assert(topology, 'Interactive topology is missing');
        await client.until("[...document.querySelectorAll('.topology-node')].some(button => button.textContent.includes('Firewall') && button.getAttribute('aria-pressed') === 'true')", 'Topology selection did not update');
        report.checks.push(`Topology selection updates at ${width}px`);

        if (width < 600) {
          await client.evaluate("document.querySelector('.menu-toggle').click()");
          await client.until("document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'true'", 'Mobile menu did not open');
          await client.evaluate("document.querySelector('.navigation-links a[href=\"/about\"]').click()");
          await client.until("location.pathname === '/about' && document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false'", 'Mobile menu route did not close menu');
          await client.evaluate("document.querySelector('.brand').click()");
          await client.until("location.pathname === '/' && Boolean(document.querySelector('.topology-node'))", 'Home link failed');
          report.checks.push('Mobile menu opens, navigates, and closes');
        }
      }

      const metrics = await client.send('Page.getLayoutMetrics');
      const screenshot = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
        clip: { x: 0, y: 0, width, height: Math.min(metrics.cssContentSize.height, 14000), scale: 1 } });
      await writeFile(path.join(output, `${route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')}-${width}.png`), Buffer.from(screenshot.data, 'base64'));
    }
  }

  if (options.contact) {
    let contactStatus = 503;
    let intercepted = 0;
    client.on('Fetch.requestPaused', params => {
      if (!['POST', 'OPTIONS'].includes(params.request.method)) {
        client.send('Fetch.continueRequest', { requestId: params.requestId }).catch(error => report.runtimeErrors.push(error.message));
        return;
      }
      const isPreflight = params.request.method === 'OPTIONS';
      if (!isPreflight) intercepted++;
      const body = contactStatus === 200 ? { message: 'Your message has been received.' } : { message: 'Temporary service failure.' };
      client.send('Fetch.fulfillRequest', { requestId: params.requestId, responseCode: isPreflight ? 204 : contactStatus,
        responseHeaders: [
          { name: 'Content-Type', value: 'application/json' },
          { name: 'Access-Control-Allow-Origin', value: origin },
          { name: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
          { name: 'Access-Control-Allow-Headers', value: 'Content-Type, Accept, Authorization' },
        ], body: isPreflight ? '' : Buffer.from(JSON.stringify(body)).toString('base64'),
      }).catch(error => report.runtimeErrors.push(error.message));
    });
    // Intercept every POST during this test, even if the configured API URL changes.
    // This guarantees the smoke test cannot send a real contact message.
    await client.send('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] });
    await client.send('Page.navigate', { url: `${origin}/contact` });
    await client.until("Boolean(document.querySelector('form'))", 'Contact form missing');
    const fillForm = `(() => {
      const values = { name: 'Browser Test', email: 'browser-test@example.com', subject: 'Network portfolio test', message: 'This is a mocked browser test; no message will be sent.' };
      for (const [name, value] of Object.entries(values)) {
        const input = document.querySelector('[name="' + name + '"]');
        if (!input) continue;
        const proto = input.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(proto, 'value').set.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      return true;
    })()`;
    await client.evaluate(fillForm);
    await client.evaluate("document.querySelector('form').requestSubmit()");
    await client.until("Boolean(document.querySelector('[role=alert], .alert-error'))", 'Contact error feedback missing');
    assert(intercepted === 1, 'Contact failure was not intercepted');
    assert(await client.evaluate("document.querySelector('[name=message]').value.length > 0"), 'Contact failure erased message');
    report.checks.push('Contact failure feedback preserves message (mocked; no submission sent)');
    contactStatus = 200;
    await client.evaluate("document.querySelector('form').requestSubmit()");
    await client.until("Boolean(document.querySelector('[role=status], .alert-success'))", 'Contact success feedback missing');
    assert(intercepted === 2, 'Contact success was not intercepted');
    report.checks.push('Contact success feedback appears (mocked; no submission sent)');
    await client.send('Fetch.disable');
  }

  if (options.motion) {
    await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    await client.send('Page.navigate', { url: `${origin}/` });
    await client.until("Boolean(document.querySelector('.motion-control')) && document.documentElement.dataset.motion === 'playing'", 'Home animations did not start');
    const firstTransform = await client.evaluate("getComputedStyle(document.querySelector('.label-network')).transform");
    await sleep(600);
    const secondTransform = await client.evaluate("getComputedStyle(document.querySelector('.label-network')).transform");
    assert(firstTransform !== secondTransform, 'Floating network label did not animate');
    await client.evaluate("document.querySelector('.motion-control').click()");
    await client.until("document.documentElement.dataset.motion === 'paused' && getComputedStyle(document.querySelector('.label-network')).animationName === 'none'", 'Animation pause did not work');
    await client.evaluate("document.querySelector('.motion-control').click()");
    await client.until("document.documentElement.dataset.motion === 'playing' && getComputedStyle(document.querySelector('.label-network')).animationName === 'float-label'", 'Animation resume did not work');
    await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await client.until("document.querySelector('.motion-control').disabled && getComputedStyle(document.querySelector('.label-network')).animationName === 'none'", 'Reduced-motion preference was not respected');
    report.checks.push('Portrait labels animate; pause/resume and reduced-motion preference work');
  }

  assert(report.runtimeErrors.length === 0, `Browser runtime errors: ${report.runtimeErrors.join('\n')}`);
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ pagesChecked: report.pages.length, interactionsPassed: report.checks.length, runtimeErrors: report.runtimeErrors.length, report: path.join(output, 'report.json') }, null, 2));
} catch (error) {
  report.failure = error.message;
  await mkdir(output, { recursive: true });
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.error(error.message);
  process.exitCode = 1;
} finally {
  client?.socket.close();
}
