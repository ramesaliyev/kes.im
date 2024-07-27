import {resolve} from 'path'
import {loadTsConfig} from "load-tsconfig"
import {defineConfig} from 'vite';
import checker from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'
import EnvironmentPlugin from 'vite-plugin-environment'

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

// vite.config
export default defineConfig({
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
      input: [
        'index.html',
        '404.html',
        '500.html',
      ].map((file) => resolve(root, file)),
      external: [
        'dist',
      ],
      output: {
        entryFileNames: `assets/[name].hashed.[hash].js`,
        chunkFileNames: `assets/[name].hashed.[hash].js`,
        assetFileNames: `assets/[name].hashed.[hash].[ext]`
      }
    },
  },

  resolve: {
    alias: generateResolveAlias(),
  },

  plugins: [
    EnvironmentPlugin('all', {
      prefix: 'APP_'
    }, {
      defineOn: 'import.meta.env',
    }),
    tsconfigPaths(),
    checker({
      typescript: true,
    }),
  ],
});


// vite.config.js
// import { defineConfig } from 'vite'

// export default defineConfig({
//   esbuild: {
//     jsxFactory: 'h',
//     jsxFragment: 'Fragment',
//   },
// })

// https://vitejs.dev/config/shared-options.html#esbuild
// https://stackoverflow.com/questions/41557309/typescript-jsx-without-react
