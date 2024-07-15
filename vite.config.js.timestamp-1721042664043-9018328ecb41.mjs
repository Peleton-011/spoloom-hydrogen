// vite.config.js
import { defineConfig } from "file:///home/nico/Documents/GitHub/spoloom-hydrogen/node_modules/vite/dist/node/index.js";
import { hydrogen } from "file:///home/nico/Documents/GitHub/spoloom-hydrogen/node_modules/@shopify/hydrogen/dist/vite/plugin.js";
import { oxygen } from "file:///home/nico/Documents/GitHub/spoloom-hydrogen/node_modules/@shopify/mini-oxygen/dist/vite/plugin.js";
import { vitePlugin as remix } from "file:///home/nico/Documents/GitHub/spoloom-hydrogen/node_modules/@remix-run/dev/dist/index.js";
import tsconfigPaths from "file:///home/nico/Documents/GitHub/spoloom-hydrogen/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    remix({ presets: [hydrogen.preset()] }),
    tsconfigPaths()
  ],
  ssr: {
    optimizeDeps: {
      include: ["typographic-base"]
    }
  },
  optimizeDeps: {
    include: [
      "clsx",
      "@headlessui/react",
      "typographic-base",
      "react-intersection-observer",
      "react-use/esm/useScroll",
      "react-use/esm/useDebounce",
      "react-use/esm/useWindowScroll"
    ]
  },
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9uaWNvL0RvY3VtZW50cy9HaXRIdWIvc3BvbG9vbS1oeWRyb2dlblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvbmljby9Eb2N1bWVudHMvR2l0SHViL3Nwb2xvb20taHlkcm9nZW4vdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvbmljby9Eb2N1bWVudHMvR2l0SHViL3Nwb2xvb20taHlkcm9nZW4vdml0ZS5jb25maWcuanNcIjtpbXBvcnQge2RlZmluZUNvbmZpZ30gZnJvbSAndml0ZSc7XG5pbXBvcnQge2h5ZHJvZ2VufSBmcm9tICdAc2hvcGlmeS9oeWRyb2dlbi92aXRlJztcbmltcG9ydCB7b3h5Z2VufSBmcm9tICdAc2hvcGlmeS9taW5pLW94eWdlbi92aXRlJztcbmltcG9ydCB7dml0ZVBsdWdpbiBhcyByZW1peH0gZnJvbSAnQHJlbWl4LXJ1bi9kZXYnO1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBoeWRyb2dlbigpLFxuICAgIG94eWdlbigpLFxuICAgIHJlbWl4KHtwcmVzZXRzOiBbaHlkcm9nZW4ucHJlc2V0KCldfSksXG4gICAgdHNjb25maWdQYXRocygpLFxuICBdLFxuICBzc3I6IHtcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFsndHlwb2dyYXBoaWMtYmFzZSddLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFtcbiAgICAgICdjbHN4JyxcbiAgICAgICdAaGVhZGxlc3N1aS9yZWFjdCcsXG4gICAgICAndHlwb2dyYXBoaWMtYmFzZScsXG4gICAgICAncmVhY3QtaW50ZXJzZWN0aW9uLW9ic2VydmVyJyxcbiAgICAgICdyZWFjdC11c2UvZXNtL3VzZVNjcm9sbCcsXG4gICAgICAncmVhY3QtdXNlL2VzbS91c2VEZWJvdW5jZScsXG4gICAgICAncmVhY3QtdXNlL2VzbS91c2VXaW5kb3dTY3JvbGwnLFxuICAgIF0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgLy8gQWxsb3cgYSBzdHJpY3QgQ29udGVudC1TZWN1cml0eS1Qb2xpY3lcbiAgICAvLyB3aXRodG91dCBpbmxpbmluZyBhc3NldHMgYXMgYmFzZTY0OlxuICAgIGFzc2V0c0lubGluZUxpbWl0OiAwLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNULFNBQVEsb0JBQW1CO0FBQ2pWLFNBQVEsZ0JBQWU7QUFDdkIsU0FBUSxjQUFhO0FBQ3JCLFNBQVEsY0FBYyxhQUFZO0FBQ2xDLE9BQU8sbUJBQW1CO0FBRTFCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLFNBQVM7QUFBQSxJQUNULE9BQU87QUFBQSxJQUNQLE1BQU0sRUFBQyxTQUFTLENBQUMsU0FBUyxPQUFPLENBQUMsRUFBQyxDQUFDO0FBQUEsSUFDcEMsY0FBYztBQUFBLEVBQ2hCO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxjQUFjO0FBQUEsTUFDWixTQUFTLENBQUMsa0JBQWtCO0FBQUEsSUFDOUI7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTO0FBQUEsTUFDUDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQTtBQUFBLElBR0wsbUJBQW1CO0FBQUEsRUFDckI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
