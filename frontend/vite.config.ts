import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

// El build sale directo a deploy/tienda (la carpeta que se arrastra a Netlify Drop, sitio "losturquitos").
// emptyOutDir queda en false para no borrar admin.html, que vive en esa misma carpeta;
// el script "prebuild" de package.json solo limpia deploy/tienda/assets para no acumular bundles viejos.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: path.resolve(__dirname, '../prospeccion_condimentos_core/deploy/tienda'),
    emptyOutDir: false,
  },
});
