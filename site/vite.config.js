import {resolve} from 'path'
import {defineConfig} from 'vite';
import checker from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'

const root = resolve(__dirname);

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
      output: {
        entryFileNames: `assets/[name].hashed.[hash].js`,
        chunkFileNames: `assets/[name].hashed.[hash].js`,
        assetFileNames: `assets/[name].hashed.[hash].[ext]`
      }
    },
  },

  plugins: [
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
