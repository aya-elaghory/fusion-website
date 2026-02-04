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

// Always default to the hosted Railway backend; allow override via VITE_API_URL.
const envApiUrlRaw = (import.meta.env.VITE_API_URL as string) || defaultProdUrl;

const isFullUrl = /^https?:\/\//i.test(envApiUrlRaw);
let baseURL = isFullUrl
  ? coerceHttpsForRailway(envApiUrlRaw)
  : envApiUrlRaw.replace(/\/+$/, "");

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
