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
    format: 'esm', // ES module format
    minify: true, // Optional: Minify the output
    banner: { js: `\n// ${comment}\n` }, // Add the comment at the top of the output file
  });
}

const rootPath = path.resolve(__dirname, '../../');

const filesToCompile = [
  {
    inputTSFileRelativePath: 'src/lib/verify.ts',
    outputJSFileRelativePath: 'public/js/modules/verify.js',
  },
  {
    inputTSFileRelativePath: 'src/lib/errors.ts',
    outputJSFileRelativePath: 'public/js/modules/errors.js',
  },
  {
    inputTSFileRelativePath: 'src/gen/build.ts',
    outputJSFileRelativePath: 'public/js/modules/build.js',
  },
];

filesToCompile.forEach(({inputTSFileRelativePath, outputJSFileRelativePath}) => {
  const inputTSFilePath = path.join(rootPath, inputTSFileRelativePath);
  const outputJSFilePath = path.join(rootPath, outputJSFileRelativePath);
  const comment = `This file is auto-generated from the "${inputTSFileRelativePath}"`;

  try {
    compileTypeScript(inputTSFilePath, outputJSFilePath, comment);
    console.log(`[SUCCESS] Compiled and bundled ${inputTSFileRelativePath} to ${outputJSFileRelativePath}`);
  } catch (error) {
    console.error(`[ERROR] Error during compile-to-public of ${inputTSFileRelativePath}:`, error);
  }
});
