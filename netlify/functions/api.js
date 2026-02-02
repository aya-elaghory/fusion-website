const hopByHop = new Set([
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

exports.handler = async (event) => {
  const origin = event.headers?.origin || "*";

  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
        "Access-Control-Allow-Headers":
          event.headers["access-control-request-headers"] ||
          "Content-Type, Authorization, X-Access-Token, Authorization-Alt",
        "Access-Control-Allow-Credentials": "true",
      },
      body: "",
    };
  }

  const path = event.path.replace(/^\/api\/?/, "");
  const target = `${backendBase.replace(/\/+$/, "")}/${path}`.replace(
    /(?<!:)\/+/,
    "/",
  );

  // Build headers
  const headers = new Headers();
  for (const [key, value] of Object.entries(event.headers || {})) {
    if (!value) continue;
    if (hopByHop.has(key.toLowerCase())) continue;
    headers.set(key, value);
  }
  headers.set("X-Forwarded-Proto", "https");

  const init = {
    method: event.httpMethod,
    headers,
    redirect: "manual",
  };

  const bodyAllowed = !["GET", "HEAD"].includes(event.httpMethod);
  if (bodyAllowed && event.body) {
    init.body = event.isBase64Encoded
      ? Buffer.from(event.body, "base64")
      : event.body;
  }

  try {
    let resp = await fetch(target, init);

    // Upgrade Railway http redirects to https if encountered
    const loc = resp.headers.get("location") || "";
    const isRedirect = resp.status >= 300 && resp.status < 400 && loc;
    const httpRailway = /^http:\/\/[^/]*\.up\.railway\.app/i;
    if (isRedirect && httpRailway.test(loc)) {
      resp = await fetch(loc.replace(/^http:/i, "https:"), init);
    }

    const respHeaders = {};
    resp.headers.forEach((v, k) => {
      if (hopByHop.has(k.toLowerCase())) return;
      respHeaders[k] = v;
    });
    respHeaders["Access-Control-Allow-Origin"] = origin;
    respHeaders["Access-Control-Allow-Credentials"] = "true";

    const arrayBuffer = await resp.arrayBuffer();
    const body = Buffer.from(arrayBuffer).toString("base64");

    return {
      statusCode: resp.status,
      headers: respHeaders,
      body,
      isBase64Encoded: true,
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({ error: err?.message || "Proxy error" }),
    };
  }
};
