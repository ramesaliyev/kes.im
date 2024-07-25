// Init
console.log('[PRE-DEPLOY] Running pre-deploy script...');

// Required envVars
const envVars = ['WORKER_ENV', 'RUN'];

// Check required ENV variables.
envVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`[ERROR]: Please provide ${envVar} environment variable.`);
    process.exit(1);
  }

  console.log(`[INFO]: ${envVar} = ${process.env[envVar]}`);
});

// Generate src/gen/banned.ts file.
require('./generate-banned');

// Generate src/gen/build.ts file.
require('./generate-build-meta');

// Compile some .ts files to .js and save them in the public/js/modules
require('./compile-to-public');

// Extract ENV variables from wrangler.toml and save them in public/js/modules/env.js
require('./extract-env-to-public');

// Done.
console.log('[PRE-DEPLOY]  Pre-deploy script completed.');
