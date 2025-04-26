import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    nodePolyfills({
      // Exclude polyfills you don't need
      exclude: ['fs'],
      // Include the polyfills you need
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  define: {
    'process.env': {},
    'global': {},
  },
})
