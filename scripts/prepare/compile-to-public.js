const esbuild = require('esbuild');
const path = require('path');

// Function to compile and bundle TypeScript to JavaScript using esbuild
async function compileTypeScript(sourceFilePath, outputFilePath, comment) {
  await esbuild.build({
    entryPoints: [sourceFilePath],
    outfile: outputFilePath,
    bundle: true,
    platform: 'browser',
    target: ['es6'],
    format: 'iife', // Immediately Invoked Function Expression format suitable for browsers
    minify: true, // Optional: Minify the output
    banner: { js: `\n// ${comment}\n` }, // Add the comment at the top of the output file
  });
}

// Paths to the input TypeScript file and output JavaScript file
const rootPath = path.resolve(__dirname, '../../');
const inputTSFileRelativePath = 'src/lib/verify.ts';
const outputJSFileRelativePath = 'public/js/modules/verify.js';
const inputTSFilePath = path.join(rootPath, inputTSFileRelativePath);
const outputJSFilePath = path.join(rootPath, outputJSFileRelativePath);

// The comment to add to the top of the output file
const comment = `This file is auto-generated from the "${inputTSFileRelativePath}"`;

try {
  // Compile and bundle the TypeScript file with the comment
  compileTypeScript(inputTSFilePath, outputJSFilePath, comment);
  console.log(`[SUCCESS] Compiled and bundled ${inputTSFileRelativePath} to ${outputJSFileRelativePath}`);

} catch (error) {
  console.error('[ERROR] Error during compile-to-public:', error);
}
