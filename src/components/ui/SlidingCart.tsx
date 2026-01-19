// src/components/features/SlidingCart.tsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "@/store";
import {
  fetchCart,
  updateQuantity,
  removeFromCart,
  addToCartThunk,
  removeFromCartThunk,
  updateCartQuantityThunk,
  CartItem,
} from "@/slices/cartSlice";
import { X, Loader2 } from "lucide-react";
import { setIncompleteVisit, updateProfile } from "@/slices/profileSlice";
import api from "@/services/api";

interface SlidingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const BUSY_TIMEOUT_MS = 15000; // auto-unlock if sync takes too long

const SlidingCart: React.FC<SlidingCartProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const items = useSelector((s: RootState) => s.cart.items);
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);
  const { hasFetched, loading } = useSelector((s: RootState) => s.cart);

  const [error, setError] = useState<string | null>(null);

  const wasAuthed = useRef(isAuthenticated);
  const initialFocusRef = useRef<HTMLButtonElement | null>(null);

  // Busy flags
  const [merging, setMerging] = useState(false);   // login merge
  const [blocking, setBlocking] = useState(false); // checkout sync lock
  const mergeInFlightRef = useRef(false);
  const busyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---------- Effects ----------

  // Trap body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [isOpen]);

  // Focus close button when opening (a11y)
  useEffect(() => {
    if (isOpen && initialFocusRef.current) {
      initialFocusRef.current.focus();
    }
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Reset transient state on open to avoid "locked" drawer on return
  useEffect(() => {
    if (isOpen) {
      setBlocking(false);
      setMerging(false);
      setError(null);
      if (!hasFetched && isAuthenticated) {
        // hydrate once per session after login
        dispatch(fetchCart());
      }
    } else {
      // cleanup any timeout when closing
      if (busyTimerRef.current) {
        clearTimeout(busyTimerRef.current);
        busyTimerRef.current = null;
      }
    }
  }, [isOpen, isAuthenticated, hasFetched, dispatch]);

  // Auto-unlock if blocking or merging hangs too long
  useEffect(() => {
    if (!(blocking || merging)) {
      if (busyTimerRef.current) {
        clearTimeout(busyTimerRef.current);
        busyTimerRef.current = null;
      }
      return;
    }
    if (busyTimerRef.current) clearTimeout(busyTimerRef.current);
    busyTimerRef.current = setTimeout(() => {
      setBlocking(false);
      setMerging(false);
      setError("Took too long to sync your cart. Please try again.");
    }, BUSY_TIMEOUT_MS);
    return () => {
      if (busyTimerRef.current) {
        clearTimeout(busyTimerRef.current);
        busyTimerRef.current = null;
      }
    };
  }, [blocking, merging]);

  // Merge local -> server after login (idempotent)
  useEffect(() => {
    const justLoggedIn = isAuthenticated && !wasAuthed.current;
    if (justLoggedIn && !mergeInFlightRef.current) {
      mergeInFlightRef.current = true;
      (async () => {
        setMerging(true);
        try {
          const local = items.map((it) => ({ ...it }));
          await syncCartToServer(local, { refreshRedux: true });
        } catch {
          setError("Couldn't merge your cart after login. Some items may be missing.");
        } finally {
          setMerging(false);
          mergeInFlightRef.current = false;
        }
      })();
    }
    wasAuthed.current = isAuthenticated;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, items]);

  // ---------- Sync helpers ----------

  // Read server cart WITHOUT touching Redux (prevents flicker)
  const readServerCartNoRedux = async (): Promise<CartItem[]> => {
    const res = await api.get("/cart");
    const raw = res?.data?.items ?? [];
    return raw.map((it: any) => {
      const prod = it?.product ?? it ?? {};
      const id = prod._id || prod.id || it?.productId || it?.id || "";
      return {
        id,
        name: prod.name || "",
        price: prod.price ? `$${Number(prod.price).toFixed(2)}` : "$0.00",
        imageSrc: prod.imageUrl || "",
        quantity: it.quantity ?? it.qty ?? 1,
      } as CartItem;
    });
  };

  /**
   * Safely sync local cart to server sequentially to avoid Mongoose VersionError.
   * refreshRedux:
   *   - true  => refresh Redux state after sync (login merge)
   *   - false => don't refresh Redux (checkout, to avoid flicker before navigating)
   */
  const syncCartToServer = async (
    localItems: CartItem[],
    { refreshRedux }: { refreshRedux: boolean }
  ) => {
    const serverItems = await readServerCartNoRedux();
    const serverQty = new Map<string, number>();
    for (const it of serverItems) serverQty.set(it.id, it.quantity);

    for (const it of localItems) {
      const srv = serverQty.get(it.id) ?? 0;
      if (srv === 0) {
        await dispatch(addToCartThunk({ productId: it.id, quantity: it.quantity })).unwrap();
      } else if (srv !== it.quantity) {
        await dispatch(updateCartQuantityThunk({ productId: it.id, quantity: it.quantity })).unwrap();
      }
    }

    // Optional: remove extras that exist on server but not locally
    // for (const [serverId] of serverQty) {
    //   if (!localItems.find(li => li.id === serverId)) {
    //     await dispatch(removeFromCartThunk({ productId: serverId })).unwrap();
    //   }
    // }

    if (refreshRedux) {
      await dispatch(fetchCart());
    }
  };

  // ---------- Actions ----------

  const handleRemove = (id: string) => {
    if (!isAuthenticated) {
      onClose();
      navigate("/login");
      return;
    }
    if (blocking || merging) return;
    dispatch(removeFromCart(id));
    dispatch(removeFromCartThunk({ productId: id })).catch(() =>
      setError("Failed to remove item from cart.")
    );
  };

  const handleQuantityChange = (id: string, qty: number) => {
    if (!isAuthenticated) {
      onClose();
      navigate("/login");
      return;
    }
    if (blocking || merging) return;
    const quantity = Math.max(1, Number.isFinite(qty) ? qty : 1);
    dispatch(updateQuantity({ id, quantity }));
    dispatch(updateCartQuantityThunk({ productId: id, quantity })).catch(() =>
      setError("Failed to update quantity.")
    );
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (!isAuthenticated) {
      onClose();
      // ⬇️ carry intent so Login can route to Questionnaire
      navigate("/login", { state: { from: "/checkout", intent: "checkout" } });
      return;
    }
    setBlocking(true);
    try {
      await syncCartToServer(items, { refreshRedux: false });
      dispatch(setIncompleteVisit(true));
      dispatch(updateProfile({ incompleteVisit: true })).catch(() => {
        setError("Saved locally. Failed to persist visit status.");
      });
      onClose();
      navigate("/questionnaire");
    } catch {
      setError("Error syncing cart with server. Try again.");
    } finally {
      // Always unlock UI even if we navigated away; prevents "locked" drawer next time
      setBlocking(false);
    }
  };

  const handleDrawerClick = (e: React.MouseEvent) => e.stopPropagation();

  const isBusy = merging || blocking;
  const disableCheckout = items.length === 0 || isBusy;
  const showSpinnerOnly = items.length === 0 && (loading || merging);

  // ---------- Render in a Portal to avoid clipping/z-index issues ----------
  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop (below drawer) */}
      <div
        className="fixed inset-0 bg-black/40 z-[100000]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`
          fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out
          translate-x-0 z-[100001] flex flex-col
        `}
        onClick={handleDrawerClick}
      >
        <header className="p-6 border-b flex justify-between items-center bg-gray-50 flex-shrink-0">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <button
            ref={initialFocusRef}
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-700"
            aria-label="Close cart"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </header>

        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {(loading || merging) && items.length > 0 ? (
            <div className="text-xs text-gray-500 -mt-2 mb-2">
              {merging ? "Syncing your items…" : "Updating your cart…"}
            </div>
          ) : null}

          {showSpinnerOnly ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-8 w-8 text-green-800" />
            </div>
          ) : items.length ? (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center bg-gray-100 p-4 rounded shadow-sm hover:shadow-md transition"
              >
                <img
                  src={item.imageSrc}
                  alt={item.name}
                  className="h-14 w-14 object-cover mr-4 rounded"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.price}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      disabled={isBusy}
                      onChange={(e) => handleQuantityChange(item.id, +e.target.value)}
                      className="w-20 border border-gray-300 p-1 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 focus:ring-offset-1 disabled:opacity-60"
                    />
                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={isBusy}
                      className="text-red-500 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 rounded disabled:opacity-60"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">Your cart is empty.</p>
          )}
        </div>

        <footer className="p-6 border-t bg-white sticky bottom-0 flex-shrink-0">
          {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
          <button
            onClick={handleCheckout}
            disabled={disableCheckout}
            aria-busy={isBusy}
            className={[
              "w-full inline-flex items-center justify-center min-w-40 px-6 py-3",
              "text-base font-semibold text-white",
              disableCheckout
                ? "bg-primary/60 cursor-not-allowed"
                : "bg-primary hover:bg-primary-hover",
              "shadow-md hover:shadow-lg",
              "transition-colors duration-200 focus:outline-none focus-visible:ring-2",
              "focus-visible:ring-offset-2 focus-visible:ring-primary",
              "active:scale-[0.98] disabled:active:scale-100",
            ].join(" ")}
          >
            {isBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isBusy ? "Preparing…" : "Checkout"}
          </button>
        </footer>
      </div>
    </>,
    document.body
  );
};

export default SlidingCart;
