import {getAssetFromKV} from '@cloudflare/kv-asset-handler';

export default event => {
  try {
    event.respondWith(handleStaticRequest(event));
  } catch (e) {
    event.respondWith(new Response('Internal Error', {status: 500}));
  }
};

async function handleStaticRequest(event) {
  let options = {}

  try {
    const page = await getAssetFromKV(event, options);

    // allow headers to be altered
    const response = new Response(page.body, page);

    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'unsafe-url');
    response.headers.set('Feature-Policy', 'none');

    return response;
  } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
    try {
      return serve404(event);
    } catch (e) {}

    return new Response(e.message || e.toString(), {status: 500})
  }
}

export async function serve404(event) {
  const notFoundResponse = await getAssetFromKV(event, {
    mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/404.html`, req),
  });

  return new Response(notFoundResponse.body, {
    ...notFoundResponse, status: 404
  });
}