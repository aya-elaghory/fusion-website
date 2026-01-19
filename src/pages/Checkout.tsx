// src/pages/Checkout.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState, AppDispatch } from "@/store";
import { updateProfile } from "@/slices/profileSlice";
import MagnetizeButton from "@/components/ui/magnetize-button";
import api from "@/services/api";

/** -------- Money utils -------- */
const parseMoney = (value: unknown): number => {
  if (typeof value === "number") return isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;
  const s = value.trim();
  if (!s) return 0;

  if (s.includes(",") && s.includes(".")) {
    const cleaned = s.replace(/[^\d.,-]/g, "").replace(/,/g, "");
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
  }
  if (s.includes(",") && !s.includes(".")) {
    const cleaned = s.replace(/[^\d,-]/g, "").replace(",", ".");
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
  }
  const cleaned = s.replace(/[^\d.-]/g, "");
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
};

const extractPrice = (raw: any): number => {
  if (raw == null) return 0;
  if (typeof raw === "number") return isFinite(raw) ? raw : 0;
  if (typeof raw === "string") return parseMoney(raw);
  if (typeof raw === "object") {
    if ("amount" in raw) return extractPrice(raw.amount);
    if ("value" in raw) return extractPrice(raw.value);
    if ("price" in raw) return extractPrice(raw.price);
    if ("unitAmount" in raw) return extractPrice(raw.unitAmount);
    if ("unit_amount" in raw) return extractPrice(Number(raw.unit_amount) / 100);
    if ("priceCents" in raw) return extractPrice(Number(raw.priceCents) / 100);
  }
  return 0;
};

const fmtUSD = (n: number) =>
  `$${(Math.round((n + Number.EPSILON) * 100) / 100).toFixed(2)}`;

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

type Step = "shipping" | "payment";

