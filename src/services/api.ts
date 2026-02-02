import axios from "axios";

const defaultProdUrl = "https://fusionbackend-production.up.railway.app";
const defaultDevProxyTarget = defaultProdUrl;

// Prevent preflight redirects (e.g., http -> https on Railway) that break CORS
const coerceHttpsForRailway = (url: string) => {
  if (!url) return url;

  const trimmed = url.trim();
  // Keep relative paths (e.g. /api) untouched
  if (trimmed.startsWith("/")) return trimmed;

  // Allow bare hosts like "fusionbackend-production.up.railway.app"
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
    // fall through to raw url
  }

  return candidate.replace(/\/+$/, "");
};

const isDev = !!import.meta.env.DEV;

const disableDevProxy =
  (import.meta.env.VITE_DISABLE_PROXY as string) === "true";

// In production builds, ignore a dev-only value of "/api" (used for the Vite
// proxy) so the client calls the real backend instead of the static host.
const allowProdApiPath =
  (import.meta.env.VITE_ALLOW_API_PATH_IN_PROD as string) === "true";

const envApiUrlRaw = (() => {
  const raw = (import.meta.env.VITE_API_URL as string) || "";
  if (isDev && !disableDevProxy) return "/api"; // prefer proxy in dev

  // In production we normally avoid a bare "/api" to prevent hitting the
  // static host. Allow it explicitly when a platform rewrite (e.g., Vercel)
  // forwards /api to the backend and VITE_ALLOW_API_PATH_IN_PROD=true.
  if (!isDev && raw.trim() === "/api" && !allowProdApiPath) {
    // eslint-disable-next-line no-console
    console.warn(
      "VITE_API_URL was '/api' in production; set VITE_ALLOW_API_PATH_IN_PROD=true when using platform rewrites.",
    );
    return "";
  }
  return raw;
})();

// Detect Vercel at build/run time to auto-prefer the rewrite path when no env
const isLikelyVercel =
  (typeof window !== "undefined" &&
    /\.vercel\.app$/i.test(window.location.hostname)) ||
  (import.meta.env as any).VERCEL === "1" ||
  !!(import.meta.env as any).VITE_VERCEL_URL;

// Default to the production backend as a proxy target in dev so CORS is avoided
// even when no env vars are set locally.
const envProxyTarget =
  ((import.meta.env as any).VITE_PROXY_TARGET as string | undefined) ??
  (isDev ? defaultDevProxyTarget : undefined);

// Resolution rules (dev prefers proxy to avoid CORS):
// 1) If VITE_API_URL is a full URL, use it (coerced to https for Railway).
// 2) In dev ALWAYS force baseURL to '/api' so Vite proxy handles CORS (even if a URL is set).
// 3) Otherwise fall back to production URL.
const isFullUrl = /^https?:\/\//i.test(envApiUrlRaw);
const hasProxyTarget = !!envProxyTarget;

// In dev, force the Vite proxy (/api) unless explicitly disabled
// In production builds (including `vite preview`), avoid forcing the proxy so
// we don't hit a missing /api handler. Use the proxy only in dev unless
// explicitly disabled via VITE_DISABLE_PROXY.
const shouldUseDevProxy = isDev && !disableDevProxy;

// If we should use the proxy (dev or localhost runtime), force base to /api.
// This avoids hitting the remote backend directly and side-steps CORS.
let rawBase = shouldUseDevProxy ? "/api" : envApiUrlRaw || defaultProdUrl;

// On Vercel, default to the rewrite path (/api) to avoid CORS preflights to the
// Railway origin. Opt out with VITE_FORCE_DIRECT_BACKEND=true if you truly want
// to bypass the rewrite and call the backend directly.
const forceVercelRewrite =
  !isDev &&
  isLikelyVercel &&
  ((import.meta.env as any).VITE_FORCE_DIRECT_BACKEND as string) !== "true";

if (forceVercelRewrite) {
  rawBase = "/api";
}
const proxyTarget = coerceHttpsForRailway(
  envProxyTarget || (isFullUrl ? envApiUrlRaw : undefined) || defaultProdUrl,
);

let baseURL = coerceHttpsForRailway(rawBase || defaultProdUrl);

// Defensive: never talk to Railway over http (avoids 301/307 preflight failures)
if (/^http:\/\/[^/]*\.up\.railway\.app/i.test(baseURL)) {
  baseURL = baseURL.replace(/^http:/i, "https:");
}

// Dev-time hint: when using the default '/api' base, ensure the dev server
// proxy is configured or set VITE_API_URL to the backend full URL.
if (import.meta.env.DEV && baseURL === "/api") {
  const target = proxyTarget || null;
  // eslint-disable-next-line no-console
  console.warn(
    target
      ? `VITE_API_URL='/api' — dev server should proxy '/api' to ${target}`
      : "VITE_API_URL is '/api'. Configure VITE_PROXY_TARGET or set VITE_API_URL to your backend URL.",
  );
}

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Debug hint: log the resolved baseURL in production to verify rewrites/envs
if (!import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info("API baseURL", baseURL);
}

// Upgrade accidental http calls to Railway to https to avoid 301/307 preflight failures
const upgradeRailwayToHttps = (config: any) => {
  const base = config.baseURL;
  // Skip relative bases (proxy paths) so dev /api continues to work
  if (!base || base.startsWith("/")) return config;

  try {
    const resolved = new URL(config.url || "", base);
    const isRailwayHost = /\.up\.railway\.app$/i.test(resolved.hostname);
    if (isRailwayHost && resolved.protocol === "http:") {
      resolved.protocol = "https:";
      config.baseURL = resolved.origin;
      config.url = `${resolved.pathname}${resolved.search}`;
    }
  } catch (err) {
    // ignore URL resolution errors; fall back to original config
  }

  return config;
};

// ✅ Attach JWT automatically and harden protocol for Railway
api.interceptors.request.use((config) => {
  const storedToken =
    localStorage.getItem("token") || localStorage.getItem("access_token") || "";

  // Strip surrounding quotes/whitespace that some storages may add
  const token = storedToken.replace(/^"+|"+$/g, "").trim();

  if (token) {
    config.headers = config.headers ?? {};
    // Send multiple auth header variants to satisfy differing backends
    (config.headers as any).Authorization = `Bearer ${token}`;
    (config.headers as any)["X-Access-Token"] = token;
    // Some APIs expect `Token <jwt>` instead of Bearer
    (config.headers as any)["Authorization-Alt"] = `Token ${token}`;
  }

  return upgradeRailwayToHttps(config);
});

export default api;
