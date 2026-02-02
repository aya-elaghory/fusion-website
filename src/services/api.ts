import axios from "axios";

const defaultProdUrl = "https://fusionbackend-production.up.railway.app";

// Force https for Railway hosts and normalize trailing slashes
const coerceHttpsForRailway = (url: string) => {
  if (!url) return url;

  const trimmed = url.trim();
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

// Decide whether to force the same-origin proxy to avoid CORS in static hosts.
const shouldForceProxy = () => {
  if (typeof window === "undefined") return false;

  const host = window.location.hostname;
  const isLocal =
    host === "localhost" || host === "127.0.0.1" || host === "::1";

  // On Netlify/Vercel (and other static hosts) we prefer the built-in /api
  // proxy instead of talking to Railway directly, which triggers CORS.
  const proxyHosts = [/netlify\.app$/i, /vercel\.app$/i];
  const onStaticHost = proxyHosts.some((re) => re.test(host));

  return !isLocal && onStaticHost;
};

// Default to same-origin "/api" so static hosts (e.g., Netlify) can proxy to
// the backend and avoid CORS. Allow overriding in local/dev.
const envApiUrlRaw = (import.meta.env.VITE_API_URL as string) || "";

let baseURL: string;

if (shouldForceProxy()) {
  baseURL = "/api";
} else if (!envApiUrlRaw) {
  baseURL = "/api";
} else {
  const isFullUrl = /^https?:\/\//i.test(envApiUrlRaw);
  baseURL = isFullUrl
    ? coerceHttpsForRailway(envApiUrlRaw)
    : envApiUrlRaw.replace(/\/+$/, "");
}

// Defensive: never talk to Railway over http
if (/^http:\/\/[^/]*\.up\.railway\.app/i.test(baseURL)) {
  baseURL = baseURL.replace(/^http:/i, "https:");
}

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const storedToken =
    localStorage.getItem("token") || localStorage.getItem("access_token") || "";

  const token = storedToken.replace(/^"+|"+$/g, "").trim();

  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
    (config.headers as any)["X-Access-Token"] = token;
    (config.headers as any)["Authorization-Alt"] = `Token ${token}`;
  }

  return config;
});

export default api;
