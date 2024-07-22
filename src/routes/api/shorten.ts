import {AppErrorCode} from '../../app/error';
import AppRoute from '../../app/route';

export default class APIShortenRoute extends AppRoute {
  async serve() {
    const {req, res, err, model} = this.app;
    const {url, slug} = await req.getBody();

    // Check if URL is provided.
    if (!url) {
      return res.error(err.code.BAD_REQ);
    }

    // Create the link.
    try {
      const createdSlug = await model.createLinkEntry(url, slug);
      
      return res.json({slug: createdSlug});
    } catch (errCode) {
      return res.error(errCode as AppErrorCode);
    }
  }
}
