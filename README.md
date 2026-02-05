# Fusion_Ecommerce_Website

Fusion_Ecommerce_Website/
├── public/
│ └── assets/
├── src/
│ ├── store/
│ │ └── index.ts (Redux store)
│ ├── components/
│ │ ├── blocks/
│ │ │ ├── Header.tsx
│ │ │ ├── Footer.tsx
│ │ │ └── Banner.tsx
│ │ ├── features/
│ │ │ ├── ScrollToTop.tsx
│ │ │ └── ErrorBoundary.tsx
│ ├── main.tsx
│ ├── App.tsx
│ ├── AppRoutes.tsx
│ └── index.css
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.js

## Stripe checkout wiring

- Env: copy .env.local.example to .env.local and set VITE_API_URL (no trailing slash), e.g. http://localhost:8000.
- Checkout call: frontend posts to /payments/orders/{orderId}/checkout with addConsultation, consultationFee, successUrl `${window.location.origin}/payment-success`, and cancelUrl `${window.location.origin}/payment-cancel`.
- Run frontend: npm install then npm run dev inside this folder.
- E2E test: backend at :8000 with STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, and CLIENT_URL set; run stripe listen --forward-to http://localhost:8000/payments/webhook; pay with 4242 4242 4242 4242 to confirm order status after webhook.

## Stripe via Netlify Functions

- Deploy secret `STRIPE_SECRET_KEY` (and optionally `CLIENT_URL`) in Netlify to enable `/.netlify/functions/create-checkout-session`.
- Frontend prefers the Netlify function first; set `VITE_PAYMENT_PROVIDER=backend` to force the legacy `/payments/orders/{id}/checkout` route.
- Success / cancel URLs are built from `window.location.origin` and include `orderId` + `{CHECKOUT_SESSION_ID}` so you can reconcile with Stripe webhooks.
