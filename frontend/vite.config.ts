import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  plugins: [
    // TanStack Start — SSR, server functions, and file-based routing (includes
    // TanStackRouterVite internally; do NOT add it separately or TSRSplitComponent
    // will be injected without the matching runtime that Start provides).
    tanstackStart({
      server: { entry: "server" },
    }),

    // React fast-refresh + JSX transform
    react(),

    // Tailwind CSS v4 Vite plugin
    tailwindcss(),
  ],

  resolve: {
    // Native tsconfig path resolution — replaces the vite-tsconfig-paths plugin
    tsconfigPaths: true,

    // Deduplicate React so only a single copy is bundled
    dedupe: ["react", "react-dom"],
  },
});
