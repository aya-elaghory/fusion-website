// src/pages/Account.tsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { logout } from "@/slices/authSlice";
import { updateProfile, fetchProfile } from "@/slices/profileSlice";
import { fetchOrders } from "@/slices/ordersSlice";
import { fetchCart } from "@/slices/cartSlice";
import { fetchQuestions } from "@/slices/questionsSlice";
import { fetchAnswers } from "@/slices/answersSlice";
import type { RootState, AppDispatch } from "@/store";
import CartModificationModal from "@/components/blocks/CartModificationModal";
import {
  Mail,
  MapPin,
  CreditCard,
  Home as HomeIcon,
  Edit2,
  LogOut,
  PackageSearch,
  XCircle,
  Plus,
  Save,
  X,
  Clock,
  Trash,
  Eye,
} from "lucide-react";

const brandLogos: { [key: string]: string } = {
  visa: "/assets/visa.svg",
  mastercard: "/assets/mastercard.svg",
  amex: "/assets/amex.svg",
  discover: "/assets/discover.svg",
};

type PaymentMethod = {
  cardholderName: string;
  cardNumber: string;
  expMonth: number;
  expYear: number;
  brand: string;
};

const Account: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const loading = useSelector((state: RootState) => state.profile.loading);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartLoading = useSelector((state: RootState) => state.cart.loading);
  const cartHasFetched = useSelector(
    (state: RootState) => state.cart.hasFetched
  );

  const orders = useSelector((state: RootState) => state.orders.orders);
  const ordersLoading = useSelector((state: RootState) => state.orders.loading);
  const ordersLoaded = useSelector(
    (state: RootState) => !!state.orders.orders.length
  );

  const answersLoading = useSelector(
    (state: RootState) => state.answers.loading
  );

  // --- Modal state ---
  const [editOpen, setEditOpen] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [editPaymentIdx, setEditPaymentIdx] = useState<number | null>(null);
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);

  // --- Edit form ---
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    addresses: [] as any[],
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // --- Payment form ---
  const emptyPayment: PaymentMethod = {
    cardholderName: "",
    cardNumber: "",
    expMonth: 1,
    expYear: new Date().getFullYear(),
    brand: "",
  };
  const [paymentForm, setPaymentForm] = useState<PaymentMethod>(emptyPayment);

  // Prefill form with profile data when opening editor
  useEffect(() => {
    if (profile && editOpen) {
      setForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        addresses: profile.addresses?.length ? [...profile.addresses] : [],
      });
    }
  }, [profile, editOpen]);

  // --- Fetch orders after auth (once)
  useEffect(() => {
    if (isAuthenticated && !ordersLoaded) {
      dispatch(fetchOrders());
    }
  }, [dispatch, isAuthenticated, ordersLoaded]);

  // --- Fetch cart once after auth (NOT tied to modal visibility)
  const fetchedCartOnceRef = useRef(false);
  useEffect(() => {
    if (
      isAuthenticated &&
      !cartLoading &&
      !cartHasFetched &&
      !fetchedCartOnceRef.current
    ) {
      fetchedCartOnceRef.current = true; // guard repeated calls (StrictMode etc.)
      dispatch(fetchCart());
    }
  }, [isAuthenticated, cartLoading, cartHasFetched, dispatch]);

  // Build a signature of product mix (names) to refetch questions on add/remove
  const productMixSig = useMemo(
    () => cartItems.map((i) => i.name).sort().join("|"),
    [cartItems]
  );

  // --- Fetch questions after cart is fetched; refetch when mix changes
  useEffect(() => {
    if (isAuthenticated && !cartLoading && cartHasFetched) {
      // ✅ Correct payload shape
      dispatch(fetchQuestions({ cartItems }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, cartLoading, cartHasFetched, productMixSig, dispatch]);

  // --- Fetch answers only when profile says incompleteVisit
  useEffect(() => {
    if (isAuthenticated && profile?.incompleteVisit && !answersLoading) {
      dispatch(fetchAnswers());
    }
  }, [dispatch, isAuthenticated, profile, answersLoading]);

  // ---- Scroll lock for any open modal or edit, bulletproof cleanup ----
  const modalOpen =
    editOpen || showCartModal || addPaymentOpen || editPaymentIdx !== null;
  useEffect(() => {
    if (modalOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
    document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen, location]);

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (!isAuthenticated || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-10 w-10 border-4 border-green-800 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <XCircle className="w-10 h-10 text-red-500 mb-2" />
        <p className="text-gray-600">Failed to load your profile data.</p>
      </div>
    );
  }

  // ---- helpers ----
  const {
    firstName,
    lastName,
    email,
    updatedAt,
    addresses,
    paymentMethods = [],
    incompleteVisit,
  } = profile;

  const initials =
    [firstName, lastName]
      .filter(Boolean)
      .map((n) => n?.[0]?.toUpperCase())
      .join("") || "U";

  const updatedOn = updatedAt
    ? new Date(updatedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  // Show incomplete visit button only when visit is incomplete AND cart is fetched & has items
  const showIncompleteVisitBtn =
    Boolean(incompleteVisit) &&
    !cartLoading &&
    cartHasFetched &&
    cartItems.length > 0;

  // ----------- Edit logic -----------
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };
  const handleAddrChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((f) => ({
      ...f,
      addresses: f.addresses.map((addr, i) =>
        i === idx ? { ...addr, [e.target.name]: e.target.value } : addr
      ),
    }));
  };
  const addAddress = () => {
    setForm((f) => ({
      ...f,
      addresses: [
        ...f.addresses,
        { line1: "", city: "", state: "", postalCode: "", country: "" },
      ],
    }));
  };
  const removeAddress = (idx: number) => {
    setForm((f) => ({
      ...f,
      addresses: f.addresses.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await dispatch(updateProfile({ ...profile, ...form })).unwrap();
      setSuccess(true);
      dispatch(fetchProfile());
      setTimeout(() => {
        setEditOpen(false);
      }, 900);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update profile"
      );
    } finally {
      setFormLoading(false);
    }
  };

  // ----------- Payment logic -----------
  const handlePaymentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };
  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPayments = [...paymentMethods, paymentForm];
    await dispatch(updateProfile({ paymentMethods: updatedPayments }));
    setAddPaymentOpen(false);
    setPaymentForm(emptyPayment);
    dispatch(fetchProfile());
  };
  const handleEditPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editPaymentIdx === null) return;
    const updated = paymentMethods.map((pm, idx) =>
      idx === editPaymentIdx ? paymentForm : pm
    );
    await dispatch(updateProfile({ paymentMethods: updated }));
    setEditPaymentIdx(null);
    setPaymentForm(emptyPayment);
    dispatch(fetchProfile());
  };
  const handleDeletePayment = async (idx: number) => {
    const updated = paymentMethods.filter((_, i) => i !== idx);
    await dispatch(updateProfile({ paymentMethods: updated }));
    dispatch(fetchProfile());
  };
  const openEditPayment = (idx: number) => {
    setPaymentForm(paymentMethods[idx]);
    setEditPaymentIdx(idx);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-24 mb-20">
      {/* User card */}
      <div className="bg-white/70 shadow-xl rounded-2xl p-6 flex flex-col items-center relative backdrop-blur-lg border border-gray-200">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setEditOpen(true)}
            className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition"
            title="Edit Profile"
          >
            <Edit2 className="w-5 h-5 text-green-800" />
          </button>
        </div>
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-green-700 to-green-300 shadow flex items-center justify-center text-white text-4xl font-bold mb-2 ring-2 ring-green-200">
          {initials}
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-0.5">
            {firstName} {lastName}
          </h1>
          <div className="flex items-center justify-center space-x-2 text-gray-700 mb-1">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{email}</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-400 text-xs">
            {updatedAt && (
              <>
                <Clock className="w-3 h-3" />
                <span>Last updated {updatedOn}</span>
              </>
            )}
          </div>

          {showIncompleteVisitBtn && (
            <div className="mt-2 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center px-3 py-0.5 rounded-full bg-yellow-50 text-yellow-800 text-xs font-semibold border border-yellow-200 gap-1 shadow hover:bg-yellow-100 transition cursor-pointer"
                onClick={() => setShowCartModal(true)}
                title="Resume your doctor visit"
              >
                <PackageSearch className="w-4 h-4" />
                Incomplete Doctor Visit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Addresses */}
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="bg-white/80 p-4 rounded-xl shadow border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <HomeIcon className="w-5 h-5 text-green-700" />
            <span className="font-semibold text-gray-900">Addresses</span>
          </div>
          {addresses?.length > 0 ? (
            <ul className="space-y-3">
              {addresses.map((addr, i) => (
                <li
                  key={i}
                  className="p-2 bg-gray-50 rounded hover:shadow transition"
                >
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-800">
                      {addr.label || "Address"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-700 ml-5">
                    {addr.line1}
                    {addr.line2 && <>, {addr.line2}</>}
                    <br />
                    {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400 text-sm">No saved addresses.</div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white/80 p-4 rounded-xl shadow border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-green-700" />
            <span className="font-semibold text-gray-900">Payment Methods</span>
            <button
              onClick={() => setAddPaymentOpen(true)}
              className="ml-auto bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded flex items-center gap-1"
              title="Add Payment"
              type="button"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {paymentMethods?.length > 0 ? (
            <ul className="space-y-3">
              {paymentMethods.map((pm, i) => (
                <li
                  key={i}
                  className="p-2 bg-gray-50 rounded flex items-center gap-2 hover:shadow transition relative"
                >
                  {brandLogos[pm.brand?.toLowerCase()] ? (
                    <img
                      src={brandLogos[pm.brand.toLowerCase()]}
                      alt={pm.brand}
                      className="w-8 h-5 object-contain mr-1"
                    />
                  ) : (
                    <CreditCard className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-800 font-medium">
                    {pm.brand} ···· {pm.cardNumber}
                  </span>
                  <span className="ml-auto text-xs text-gray-500">
                    Expires {pm.expMonth}/{pm.expYear}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {pm.cardholderName}
                  </span>
                  <button
                    className="ml-3 text-blue-600 hover:underline"
                    onClick={() => openEditPayment(i)}
                  >
                    Edit
                  </button>
                  <button
                    className="ml-1 text-red-500 hover:text-red-700"
                    onClick={() => handleDeletePayment(i)}
                    title="Delete"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400 text-sm">No payment methods.</div>
          )}
        </div>
      </div>

      {/* ---- Order history preview (latest 3 orders) ---- */}
      <div className="bg-white/80 p-6 rounded-xl shadow border border-gray-100 mt-10">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-green-700" />
          <span className="font-semibold text-gray-900">Recent Orders</span>
          <button
            className="ml-auto px-3 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100"
            onClick={() => navigate("/order-history")}
            type="button"
          >
            View All
          </button>
        </div>
        {ordersLoading ? (
          <div className="text-gray-400 text-sm">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="text-gray-400 text-sm">No orders yet.</div>
        ) : (
          <ul className="divide-y">
            {orders
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .slice(0, 3)
              .map((order) => (
                <li key={order._id} className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium text-gray-800">
                        Order #{order._id.slice(-6)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-green-700 font-bold">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {order.status}
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-3 mt-10 justify-center">
        <button
          onClick={() => setEditOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-white border border-green-800 text-green-800 font-semibold rounded-lg hover:bg-green-50 transition"
        >
          <Edit2 className="w-5 h-5" />
          Edit Profile
        </button>
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-green-800 text-white font-semibold rounded-lg hover:bg-red-700 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* ------ Modal for editing profile ------- */}
      {editOpen &&
        createPortal(
          <div className="fixed inset-0 bg-black/30 z-[100001] flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg relative z-[100001]">
              <button
                onClick={() => setEditOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                title="Close"
                type="button"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold mb-5 text-center">
                Edit Profile
              </h2>
              <form className="space-y-6" onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleInput}
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleInput}
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleInput}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                {/* Addresses edit */}
                <div>
                  <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
                    Addresses
                    <button
                      type="button"
                      className="ml-2 text-green-800 bg-green-100 p-1 rounded hover:bg-green-200"
                      onClick={addAddress}
                      title="Add Address"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </label>
                  <div className="space-y-4">
                    {form.addresses.map((addr, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 p-3 rounded flex flex-col gap-2 relative border"
                      >
                        <button
                          type="button"
                          className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                          onClick={() => removeAddress(idx)}
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <input
                          name="line1"
                          placeholder="Address Line 1"
                          value={addr.line1}
                          onChange={(e) => handleAddrChange(idx, e)}
                          className="border p-2 rounded"
                          required
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            name="city"
                            placeholder="City"
                            value={addr.city}
                            onChange={(e) => handleAddrChange(idx, e)}
                            className="border p-2 rounded"
                            required
                          />
                          <input
                            name="state"
                            placeholder="State"
                            value={addr.state}
                            onChange={(e) => handleAddrChange(idx, e)}
                            className="border p-2 rounded"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            name="postalCode"
                            placeholder="Postal Code"
                            value={addr.postalCode}
                            onChange={(e) => handleAddrChange(idx, e)}
                            className="border p-2 rounded"
                            required
                          />
                          <input
                            name="country"
                            placeholder="Country"
                            value={addr.country}
                            onChange={(e) => handleAddrChange(idx, e)}
                            className="border p-2 rounded"
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {error && (
                  <div className="text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="text-green-700 bg-green-50 p-2 rounded flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Profile updated!
                  </div>
                )}
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditOpen(false)}
                    className="px-5 py-2 border border-gray-300 rounded bg-white hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-green-800 text-white rounded hover:bg-green-700 flex items-center gap-2"
                    disabled={formLoading}
                  >
                    <Save className="w-5 h-5" />
                    {formLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ------ Modal for adding/editing payment methods ------ */}
      {(addPaymentOpen || editPaymentIdx !== null) &&
        createPortal(
          <div className="fixed inset-0 bg-black/30 z-[100001] flex items-center justify-center">
            <form
              className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative z-[100001] space-y-4"
              onSubmit={addPaymentOpen ? handleAddPayment : handleEditPayment}
            >
              <button
                onClick={() => {
                  setAddPaymentOpen(false);
                  setEditPaymentIdx(null);
                  setPaymentForm(emptyPayment);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                title="Close"
                type="button"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold mb-3 text-center">
                {addPaymentOpen ? "Add Payment Method" : "Edit Payment Method"}
              </h2>
              <input
                name="brand"
                placeholder="Brand (Visa, Mastercard, etc)"
                value={paymentForm.brand}
                onChange={handlePaymentInput}
                className="w-full border p-2 rounded"
                required
              />
              <input
                name="cardholderName"
                placeholder="Cardholder Name"
                value={paymentForm.cardholderName}
                onChange={handlePaymentInput}
                className="w-full border p-2 rounded"
                required
              />
              <input
                name="cardNumber"
                placeholder="Card Number (last 4 digits)"
                value={paymentForm.cardNumber}
                maxLength={4}
                onChange={handlePaymentInput}
                className="w-full border p-2 rounded"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="expMonth"
                  type="number"
                  placeholder="Exp. Month"
                  value={paymentForm.expMonth}
                  onChange={handlePaymentInput}
                  min={1}
                  max={12}
                  className="border p-2 rounded"
                  required
                />
                <input
                  name="expYear"
                  type="number"
                  placeholder="Exp. Year"
                  value={paymentForm.expYear}
                  onChange={handlePaymentInput}
                  min={2024}
                  max={2100}
                  className="border p-2 rounded"
                  required
                />
              </div>
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setAddPaymentOpen(false);
                    setEditPaymentIdx(null);
                    setPaymentForm(emptyPayment);
                  }}
                  className="px-5 py-2 border border-gray-300 rounded bg-white hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-800 text-white rounded hover:bg-green-700 flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save
                </button>
              </div>
            </form>
          </div>,
          document.body
        )}

      {/* ------ Cart Modification Modal as Portal ------ */}
      {showCartModal &&
        createPortal(
          cartLoading ? (
            <div className="fixed inset-0 z-[100001] flex items-center justify-center bg-black/40">
              <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
                <div className="animate-spin h-8 w-8 border-4 border-green-800 border-t-transparent rounded-full mb-4" />
                <span className="text-green-800 font-semibold">
                  Loading your cart…
                </span>
              </div>
            </div>
          ) : (
            <CartModificationModal
              cartItems={cartItems}
              onConfirm={() => {
                setShowCartModal(false);
                navigate("/questionnaire");
              }}
              onClose={() => setShowCartModal(false)}
            />
          ),
          document.body
        )}
    </div>
  );
};

export default Account;
