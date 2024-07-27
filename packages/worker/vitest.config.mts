import {defineWorkersConfig} from "@cloudflare/vitest-pool-workers/config";
import tsconfigPaths from 'vite-tsconfig-paths'

//
// TODO: Update vitest.
// Waiting for the following PR to be merged:
// https://github.com/cloudflare/workers-sdk/pull/6232
// https://github.com/cloudflare/workers-sdk/issues/6215

export default defineWorkersConfig({
  plugins: [tsconfigPaths()],
  test: {
    poolOptions: {
      workers: {
        wrangler: {
          configPath: "./wrangler.toml"
        },
      },
    },
  },
});
