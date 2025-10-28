import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': { // Requests starting with /api will be proxied
          target: env.VITE_API_URL, // Replace with your backend API URL
          changeOrigin: true, // Rewrites the Host header to the target URL
          secure: false, // Set to true if your backend uses a valid SSL certificate
        },
      },
    }
  })
}
