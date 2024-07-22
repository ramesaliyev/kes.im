import App from './app';

const CODES = {
  UNKNOWN: Symbol('UNKNOWN'),
  NOT_FOUND: Symbol('NOT_FOUND'),
  BAD_REQ: Symbol('BAD_REQ'),
  BAD_URL: Symbol('BAD_URL'),
  BAD_SLUG: Symbol('BAD_SLUG'),
  BAD_CAPTCHA: Symbol('BAD_CAPTCHA'),
  SLUG_NA: Symbol('SLUG_NA'),
  NO_RECURSIVE: Symbol('NO_RECURSIVE'),
  LIMIT_EXCEEDED: Symbol('LIMIT_EXCEEDED'),
  BAD_HOSTNAME: Symbol('BAD_HOSTNAME'),
} as const;

export type AppErrorCode = typeof CODES[keyof typeof CODES];

export interface AppErrorPayload {
  code: string;
  message: string;
  status: number;
}

const PAYLOAD: Record<AppErrorCode, AppErrorPayload> = {
  [CODES.UNKNOWN]: {code: 'UNKNOWN', message: 'Unknown internal error occurred, save yourselves!', status: 500},
  [CODES.NOT_FOUND]: {code: 'NOT_FOUND', message: 'Not found. Like your girlfriend.', status: 404},
  [CODES.BAD_REQ]: {code: 'BAD_REQ', message: 'Bad Request. Just bad.', status: 400},
  [CODES.BAD_URL]: {code: 'BAD_URL', message: 'Provided URL is not a valid one.', status: 400},
  [CODES.BAD_SLUG]: {code: 'BAD_SLUG', message: 'Slug is not in correct format.', status: 400},
  [CODES.BAD_CAPTCHA]: {code: 'BAD_CAPTCHA', message: 'Captcha/Security check is not passed.', status: 400},
  [CODES.SLUG_NA]: {code: 'SLUG_NA', message: 'Slug already in use.', status: 400},
  [CODES.LIMIT_EXCEEDED]: {code: 'LIMIT_EXCEEDED', message: 'Maximum request limit for a minute is exceeded.', status: 429},
  [CODES.BAD_HOSTNAME]: {code: 'BAD_HOSTNAME', message: 'Provided hostname is not allowed to be shortened.', status: 400},
};

export default class AppErrors {
  app: App;
  code = CODES;
  payload = PAYLOAD;

  constructor(app:App) {
    this.app = app;
  }

  get(code: AppErrorCode): AppErrorPayload {
    return this.payload[code];
  }
}
