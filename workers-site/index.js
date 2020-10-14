
import serveAPI from './src/api';
import serveSite from './src/site';

addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.hostname === 'api.kes.im') {
    return serveAPI(event);
  }

  serveSite(event);
});