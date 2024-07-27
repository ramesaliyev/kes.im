import fs from 'fs';
import path from 'path';
import toml from 'toml';

import {rootPath, getEnv} from '../../utils.js';

const wranglerTOMLFilePath = path.join(rootPath, 'packages/worker/wrangler.toml');
const outputENVFileRelativePath = 'packages/site/.env';
const outputENVFilePath = path.join(rootPath, outputENVFileRelativePath);

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
      return `VITE_${key} = ${JSON.stringify(value)};`;
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

  } catch (err) {
    console.error('Error while parsing the wrangler.toml', err);
  }
}
