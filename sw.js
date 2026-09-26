/* Service worker — makes every normal page load pick up the latest deploy, so
   nobody ever needs a hard refresh.

   Two caches can serve stale code:
   1. The HTTP cache. GitHub Pages lets browsers reuse files for up to 10
      minutes without asking. Every same-origin GET here goes to the network
      with `cache: "no-cache"`, which revalidates with the server each time
      (a cheap 304 when nothing changed).
   2. The browser's in-tab memory cache, which reuses a script on reload
      whenever its URL is unchanged — so a deploy that forgot to bump ?v would
      still run old code. When serving the page, this worker tags each
      .js/.css URL with a per-load `swv` value, so every load asks for them;
      the tag is stripped again before the network request, so the HTTP cache
      and the server see the clean URL.

   The copy kept in Cache Storage is only used when the network is
   unreachable, so the form still opens offline. The page registers this file
   with updateViaCache: "none", so the browser re-checks the worker itself on
   every load. The cache name is namespaced rh-interview-* because Cache
   Storage is shared per origin with the sibling apps on davshe06.github.io. */

const CACHE = "rh-interview-offline-v1";
const TAG = "swv";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    /* drop older offline caches of this app only — never a sibling's */
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith("rh-interview-offline-") && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(respond(req));
});

async function respond(req) {
  const url = new URL(req.url);
  url.searchParams.delete(TAG);
  const clean = url.toString();
  const cache = await caches.open(CACHE);

  let res;
  try {
    /* fetch by URL: a navigation request can't be re-issued with new options */
    res = await fetch(clean, { cache: "no-cache", credentials: "same-origin" });
    if (res.ok && res.type === "basic") await cache.put(clean, res.clone());
  } catch (err) {
    res = await cache.match(clean);
    if (!res) throw err;
  }

  if (req.mode === "navigate" && (res.headers.get("content-type") || "").includes("text/html")) {
    const stamp = Date.now().toString(36);
    const html = (await res.text()).replace(/(\.(?:js|css)\?v=[^"'\s>]*)/g, "$1&" + TAG + "=" + stamp);
    const headers = new Headers(res.headers);
    headers.delete("content-length");
    return new Response(html, { status: res.status, statusText: res.statusText, headers });
  }
  return res;
}
