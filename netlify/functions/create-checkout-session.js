const allowedHeaders =
  "Content-Type, Authorization, X-Access-Token, Authorization-Alt";

const withCors = (origin = "*") => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": allowedHeaders,
  "Access-Control-Allow-Credentials": "true",
});

let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  // Lazy-init Stripe when the secret is present
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
}

exports.handler = async (event) => {
  const origin = event.headers?.origin || process.env.CLIENT_URL || "*";
  const cors = withCors(origin);

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }

  if (!stripe) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }),
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: cors,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  let payload = {};
  try {
    payload = JSON.parse(event.body || "{}") || {};
  } catch (err) {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const {
    items = [],
    successUrl,
    cancelUrl,
    orderId,
    customerEmail,
    allowCountries,
    phoneRequired = true,
    metadata = {},
  } = payload;

  const normalizedItems = Array.isArray(items) ? items : [];
  const lineItems = normalizedItems
    .map((item) => {
      const amount = Number(item.amount ?? item.price ?? 0);
      const quantity = Number(item.quantity ?? 1) || 1;
      if (
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !Number.isFinite(quantity)
      ) {
        return null;
      }

      return {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: item.name || "Item",
            metadata: item.productId
              ? { productId: String(item.productId) }
              : {},
          },
        },
        quantity: Math.max(1, quantity),
      };
    })
    .filter(Boolean);

  if (!lineItems.length) {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({ error: "No payable line items" }),
    };
  }

  const defaultSuccess = `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
  const defaultCancel = `${origin}/payment-cancel`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: successUrl || defaultSuccess,
      cancel_url: cancelUrl || defaultCancel,
      customer_email: customerEmail || undefined,
      metadata: {
        orderId: orderId ? String(orderId) : "",
        ...metadata,
      },
      shipping_address_collection: Array.isArray(allowCountries)
        ? { allowed_countries: allowCountries }
        : undefined,
      phone_number_collection: { enabled: !!phoneRequired },
    });

    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({ id: session.id, url: session.url }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ error: err?.message || "Stripe error" }),
    };
  }
};