const Checkout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  // Cart (single source of truth)
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const addConsultation = useSelector(
    (state: RootState) => state.cart.addConsultation
  );

  // Profile/Auth
  const { profile } = useSelector((state: RootState) => state.profile);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const authUser = useSelector((state: RootState) => state.auth.user);

  // Products (to resolve IDs/prices if cart stored strings)
  const products = useSelector((state: RootState) => state.products.products);
  const productsLoading = useSelector(
    (state: RootState) => state.products.loading
  );

  const isFirstTime = profile?.incompleteVisit === true;

  // Step from URL
  const [step, setStep] = useState<Step>(() => {
    const params = new URLSearchParams(location.search);
    return params.get("step") === "payment" ? "payment" : "shipping";
  });

  // 1) Must be logged in to checkout
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // 2) First time must select consultation in CART (not checkout)
  useEffect(() => {
    // Wait until profile exists to avoid redirect before profile loads
    if (!profile) return;

    if (isFirstTime && !addConsultation) {
      navigate("/cart", { replace: true });
    }
  }, [profile, isFirstTime, addConsultation, navigate]);

  // 3) Cart cannot be empty
  useEffect(() => {
    if (!cartItems?.length) {
      navigate("/cart", { replace: true });
    }
  }, [cartItems, navigate]);

  // Default shipping address
  const defaultAddress = useMemo(() => {
    const addr = profile?.addresses?.[0];
    return {
      address: addr?.line1 || "",
      city: addr?.city || "",
      country: addr?.country || "",
      zipCode: addr?.postalCode || "",
    };
  }, [profile]);

  // Initial email/name
  const computedEmail = (profile?.email || authUser?.email || "").trim();
  const computedName = profile
    ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim()
    : "";

  const [formData, setFormData] = useState(() => ({
    email: computedEmail,
    name: computedName,
    ...defaultAddress,
  }));

  // keep filled once profile arrives (don’t overwrite user edits)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: prev.email?.trim() ? prev.email : computedEmail,
      name: prev.name?.trim() ? prev.name : computedName,
      address: prev.address?.trim() ? prev.address : defaultAddress.address,
      city: prev.city?.trim() ? prev.city : defaultAddress.city,
      country: prev.country?.trim() ? prev.country : defaultAddress.country,
      zipCode: prev.zipCode?.trim() ? prev.zipCode : defaultAddress.zipCode,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computedEmail, computedName, defaultAddress]);

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateShipping = () => {
    const email = (formData.email || "").trim();
    const name = (formData.name || "").trim();

    if (!email || !isValidEmail(email)) return "Please enter a valid email.";
    if (!name) return "Please enter your full name.";
    if (!formData.address?.trim()) return "Please enter your address.";
    if (!formData.city?.trim()) return "Please enter your city.";
    if (!formData.country?.trim()) return "Please enter your country.";
    if (!formData.zipCode?.trim()) return "Please enter your ZIP code.";
    return null;
  };

  // Build DTO items for backend (IMPORTANT: productId must be real DB id)
  const itemsDto = useMemo(() => {
    return (cartItems || [])
      .map((ci: any) => {
        const product =
          products.find(
            (p: any) =>
              p._id === ci.id ||
              p.id === ci.id ||
              p._id === ci.productId ||
              p.id === ci.productId
          ) || null;

        const productId =
          product?._id || product?.id || ci.productId || ci.id || "";

        return {
          productId,
          quantity: Number(ci.quantity) || 1,
          ...(ci.purchaseOption ? { purchaseOption: ci.purchaseOption } : {}),
          __ui: {
            name: product?.name || ci.name || "Product",
            unit: extractPrice(product?.price ?? ci.price ?? 0),
          },
        };
      })
      .filter((x) => !!x.productId); // drop invalid items
  }, [cartItems, products]);

  // UI order summary items
  const summaryItems = useMemo(() => {
    return itemsDto.map((x: any) => ({
      name: x.__ui.name,
      quantity: x.quantity,
      unit: x.__ui.unit,
      line: x.__ui.unit * x.quantity,
    }));
  }, [itemsDto]);

  const orderTotal = useMemo(() => {
    return summaryItems.reduce((acc, it) => acc + it.line, 0);
  }, [summaryItems]);

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const v = validateShipping();
    if (v) return setError(v);

    try {
      setBusy(true);

      // Save to profile (optional but helpful)
      const full = formData.name.trim();
      const parts = full.split(/\s+/).filter(Boolean);
      const firstName = parts[0] || profile?.firstName || "";
      const lastName = parts.slice(1).join(" ") || profile?.lastName || "";

      await dispatch(
        updateProfile({
          firstName,
          lastName,
          email: formData.email.trim(),
          addresses: [
            {
              label: "Shipping",
              line1: formData.address.trim(),
              line2: "",
              city: formData.city.trim(),
              state: "",
              postalCode: formData.zipCode.trim(),
              country: formData.country.trim(),
            },
          ],
        } as any)
      ).unwrap?.();

      setStep("payment");
      navigate("/checkout?step=payment", { replace: true });
    } catch {
      // even if profile update fails, continue
      setStep("payment");
      navigate("/checkout?step=payment", { replace: true });
    } finally {
      setBusy(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Enforce consultation rule (backend will also enforce ideally)
      if (profile && isFirstTime && !addConsultation) {
        setError(
          "First-time buyers must include a consultation. Please go back to cart."
        );
        navigate("/cart");
        return;
      }

      const v = validateShipping();
      if (v) {
        setError(v);
        setStep("shipping");
        navigate("/checkout?step=shipping", { replace: true });
        return;
      }

      if (!itemsDto.length) {
        setError("Your cart is empty or has invalid items.");
        navigate("/cart");
        return;
      }

      setBusy(true);

      // ✅ single, backend-friendly payload
      const finalOrder = {
        items: itemsDto.map(({ productId, quantity, purchaseOption }: any) => ({
          productId,
          quantity,
          ...(purchaseOption ? { purchaseOption } : {}),
        })),
        shippingInfo: {
          email: formData.email.trim(),
          name: formData.name.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          country: formData.country.trim(),
          zipCode: formData.zipCode.trim(),
        },
        addConsultation,
        status: "PENDING",
      };

      // 1) create order
      const orderRes = await api.post("/orders", finalOrder);
      const orderId = orderRes.data?.id || orderRes.data?._id;
      if (!orderId) throw new Error("Order created but no orderId returned.");

      // 2) stripe checkout session
      const origin = window.location.origin;
      const sessionRes = await api.post(
        `/payments/orders/${orderId}/checkout`,
        {
          addConsultation,
          successUrl: `${origin}/payment-success`,
          cancelUrl: `${origin}/payment-cancel`,
        }
      );

      const url = sessionRes.data?.url;
      if (!url) throw new Error("Stripe session URL missing.");

      window.location.assign(url);
    } catch (err: any) {
      // Handle unauthorized cleanly
      if (err?.response?.status === 401) {
        setError("Unauthorized. Please login again.");
        navigate("/login");
        return;
      }
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Payment failed. Check backend logs.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin h-12 w-12 border-4 border-green-800 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-20">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
        Checkout
      </h1>

      {/* consultation rule is enforced in Cart. Don’t show warning here */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left */}
        <div>
          {step === "shipping" ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Shipping Information
              </h2>

              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 shadow-sm"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 shadow-sm"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 shadow-sm"
                    autoComplete="street-address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border-gray-300 shadow-sm"
                      autoComplete="address-level2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border-gray-300 shadow-sm"
                      autoComplete="postal-code"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 shadow-sm"
                    autoComplete="country-name"
                  />
                </div>

                <MagnetizeButton
                  type="submit"
                  bgColor="bg-primary"
                  textColor="text-white"
                  hoverBgColor="hover:bg-primary/90"
                  particleColor="bg-primary/50"
                  size="md"
                  rounded="none"
                  className="w-full py-3"
                  disabled={busy}
                >
                  {busy ? "Saving..." : "Proceed to Payment"}
                </MagnetizeButton>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Payment</h2>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <p className="text-gray-600">
                  You will be redirected to Stripe Checkout to complete payment.
                </p>

                <MagnetizeButton
                  type="submit"
                  bgColor="bg-primary"
                  textColor="text-white"
                  hoverBgColor="hover:bg-primary/90"
                  particleColor="bg-primary/50"
                  size="md"
                  rounded="none"
                  className="w-full py-3"
                  disabled={busy || summaryItems.length === 0}
                >
                  {busy ? "Redirecting..." : `Pay (${fmtUSD(orderTotal)})`}
                </MagnetizeButton>

                <button
                  type="button"
                  className="w-full py-3 border border-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    setStep("shipping");
                    navigate("/checkout?step=shipping", { replace: true });
                  }}
                  disabled={busy}
                >
                  Back to Shipping
                </button>
              </form>
            </>
          )}
        </div>

        {/* Right */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-gray-50 p-4">
            <div className="space-y-4">
              {summaryItems.length === 0 ? (
                <p className="text-gray-600">Your cart is empty.</p>
              ) : (
                summaryItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-xs text-gray-500">
                        Unit: {fmtUSD(item.unit)}
                      </p>
                    </div>
                    <p className="font-medium">{fmtUSD(item.line)}</p>
                  </div>
                ))
              )}
            </div>

            {summaryItems.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold">{fmtUSD(orderTotal)}</span>
              </div>
            )}

            {/* show consultation selection (read-only) */}
            {profile && (
              <div className="mt-4 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Consultation</span>
                  <span className="font-medium">
                    {addConsultation ? "Included" : "Not included"}
                  </span>
                </div>
                {isFirstTime && !addConsultation ? (
                  <p className="text-red-600 mt-1">
                    First-time buyers must include consultation (choose it in
                    cart).
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
