// Init
console.log('[PREPARE] Running pre-deploy script...');

// Generate packages/common/gen/banned.ts file.
import GenerateBanned from './generate-banned/index.js';

// Generate packages/common/gen/build.ts file.
import GenerateBuildMeta from './generate-build-meta/index.js';

// Extract ENV variables from wrangler.toml and save them in packages/site/.env
import ExtractEnvToPublic from './extract-env-to-public/index.js';

// Run the scripts.
GenerateBanned();
GenerateBuildMeta();
ExtractEnvToPublic();

// Done.
console.log('[PREPARE] Pre-deploy script completed.');
