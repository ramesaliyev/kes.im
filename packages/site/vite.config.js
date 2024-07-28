import {resolve} from 'path'
import {loadTsConfig} from "load-tsconfig"
import {defineConfig, loadEnv} from 'vite';
import checker from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'

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

export default defineConfig(({command, mode}) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const rawEnv = loadEnv(mode, process.cwd(), 'APP_');
  const env = Object.fromEntries(
    Object.entries(rawEnv).map(([key, value]) => {
      return [key.replace('APP_', ''), value];
    })
  );

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
      tsconfigPaths(),
      checker({
        typescript: true,
      }),
    ],

    define: {
      env,
    },
  }
})

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
