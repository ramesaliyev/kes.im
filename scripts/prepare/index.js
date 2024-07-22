// Generate banned.ts/js files.
require('./generate-banned');

// Compile some .ts files to .js and save them in the public/js/modules
require('./compile-to-public');

// Extract ENV variables from wrangler.toml and save them in public/js/modules/env.js
require('./extract-env-to-public');
