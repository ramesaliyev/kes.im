const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-js');

/**
 * Helpers
 */

// Function to read a text file and return an array of lines.
function readLines(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split('\n').map(line => line.trim()).filter(line => line);
}

// Function to read a file.
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

// Function to minify JavaScript content using UglifyJS
function minifyJS(content) {
  const result = UglifyJS.minify(content, {
    output: {
      comments: false
    }
  });
  if (result.error) {
    throw result.error;
  }
  return result.code;
}

// Function to write the minified content to a new file with a comment.
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Main script
 */

const rootPath = path.resolve(__dirname, '../../..');
const template = readFile(path.resolve(__dirname, 'banned.ts.template'));
const listFilesRelativePath = 'assets/banneds';
const listFilesDir = path.resolve(rootPath, listFilesRelativePath);

const contentMap = [
  {
    name: 'hostnames',
    placeholder: '__HOSTNAMES__'
  },
  {
    name: 'slugs',
    placeholder: '__SLUGS__'
  },
  {
    name: 'url_keywords',
    placeholder: '__URL_KEYWORDS__'
  }
];

// Create content by replacing placeholders with actual data.
const content = contentMap.reduce((out, {name, placeholder}) => {
  // Findout the file path.
  const filePath = path.join(listFilesDir, name);
  // Read the file content.
  const content = readLines(filePath).map(item => `"${item}"`).join(', ');
  // Replace the placeholder with the content.
  return out.replace(placeholder, content);
}, template);

// Minify and write the JavaScript content
try {
  // Minify the content.
  const minifiedContent = minifyJS(content);

  // Combine with comment.
  const comment = `This file is auto-generated from the files under "${listFilesRelativePath}"`; 
  const fileContents = `\n// ${comment}\n\n${minifiedContent}`;

  // Write the file.
  const outputRelativePath = 'src/lib/banned.ts';
  writeFile(path.resolve(rootPath, outputRelativePath), fileContents);

  console.log(`[SUCCESS] banned.ts file is generated and saved to ${outputRelativePath}.`);
} catch (error) {
  console.error('[ERROR] Error during generate-banned:', error);
}
