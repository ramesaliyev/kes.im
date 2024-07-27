import {defineConfig, configDefaults} from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      include: [
        'packages/site/**/*.{ts,tsx}',
        'packages/common/**/*.{ts,tsx}',
      ]
    },
  },
})
