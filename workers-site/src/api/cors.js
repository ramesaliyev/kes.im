const CORS_DEFAULT_METHODS = 'GET, HEAD, POST, OPTIONS';
const CORS_DEFAULT_HEADERS = 'Content-Type';

const allowedOrigins = [
  'https://kes.im',
  'http://localhost:8080',
  'https://beta.kes.im',
];

export function getCORSHeaders(event) {
  const {headers} = event.request;
  const requestOrigin = headers.get('origin');
  const allowedOrigin = allowedOrigins.includes(requestOrigin) ?
    requestOrigin : allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': headers.get('Access-Control-Request-Method') || CORS_DEFAULT_METHODS,
    'Access-Control-Allow-Headers': headers.get('Access-Control-Request-Headers') || CORS_DEFAULT_HEADERS
  };
}