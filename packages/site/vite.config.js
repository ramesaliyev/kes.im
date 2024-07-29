import fs from 'fs';
import {resolve} from 'path'
import {loadTsConfig} from "load-tsconfig"
import {defineConfig, loadEnv} from 'vite';
import checker from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'
import pug from 'pug';

const root = resolve(__dirname);

/**
 * Year 2024 and I'm dealing with this shit.
 * This basically reads paths from tsconfig and
 * convert them into regex aliases with absolute
 * paths so rollup can understand.
 */
function generateResolveAlias() {
  const {data:tsconfig} = loadTsConfig(".");
  const {baseUrl, paths} = tsconfig.compilerOptions;

  const alias = Object.entries(paths)
    .map(([key, [value]]) => {
      return {
        find: new RegExp(`^${key.replace('*', '(.*)')}`),
        replacement: resolve(root, baseUrl, value.replace('*', '$1') + '.ts')
      };
    });
  return alias;
}

/**
 * Trick vite/rollup to behave with pug.
 * I just want to render some pug files for god's sake.
 */
// If true, rendered pug files won't be cached, so they'll re-render on each vite compilation.
const PUG_DEV = true;
// These fake HTML files are actually their corresponding Pug files.
const inputHTMLNames = [
  'index.html',
  '404.html',
  '500.html',
]
// Create fake html files
inputHTMLNames.forEach(filename => {
  fs.writeFileSync(resolve(root, filename), '');
});
// Cache compiled pug files.
const getCompiledPug = (() => {
  const cache = {};
  return (filename, env) => {
    if (PUG_DEV || !cache[filename]) {
      const pugFilename = filename.replace('.html', '.pug');
      const content = fs.readFileSync(pugFilename, 'utf-8');
      cache[filename] = pug.render(content, {
        filename: pugFilename,
        env,
      });
    }

    return cache[filename];
  };
})();
// Compile plugin
const compilePug = (env) => ({
  name: 'transform-html',
  transformIndexHtml: {
    order: 'pre',
    handler(content, {path, filename}) {
      return getCompiledPug(filename, env);
    }
  }
});

export default defineConfig(({command, mode}) => {
  /**
   * Define environment variables.
   * Parse appropriately for boolean and number values.
   */
  const rawEnv = loadEnv(mode, process.cwd(), 'APP_');
  const env = Object.fromEntries(
    Object.entries(rawEnv).map(([key, value]) => {
      switch (value) {
        case 'true':
          value = true;
          break;
        case 'false':
          value = false;
          break;
        default:
          if (!isNaN(value)) {
            value = Number(value);
          }
      }
      return [key.replace('APP_', ''), value];
    })
  );

  console.log(env)


  return {
    root: root,
    publicDir: 'public',

    server: {
      port: 5000,
      host: 'localhost',
    },

    preview: {
      port: 5000,
      host: 'localhost',
    },

    build: {
      outDir: 'dist',
      minify: true,
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      rollupOptions: {
        input: inputHTMLNames.map((file) => resolve(root, file)),
        external: [
          'dist',
        ],
        output: {
          entryFileNames: `assets/[name].hashed.[hash].js`,
          chunkFileNames: `assets/[name].hashed.[hash].js`,
          assetFileNames: `assets/[name].hashed.[hash].[ext]`,
        }
      },
    },

    resolve: {
      alias: generateResolveAlias(),
    },

    plugins: [
      tsconfigPaths(),
      checker({
        typescript: true,
      }),
      compilePug(env),
    ],

    define: {
      env,
    },
  }
});
