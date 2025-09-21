import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
<<<<<<< HEAD
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
=======
  plugins: [
    react(),
    svgr(),
  ],
});
>>>>>>> Teddy/Labonne
