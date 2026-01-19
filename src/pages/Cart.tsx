// src/pages/Cart.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store";
import { removeFromCart, updateQuantity, toggleConsultation } from "@/slices/cartSlice";
import LoginSlice from "./Login";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state: RootState) => state.cart?.items || []);
  const addConsultation = useSelector((state: RootState) => state.cart.addConsultation);

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const profile = useSelector((state: RootState) => state.profile.profile);
  const profileLoading = useSelector((state: RootState) => state.profile.loading);
  const profileHasFetched = useSelector((state: RootState) => state.profile.hasFetched);

  const [showLoginModal, setShowLoginModal] = useState(false);

  // ✅ Only decide first-time AFTER profile fetch
  const isFirstTimeBuyer =
    profileHasFetched && profile ? Boolean(profile.incompleteVisit) : false;

  // ✅ Enforce consultation ON for first-time buyers (after profile fetch)
  useEffect(() => {
    if (!profileHasFetched) return;
    if (isFirstTimeBuyer && !addConsultation) {
      dispatch(toggleConsultation(true));
    }
  }, [profileHasFetched, isFirstTimeBuyer, addConsultation, dispatch]);

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item: any) => {
      const priceNumber =
        typeof item.price === "string"
          ? parseFloat(item.price.replace("$", "").replace("/mo.", "")) || 0
          : Number(item.price) || 0;
      return total + priceNumber * (Number(item.quantity) || 1);
    }, 0);
  }, [cartItems]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // ✅ If profile still loading, do NOT continue to checkout yet
    if (profileLoading || !profileHasFetched) {
      return;
    }

    // ✅ Safety check (first-time must have consultation)
    if (isFirstTimeBuyer && !addConsultation) {
      dispatch(toggleConsultation(true));
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            {/* ✅ CONSULTATION SECTION */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4"
                  checked={profileHasFetched && isFirstTimeBuyer ? true : addConsultation}
                  disabled={!profileHasFetched || isFirstTimeBuyer}
                  onChange={(e) => dispatch(toggleConsultation(e.target.checked))}
                />

                <div>
                  <p className="font-semibold text-gray-900">Add Consultation</p>

                  {!profileHasFetched ? (
                    <p className="text-sm text-gray-600 mt-1">
                      Loading your profile to confirm if consultation is required...
                    </p>
                  ) : isFirstTimeBuyer ? (
                    <p className="text-sm text-red-600 mt-1">
                      First-time buyers must include a consultation to complete the order.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">
                      Optional for returning buyers.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* CART ITEMS */}
            <div className="space-y-6">
              {cartItems.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center bg-white p-4 rounded-lg shadow-md"
                >
                  <img
                    src={item.imageSrc}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h2>
                    <p className="text-gray-600">{item.price}</p>

                    <div className="flex items-center mt-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className="bg-gray-200 px-2 py-1 rounded-l-md"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-gray-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="bg-gray-200 px-2 py-1 rounded-r-md"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Total: ${totalPrice.toFixed(2)}/mo.
              </h2>

              <button
                onClick={handleCheckout}
                disabled={profileLoading || !profileHasFetched}
                className="mt-4 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 disabled:opacity-60"
              >
                {profileLoading || !profileHasFetched
                  ? "Loading..."
                  : "Proceed to Checkout"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              >
                <X className="h-6 w-6" />
              </button>
              <LoginSlice />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
