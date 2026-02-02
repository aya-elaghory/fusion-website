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

const backendBase =
  (process.env.BACKEND_URL && process.env.BACKEND_URL.trim()) ||
  "https://fusionbackend-production.up.railway.app";

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Access-Token, Authorization-Alt",
    );
    return res.status(200).end();
  }

  const path = Array.isArray(req.query.path)
    ? req.query.path.join("/")
    : req.query.path || "";

  const coercedBase = backendBase.replace(/^http:/i, "https:");
  const targetUrl = `${coercedBase}/${path}`.replace(/(?<!:)\/+/g, "/");

  try {
    const incomingHeaders = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (!value) continue;
      if (hopByHopHeaders.has(key.toLowerCase())) continue;
      if (Array.isArray(value)) {
        for (const v of value) incomingHeaders.append(key, v);
      } else {
        incomingHeaders.set(key, value);
      }
    }

    incomingHeaders.set("X-Forwarded-Proto", "https");

    const bodyAllowed = req.method && !["GET", "HEAD"].includes(req.method);
    const init = {
      method: req.method,
      headers: incomingHeaders,
      redirect: "manual",
    };

    if (bodyAllowed && req.body) {
      const buf = Buffer.isBuffer(req.body)
        ? req.body
        : typeof req.body === "string"
          ? Buffer.from(req.body)
          : Buffer.from(JSON.stringify(req.body));
      init.body = buf;
    }

    let upstreamResp = await fetch(targetUrl, init);

    const isRedirect = upstreamResp.status >= 300 && upstreamResp.status < 400;
    const location = upstreamResp.headers.get("location") || "";
    const httpRailway = /^http:\/\/[^/]*\.up\.railway\.app/i;

    if (isRedirect && location && httpRailway.test(location)) {
      const upgraded = location.replace(/^http:/i, "https:");
      upstreamResp = await fetch(upgraded, {
        method: req.method,
        headers: incomingHeaders,
        redirect: "follow",
        body: init.body,
      });
    }

    upstreamResp.headers.forEach((value, key) => {
      if (hopByHopHeaders.has(key.toLowerCase())) return;
      res.setHeader(key, value);
    });

    res.status(upstreamResp.status);
    const arrayBuffer = await upstreamResp.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    const message = (err && err.message) || "Proxy error";
    res.status(502).json({ error: message });
  }
};
