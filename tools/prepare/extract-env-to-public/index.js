import fs from 'fs';
import path from 'path';
import toml from 'toml';

import {rootPath, getEnv, exec} from '../../utils.js';

const packagesPath = path.join(rootPath, 'packages');
const workerPath = path.join(packagesPath, 'worker');
const sitePath = path.join(packagesPath, 'site');

const wranglerTOMLFilePath = path.join(workerPath, 'wrangler.toml');
const outputENVFilePath = path.join(sitePath, '.env');
const outputENVFileRelativePath = outputENVFilePath.replace(rootPath, '');

export default function extractEnvToPublic() {
  let data;

  try {
    data = fs.readFileSync(wranglerTOMLFilePath, 'utf8');
  } catch (err) {
    console.error('Error while reading the wrangler.toml:', err);
    return;
  }

  const {WORKER_ENV} = getEnv();

  try {
    // Parse the TOML file
    const config = toml.parse(data);

    // Extract the vars section.
    const vars = config.env[WORKER_ENV].vars;

    // Convert vars to a JS file content
    const envContent = Object.entries(vars).map(([key, value]) => {
      return `APP_${key} = ${JSON.stringify(value)}`;
    }).join('\n');

    // Create final content
    const comment = `This file is auto-generated from the wrangler.toml.env.[${WORKER_ENV}].vars.`;
    const fileContent = `\n# ${comment}\n\n${envContent}`;

    // Write the JS content to the file
    try {
      fs.writeFileSync(outputENVFilePath, fileContent);
      console.log(`[SUCCESS] ${outputENVFileRelativePath} file generated from wrangler.toml.env.[${WORKER_ENV}].vars.`);
    } catch (err) {
      console.error('Error writing the env.js file:', err);
    }

    /**
     * Also copy worker-configuration.d.ts to packages/site
     */
    // First make sure the file exists.
    exec(`npx wrangler types --env ${WORKER_ENV}`, workerPath, true);
    // Then copy it.
    const workerConfigDTSFilename = 'worker-configuration.d.ts';
    const workerConfigDTS = path.join(workerPath, workerConfigDTSFilename);
    const siteConfigDTS = path.join(sitePath, workerConfigDTSFilename);
    fs.copyFileSync(workerConfigDTS, siteConfigDTS);

  } catch (err) {
    console.error('Error while parsing the wrangler.toml', err);
  }
}
