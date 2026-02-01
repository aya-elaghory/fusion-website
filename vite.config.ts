import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Add this import for path resolution

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const coerceHttpsForRailway = (url: string) => {
    if (!url) return url;

    const trimmed = url.trim();
    // Leave relative paths (e.g. /api) untouched
    if (trimmed.startsWith("/")) return trimmed;

    // Support bare hosts and force https for Railway
    const candidate = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

    try {
      const parsed = new URL(candidate);
      const needsHttps =
        parsed.protocol === "http:" &&
        /\.up\.railway\.app$/i.test(parsed.hostname);
      if (needsHttps) {
        parsed.protocol = "https:";
      }
      return parsed.toString().replace(/\/+$/, "");
    } catch (e) {
      return candidate.replace(/\/+$/, "");
    }
  };

  const apiUrl = coerceHttpsForRailway(env.VITE_API_URL || "/api");
  const disableProxy = env.VITE_DISABLE_PROXY === "true";
  const defaultProxyTarget = "https://fusionbackend-production.up.railway.app";

  // Configure proxy. If VITE_API_URL is a full URL, proxy /api to it.
  // If VITE_API_URL === '/api' we'll provide a fallback proxy to the backend
  // (or a custom VITE_PROXY_TARGET) during development to avoid CORS.
  const proxy: Record<string, any> = {};
  if (!disableProxy) {
    const fullUrlMatch = /^https?:\/\//i.test(apiUrl);
    if (fullUrlMatch) {
      const target = coerceHttpsForRailway(apiUrl);
      proxy["/api"] = {
        target,
        changeOrigin: true,
        secure: true, // keep https when talking to Railway
        protocolRewrite: "https", // prevent http downgrades that trigger redirects on preflight
        rewrite: (path) => path.replace(/^\/api/, ""),
        onProxyRes: rewriteLocationHeaders(target),
      };
    } else if (apiUrl === "/api") {
      const proxyTarget = coerceHttpsForRailway(
        env.VITE_PROXY_TARGET || defaultProxyTarget,
      );
      const target = proxyTarget.replace(/\/+$/, "");
      proxy["/api"] = {
        target,
        changeOrigin: true,
        secure: true,
        protocolRewrite: "https",
        rewrite: (path) => path.replace(/^\/api/, ""),
        onProxyRes: rewriteLocationHeaders(target),
      };
      // eslint-disable-next-line no-console
      console.warn(`[vite] proxying '/api' to ${proxyTarget}`);
    }
  }

  function rewriteLocationHeaders(target: string) {
    return function onProxyRes(proxyRes: any) {
      try {
        const loc = proxyRes.headers && proxyRes.headers.location;
        if (loc && typeof loc === "string") {
          const absolute = /^https?:\/\//i.test(loc);
          if (absolute) {
            try {
              const url = new URL(loc);
              const targetUrl = new URL(target);
              if (url.host === targetUrl.host) {
                proxyRes.headers.location = `/api${url.pathname}${url.search}`;
              }
            } catch (_) {
              // ignore parse errors
            }
          } else if (loc.startsWith("/")) {
            proxyRes.headers.location = `/api${loc}`.replace(/\/+/, "/");
          }
        }
      } catch (e) {
        // ignore
      }
    };
  }

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ["lucide-react"],
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: false,
      proxy: Object.keys(proxy).length ? proxy : undefined,
      // Dev-only middleware: short-circuit OPTIONS preflights for /api when proxying
      configureServer(server) {
        server.middlewares.use("/api", (req, res, next) => {
          if (!Object.keys(proxy).length) return next();
          if (req.method === "OPTIONS") {
            res.statusCode = 204;
            res.setHeader(
              "Access-Control-Allow-Origin",
              req.headers.origin || "*",
            );
            res.setHeader(
              "Access-Control-Allow-Methods",
              "GET,POST,PUT,PATCH,DELETE,OPTIONS",
            );
            res.setHeader(
              "Access-Control-Allow-Headers",
              req.headers["access-control-request-headers"] ||
                "Content-Type, Authorization",
            );
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.end();
            return;
          }
          next();
        });
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), // Map '@' to 'src' directory
      },
    },
  };
});
