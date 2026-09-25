/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    // Enable compression in dev to better reflect real-world sizes
    headers: {
      "Cache-Control": "no-store",
    },
  },
  build: {
    // Re-enable modulePreload (was set to false, hurting LCP)
    modulePreload: true,
    // Use esbuild for fast, optimal minification
    minify: "esbuild",
    // Raise warning threshold (chunks are intentionally split)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split large vendor dependencies into separate cacheable chunks
        manualChunks(id: string): string | undefined {
          // React core — loaded first, smallest, most critical
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/scheduler/")) {
            return "vendor-react";
          }
          // React Router — route-related, loaded once
          if (id.includes("node_modules/react-router") || id.includes("node_modules/@remix-run/")) {
            return "vendor-router";
          }
          // Framer Motion — large animation library, only needed on some pages
          if (id.includes("node_modules/framer-motion/")) {
            return "vendor-framer-motion";
          }
          // Lucide icons — tree-shaken in prod, isolate for caching
          if (id.includes("node_modules/lucide-react/")) {
            return "vendor-lucide";
          }
          // TanStack (Query + Table) — data-fetching/table logic
          if (id.includes("node_modules/@tanstack/")) {
            return "vendor-query";
          }
          // Radix UI primitives
          if (id.includes("node_modules/@radix-ui/")) {
            return "vendor-radix";
          }
          // ECharts — very large charting library (~1.5MB), only used in dashboard pages
          if (id.includes("node_modules/echarts") || id.includes("node_modules/echarts-for-react") || id.includes("node_modules/zrender")) {
            return "vendor-echarts";
          }
          // Three.js + React Three Fiber/Drei — 3D scene, only used in hero
          if (id.includes("node_modules/three") || id.includes("node_modules/@react-three/") || id.includes("node_modules/troika-") || id.includes("node_modules/maath/")) {
            return "vendor-three";
          }
          // React Markdown + remark/rehype pipeline
          if (id.includes("node_modules/react-markdown") || id.includes("node_modules/remark") || id.includes("node_modules/rehype") || id.includes("node_modules/unified") || id.includes("node_modules/mdast") || id.includes("node_modules/micromark") || id.includes("node_modules/hast")) {
            return "vendor-markdown";
          }
          // Form handling
          if (id.includes("node_modules/react-hook-form") || id.includes("node_modules/@hookform/") || id.includes("node_modules/zod")) {
            return "vendor-forms";
          }
          // State management + HTTP
          if (id.includes("node_modules/zustand") || id.includes("node_modules/axios")) {
            return "vendor-state";
          }
          // CSS utility helpers
          if (id.includes("node_modules/tailwind-merge") || id.includes("node_modules/clsx") || id.includes("node_modules/class-variance-authority")) {
            return "vendor-css-utils";
          }
          // Everything else in node_modules → shared vendor chunk
          if (id.includes("node_modules/")) {
            return "vendor-misc";
          }
          return undefined;
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
    globals: true,
  }
});
