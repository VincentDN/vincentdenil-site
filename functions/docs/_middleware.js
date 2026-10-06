/**
 * /docs/ password gate
 * ---------------------------------------------------------------------------
 * Cloudflare Pages middleware scoped to /docs and everything under it. Nothing
 * below /docs/ is served until the password is accepted.
 *
 * The password is NOT in this repo. It is read from the PASSWORD_LOCK
 * environment variable on the Cloudflare Pages project (Settings ->
 * Environment variables, type Secret, Production and Preview). Local dev: copy
 * .dev.vars.example to .dev.vars (gitignored) and run `npx wrangler pages dev .`
 *
 * Session: on success we set an HttpOnly, Secure, SameSite=Lax cookie (Path
 * /docs) holding an expiry timestamp plus an HMAC-SHA256 signature keyed on
 * PASSWORD_LOCK. Nothing derived from the password is recoverable from the
 * cookie, and changing PASSWORD_LOCK invalidates every session immediately.
 *
 * Fails closed: if PASSWORD_LOCK is unset, /docs/ returns 500 instead of
 * falling through to the content.
 *
 * Adapted from the archived gate in docs/partisan-ai/_inert-cloudflare-gate/.
 */

const COOKIE = 'docs_session';
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

const enc = new TextEncoder();

async function hmac(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Length-independent constant-time comparison. */
async function safeEqual(a, b) {
  const salt = crypto.randomUUID();
  return (await hmac(salt, a)) === (await hmac(salt, b));
}

async function issueCookie(secret) {
  const exp = Date.now() + MAX_AGE * 1000;
  const sig = await hmac(secret, String(exp));
  return `${COOKIE}=${exp}.${sig}; Path=/docs; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`;
}

async function cookieValid(request, secret) {
  const raw = request.headers.get('Cookie') || '';
  const hit = raw.split(/;\s*/).find(c => c.startsWith(`${COOKIE}=`));
  if (!hit) return false;
  const [exp, sig] = hit.slice(COOKIE.length + 1).split('.');
  if (!exp || !sig) return false;
  if (!Number(exp) || Number(exp) < Date.now()) return false;
  return await safeEqual(sig, await hmac(secret, exp));
}

function loginPage(error) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
<title>/docs/ | Atelier Vincent De Nil</title>
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#101418;--panel:#171d23;--ink:#e8ecef;--dim:#8d99a3;--accent:#6fb3d9;--err:#e08a8a;
  --sans:'Figtree',system-ui,sans-serif;--mono:'JetBrains Mono',ui-monospace,monospace}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:grid;place-items:center;padding:1.5rem;background:var(--bg);color:var(--ink);font-family:var(--sans)}
main{width:100%;max-width:24rem}
h1{font-family:var(--mono);font-weight:700;font-size:1.1rem;margin:0 0 .3rem}
p.sub{color:var(--dim);font-size:.9rem;margin:0 0 1.5rem}
label{display:block;font-size:.8rem;color:var(--dim);margin-bottom:.4rem}
input{width:100%;padding:.8rem .9rem;border:1px solid #2c363f;background:var(--panel);color:var(--ink);font:400 1rem var(--mono);border-radius:4px}
button{width:100%;margin-top:.8rem;padding:.8rem;border:0;border-radius:4px;background:var(--accent);color:#08141c;font:700 .95rem var(--sans);cursor:pointer}
input:focus-visible,button:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.err{margin:0 0 1rem;padding:.7rem .9rem;border-left:4px solid var(--err);background:rgba(224,138,138,.1);color:var(--err);font-size:.9rem}
</style>
</head>
<body>
<main>
  <h1>/docs/</h1>
  <p class="sub">Password required.</p>
  ${error ? `<p class="err">${error}</p>` : ''}
  <form method="POST" autocomplete="off">
    <label for="pw">Password</label>
    <input id="pw" name="password" type="password" required autofocus autocapitalize="off" autocorrect="off" spellcheck="false">
    <button type="submit">Unlock</button>
  </form>
</main>
</body>
</html>`;
}

const NO_STORE = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
  'Referrer-Policy': 'no-referrer',
};

export async function onRequest(context) {
  const { request, env, next } = context;
  const secret = env.PASSWORD_LOCK;

  if (!secret) {
    return new Response(
      'PASSWORD_LOCK is not configured on this Pages project. Refusing to serve /docs/.',
      { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } }
    );
  }

  // Already signed in.
  if (await cookieValid(request, secret)) {
    const res = await next();
    // Gated content must never be stored by shared caches.
    const out = new Response(res.body, res);
    out.headers.set('Cache-Control', 'private, no-store');
    return out;
  }

  // Submitting the password.
  if (request.method === 'POST') {
    let supplied = '';
    try {
      const form = await request.formData();
      supplied = String(form.get('password') ?? '');
    } catch { /* malformed body, treat as a failed attempt */ }

    if (supplied && await safeEqual(supplied, secret)) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: new URL(request.url).pathname,
          'Set-Cookie': await issueCookie(secret),
          'Cache-Control': 'no-store',
        },
      });
    }

    // Blunt the obvious online guessing loop without locking anyone out.
    await new Promise(r => setTimeout(r, 900));
    return new Response(loginPage('Wrong password.'), { status: 401, headers: NO_STORE });
  }

  return new Response(loginPage(null), { status: 401, headers: NO_STORE });
}
