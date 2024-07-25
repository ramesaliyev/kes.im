// Check required ENV variables.
if (!process.env.WORKER_ENV) {
  console.error('[ERROR]: Please provide WORKER_ENV environment variable.');
  process.exit(1);
}

// Check required ENV variables.
if (!process.env.RUN) {
  console.error('[ERROR]: Please provide RUN environment variable.');
  process.exit(1);
}

// Generate src/gen/banned.ts file.
require('./generate-banned');

// Generate src/gen/build.ts file.
require('./generate-build-meta');

// Compile some .ts files to .js and save them in the public/js/modules
require('./compile-to-public');

// Extract ENV variables from wrangler.toml and save them in public/js/modules/env.js
require('./extract-env-to-public');
