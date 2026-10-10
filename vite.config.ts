import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  // ANALYZE=1 pnpm build emits source maps for bundle inspection.
  build: { sourcemap: process.env.ANALYZE ? true : false },
  plugins: [
    devtools(),
    nitro(),
    tailwindcss(),
    tanstackStart({
      router: {
        // Load each route's loader with its component: keeps admin loaders
        // (and their schemas) out of the public bundle without an extra request.
        codeSplittingOptions: {
          defaultBehavior: [['loader', 'component'], ['pendingComponent'], ['errorComponent'], ['notFoundComponent']],
        },
      },
    }),
    viteReact(),
  ],
})

export default config
