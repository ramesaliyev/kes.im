
import serveAPI, {slugRegex} from './src/api';
import serveSite from './src/site';
import redirect from './src/redirect';

addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.hostname === 'api.kes.im') {
    return serveAPI(event);
  }

  if (slugRegex.test(url.pathname.substr(1))) {
    return redirect(event);
  }

  serveSite(event);
});