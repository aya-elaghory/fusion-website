import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Add this import for path resolution

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    host: "0.0.0.0", // Listen on all network interfaces
    port: 5173,      // Default Vite port
    strictPort: false, // Fallback to next available port if 5173 is busy
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Map '@' to 'src' directory
    },
  },
});