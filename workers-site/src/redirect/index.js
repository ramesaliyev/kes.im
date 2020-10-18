import {serve404} from '../site';

export default event => {
  return event.respondWith(redirect(event));
};

async function redirect(event) {
  const {pathname} = new URL(event.request.url);
  const slug = pathname.substr(1);
  const url = await kesim_data.get(slug);

  if (url) {
    return Response.redirect(url, 301);
  }

  return serve404(event);
};