import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig(({ command, mode }) => {
  if (command === "build" && mode === "lib") {
    // Library build configuration
    return {
      build: {
        copyPublicDir: false,
        emptyOutDir: true,
        minify: true,
        lib: {
          entry: path.resolve(__dirname, "src/lib/diagram-injection.ts"),
          name: "MomentumVenn",
          fileName: `momentum-venn`,
          formats: ["umd"],
        },
        rollupOptions: {
          // Ensure to externalize dependencies that shouldn't be bundled
          // external: ["react", "react-dom"],
          // output: {
          //   globals: {
          //     react: "React",
          //     "react-dom": "ReactDOM",
          //   },
          // },
        },
      },
      define: {
        "process.env.NODE_ENV": JSON.stringify(mode),
      },
      plugins: [react()],
    };
  }

  // Default to application build
  return {
    plugins: [
      react(),
      VitePWA({
        // add this to cache all the imports
        workbox: {
          globPatterns: ["**/*"],
        },
        // add this to cache all the
        // static assets in the public folder
        includeAssets: ["**/*"],
      }),
    ],
  };
});
