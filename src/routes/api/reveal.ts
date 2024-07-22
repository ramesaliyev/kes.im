import AppRoute from '../../app/route';

export default class APIRevealRoute extends AppRoute {
  async serve() {
    const {req, res, err, model} = this.app;
    const {slug} = await req.getBody();

    // Request body must contain a slug.
    if (!slug) {
      return res.error(err.code.BAD_REQ);
    }

    // Fetch the URL by the slug.
    const url = await model.fetchUrlBySlug(slug);
    if (!url) {
      return res.error(err.code.NOT_FOUND);
    }

    return res.json({url});
  }
}
