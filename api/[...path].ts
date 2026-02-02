import type { VercelRequest, VercelResponse } from "@vercel/node";

const backendBase =
  process.env.BACKEND_URL?.trim() ||
  "https://fusionbackend-production.up.railway.app";

// Strip headers that should not be forwarded
const hopByHopHeaders = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
  "origin",
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = Array.isArray(req.query.path)
    ? req.query.path.join("/")
    : req.query.path || "";

  const targetUrl = `${backendBase}/${path}`.replace(/(?<!:)\/+/g, "/");

  try {
    const incomingHeaders = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (!value) continue;
      if (hopByHopHeaders.has(key.toLowerCase())) continue;
      // Vercel may pass multi-value headers as array
      if (Array.isArray(value)) {
        for (const v of value) incomingHeaders.append(key, v);
      } else {
        incomingHeaders.set(key, value as string);
      }
    }

    // Ensure we always tell backend the request is HTTPS to avoid http redirects
    incomingHeaders.set("X-Forwarded-Proto", "https");

    const bodyAllowed = req.method && !["GET", "HEAD"].includes(req.method);
    const init: RequestInit = {
      method: req.method,
      headers: incomingHeaders,
      redirect: "follow",
    };

    if (bodyAllowed && req.body) {
      const buf = Buffer.isBuffer(req.body)
        ? req.body
        : typeof req.body === "string"
          ? Buffer.from(req.body)
          : Buffer.from(JSON.stringify(req.body));
      init.body = buf;
    }

    const upstreamResp = await fetch(targetUrl, init);

    // Copy response headers, excluding hop-by-hop
    upstreamResp.headers.forEach((value, key) => {
      if (hopByHopHeaders.has(key.toLowerCase())) return;
      res.setHeader(key, value);
    });

    res.status(upstreamResp.status);
    const arrayBuffer = await upstreamResp.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err: any) {
    const message = err?.message || "Proxy error";
    res.status(502).json({ error: message });
  }
}
