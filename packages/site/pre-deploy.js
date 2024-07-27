import path from 'path';
import url from 'url';
import {execSync} from 'child_process';

import {createExec, logGreen, getEnv} from '../../tools/utils.js';

const WORKER_ENV = getEnv().WORKER_ENV;

const cwd = path.dirname(url.fileURLToPath(import.meta.url));;
const exec = createExec(cwd);

// Start.
logGreen('\n📦 {Site} Pre-deploy\n');

// Install dependencies.
exec('npm ci');

// Do TypeScript type-checking.
exec('npx tsc --noEmit');

// Run tests.
exec('npm test run');

// Build.
exec(`rm -rf dist`);
exec(`npm run build`);

// Done.
logGreen('\n📦 {Site} Pre-deploy script completed.\n');
