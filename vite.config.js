import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// IMPORTANT: if you deploy to https://<username>.github.io/<repo-name>/
// set base to '/<repo-name>/' below. If you deploy to a custom domain
// or to <username>.github.io (root), set base to '/'.
export default defineConfig({
  plugins: [react()],
  base: '/hash-portfolio/',
});
