import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {readFileSync} from 'fs';
import {execSync} from 'child_process';

import chalk from 'chalk';

// Get relative path.
export function getDirname(importMetaUrl) {
  return path.dirname(fileURLToPath(importMetaUrl));
}

// Figure out rootPath.
const dirname = getDirname(import.meta.url);
export const rootPath = path.resolve(dirname, '../');

// Get package.json.
export function loadPackageJson() {
  const packageJsonPath = path.join(rootPath, 'package.json');
  const data = readFileSync(packageJsonPath, 'utf-8');
  return JSON.parse(data);
}

// Export env vars with defaults.
export function getEnv() {
  return {
    WORKER_ENV: process.env.WORKER_ENV || 'prod',
    RUN: process.env.RUN || '0-0-0',
  };
}

// Chalk helpers.
export function logYellow(message) {
  console.log(chalk.yellow(message));
}

export function logGreen(message) {
  console.log(chalk.green(message));
}

export function green(message) {
  return chalk.green(message);
}

export function yellow(message) {
  return chalk.yellow(message);
}

export function red(message) {
  return chalk.red(message);
}

// Exec helper.
export function exec(cmd, cwd) {
  try {
    console.log(`\n🏃 ${green(cmd)}\n`);
    execSync(cmd, {cwd, stdio: 'inherit'});
  } catch (error) {
    console.log(`\n🏃 ${red(cmd)}\n`);
    throw error;
  }
}

export function createExec(cwd) {
  return (cmd) => exec(cmd, cwd);
}
