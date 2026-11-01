/**
 * /outbound/ is a delivery folder for the owner (narrated MP3s and other
 * hand-offs), downloaded from the repository, not from the website.
 * Cloudflare Pages uploads the whole repo, so this function keeps everything
 * under /outbound/ off the live site with a plain 404.
 */
export function onRequest() {
  return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex' } });
}
