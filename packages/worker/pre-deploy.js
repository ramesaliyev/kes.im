import path from 'path';
import url from 'url';
import {execSync} from 'child_process';

import {createExec, logGreen, getEnv} from '../../tools/utils.js';

const {WORKER_ENV, DO_INSTALL, DO_BUILD} = getEnv();

const cwd = path.dirname(url.fileURLToPath(import.meta.url));;
const exec = createExec(cwd);

// Start.
logGreen('\n📦 {Worker} Pre-deploy\n');

// Install dependencies.
DO_INSTALL && exec('npm ci');

// Create cf types.
exec(`npx wrangler types --env ${WORKER_ENV}`);

// Do TypeScript type-checking.
exec('npx tsc --noEmit');

// Run tests.
exec('npm test run');

// Do dry-deploy to check if everything is fine.
DO_BUILD && exec(`npx wrangler deploy --env ${WORKER_ENV} --dry-run --outdir dist`);

// Done.
logGreen('\n📦 {Worker} Pre-deploy script completed.\n');
