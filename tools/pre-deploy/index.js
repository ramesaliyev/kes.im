import fs from 'fs';
import path from 'path';
import {exec, execSync} from 'child_process';

import {rootPath, logYellow, logGreen, yellow, green, red} from '../utils.js';

// Path to the packages directory
const packagesDir = path.resolve(rootPath, 'packages');

logYellow('\n🚚 {ALL} Pre-Deploy\n');

// First run prepare
logGreen('\n🌈 Running prepare script...\n');
execSync('node tools/prepare', {cwd:rootPath, stdio: 'inherit'});
logGreen('\n🌈 Done preparing. \n');

// Now run pre-deploy in each package.

// Get all direct subfolders of the packages directory
const directories = fs.readdirSync(packagesDir).filter(file => {
  return fs.statSync(path.join(packagesDir, file)).isDirectory();
});

directories.forEach(dir => {
  const dirPath = path.join(packagesDir, dir);
  const relativePath = dirPath.replace(`${rootPath}/packages/`, '');

  console.log(`\n📦 ${yellow('Pre-Deploying:')} ${green(relativePath)}\n`);

  try {
    execSync('node pre-deploy.js', {cwd: dirPath, stdio: 'inherit'});

    console.log(`\n📦 ${yellow('Done Pre-Deploying:')} ${green(relativePath)}\n`);

  } catch (error) {
    console.log(`\n📦 ${red('Error on Pre-Deploying:')} ${green(relativePath)}\n`);
    throw error;
  }
});

// Done.
logYellow('\n🚚 {ALL} Pre-Deploy script completed.\n');
