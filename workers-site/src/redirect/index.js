import {serve404} from '../site';

export default event => {
  return event.respondWith(redirect(event));
};

async function redirect(event) {
  const cache = caches.default
  const {request} = event;

  // Try to retrieve from cache.
  const cached = await cache.match(request);
  if (cached) return cached;

  const {pathname} = new URL(request.url);
  const slug = pathname.substr(1);
  const url = await kesim_data.get(slug);

  if (url) {
    const redirres = Response.redirect(url, 301);
    const response = new Response(redirres.body, redirres);

    // Cache
    response.headers.append('Cache-Control', 'max-age=31536000');
    event.waitUntil(cache.put(request, response.clone()));

    return response;
  }

  return serve404(event);
};