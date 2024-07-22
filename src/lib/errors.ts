export const AppErrorCodesMap = {
  UNKNOWN: Symbol('UNKNOWN'),
  NOT_FOUND: Symbol('NOT_FOUND'),
  BAD_REQ: Symbol('BAD_REQ'),
  BAD_URL: Symbol('BAD_URL'),
  BAD_SLUG: Symbol('BAD_SLUG'),
  BAD_CAPTCHA: Symbol('BAD_CAPTCHA'),
  SLUG_NA: Symbol('SLUG_NA'),
  NO_RECURSIVE: Symbol('NO_RECURSIVE'),
  LIMIT_EXCEEDED: Symbol('LIMIT_EXCEEDED'),
} as const;

export type AppErrorCode = typeof AppErrorCodesMap[keyof typeof AppErrorCodesMap];

export interface AppErrorPayload {
  code: string;
  message: string;
  status: number;
}

export const AppErrorPayloadsMap: Record<AppErrorCode, AppErrorPayload> = {
  [AppErrorCodesMap.UNKNOWN]: {code: 'UNKNOWN', message: 'Unknown internal error occurred, save yourselves!', status: 500},
  [AppErrorCodesMap.NOT_FOUND]: {code: 'NOT_FOUND', message: 'Not found. Like your girlfriend.', status: 404},
  [AppErrorCodesMap.BAD_REQ]: {code: 'BAD_REQ', message: 'Bad Request. Just bad.', status: 400},
  [AppErrorCodesMap.BAD_URL]: {code: 'BAD_URL', message: 'Provided URL is either not valid or not allowed.', status: 400},
  [AppErrorCodesMap.BAD_SLUG]: {code: 'BAD_SLUG', message: 'Slug is not in correct format.', status: 400},
  [AppErrorCodesMap.BAD_CAPTCHA]: {code: 'BAD_CAPTCHA', message: 'Captcha/Security check is not passed.', status: 400},
  [AppErrorCodesMap.SLUG_NA]: {code: 'SLUG_NA', message: 'Slug already in use.', status: 400},
  [AppErrorCodesMap.LIMIT_EXCEEDED]: {code: 'LIMIT_EXCEEDED', message: 'Maximum request limit for a minute is exceeded.', status: 429},
};
