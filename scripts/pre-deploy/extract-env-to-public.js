const fs = require('fs');
const path = require('path');
const toml = require('toml');

const rootPath = path.resolve(__dirname, '../../');
const wranglerTOMLFilePath = path.join(rootPath, 'wrangler.toml');
const outputJSFileRelativePath = 'public/js/modules/env.js';
const outputJSFilePath = path.join(rootPath, outputJSFileRelativePath);

// Read the TOML file
fs.readFile(wranglerTOMLFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error while reading the wrangler.toml:', err);
    return;
  }

  try {
    // Parse the TOML file
    const config = toml.parse(data);

    // Extract the vars section.
    const vars = config.env[process.env.WORKER_ENV].vars;

    // Convert vars to a JS file content
    const jsContent = `export const ENV = ${JSON.stringify(vars, null, 2)};\n`;

    // Create final content
    const comment = 'This file is auto-generated from the "wrangler.toml" vars.';
    const fileContent = `\n// ${comment}\n\n${jsContent}`;

    // Write the JS content to the file
    fs.writeFile(outputJSFilePath, fileContent, (err) => {
      if (err) {
        console.error('Error writing the env.js file:', err);
        return;
      }

      console.log(`[SUCCESS] ${outputJSFileRelativePath} file generated from wrangler.toml vars.`);
    });
  } catch (err) {
    console.error('Error while parsing the wrangler.toml', err);
  }
});
