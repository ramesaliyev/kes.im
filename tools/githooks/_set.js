import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';

// Resolve paths.
const rootPath = execSync('git rev-parse --show-toplevel').toString().trim();
const hooksPath = path.resolve(rootPath, '.git', 'hooks');

// Create hook script on-fly.
function generateHookContent(command) {
  return `#!/usr/bin/env node
    import {execSync} from 'child_process';
    execSync('${command}', {stdio: 'inherit'});
  `;
}

// Helper function to write hook file.
function writeHookFile(hookName, command) {
  // Define the hook file path
  const hookFilePath = path.join(hooksPath, hookName);

  // Write the hook file
  fs.writeFileSync(hookFilePath, generateHookContent(command), {mode: 0o755});
}

// Create hooks.
writeHookFile('pre-commit', 'npm run gh-pre-commit');
writeHookFile('pre-push', 'npm run gh-pre-push');

// We're done.
console.log('Git hooks has been set up successfully.');
