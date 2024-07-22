import AppRoute from '../../app/route';
import AppRouter from '../../app/router';

import RevealRoute from './reveal';
import ShortenRoute from './shorten';
import DefaultRoute from './default';

type TurnstileChallengeResponse = {
  success: boolean;
  'error-codes': string[];
  challenge_ts: string;
  hostname: string;
};

export default class APIRoute extends AppRoute {
  /**
   * Checks if the rate limit has been reached.
   */
  async isRateLimitReached() {
    const {req} = this.app;
    const limiter = this.app.limiter.api;

    const key = `${req.getPathname()}_${req.getUserIP()}`;
    const {success} = await limiter.limit({key});

    return !success;
  }

  /**
   * Validates the Turnstile token.
   */
  async validateTurnstileToken(token:string) {
    if (!token) {
      return false;
    }

    const {env, req} = this.app;

    // Prepare the request body.
    const verificationURL = env.CF_TURNSTILE_VERIFY_URL;
    const body = {
      secret: env.TURNSTILE_SECRET,
      remoteip: req.getUserIP(),
      response: token,
    };

    // Send the request.
    const result = await fetch(verificationURL, {
      body: JSON.stringify(body),
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
    })
    
    const {hostname, success} = await result.json() as TurnstileChallengeResponse;

    // Check the response.
    if (hostname !== env.CFG_SITE_HOSTNAME) {
      return false;
    }

    return success;
  }

  /**
   * Serve the API route.
   */
  async serve() {
    const {req, res, err} = this.app;

    // Check if the rate limit has been reached.
    if (await this.isRateLimitReached()) {
      return res.error(err.code.LIMIT_EXCEEDED);
    }

    // Handle OPTIONS (preflight) request.
    if (req.getMethod() === 'OPTIONS') {
      return res.ok();
    }

    // Handle POST requests.
    if (req.getMethod() === 'POST') {
      const body = await req.getBody();

      // A POST request must have a body. Anybody.
      if (!body) {
        return res.error(err.code.BAD_REQ);
      }

      // Validate the Turnstile token.
      if (!await this.validateTurnstileToken(body.token)) {
        return res.error(err.code.BAD_CAPTCHA);
      }

      // Create a router.
      const router = new AppRouter(this.app);

      // Define routes.
      router.onPathname('/reveal', RevealRoute);
      router.onPathname('/shorten', ShortenRoute);
      router.onDefault(DefaultRoute);

      // Resolve the route.
      return router.resolve();
    }

    // Handle GET requests.
    return new DefaultRoute(this.app).fetch();   
  }
}
