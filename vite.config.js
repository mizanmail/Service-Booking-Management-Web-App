import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 3000,
        open: true,
        headers: {
            'Cache-Control': 'no-store, max-age=0',
            'Content-Security-Policy': "frame-ancestors 'none';",
            'X-Content-Type-Options': 'nosniff',
            'X-XSS-Protection': '0'
        }
    },
    build: {
        outDir: 'dist',
    }
});
