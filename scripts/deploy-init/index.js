// Generate deploy-init.json
const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

// Check required ENV variables.
if (!process.env.RUN) {
  console.error('[ERROR]: Please provide RUN environment variable.');
  process.exit(1);
}

// Get paths.
const rootPath = path.resolve(__dirname, '../..');
const outputRelativePath = 'deploy-init.json';
const outputPath = path.resolve(rootPath, outputRelativePath);

// Count commits.
const build = execSync('git rev-list --count HEAD').toString().trim();

// Generate deploy-init.json
const deployInit = {
  build,
  run: process.env.RUN,
};

// Write deploy-init.json to file.
fs.writeFileSync(outputPath, JSON.stringify(deployInit, null, 2));

