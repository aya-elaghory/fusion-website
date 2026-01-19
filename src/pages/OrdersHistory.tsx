// src/pages/OrderHistory.tsx
import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchProducts } from "@/slices/productsSlice";
import { fetchProfile } from "@/slices/profileSlice";
import { fetchOrders } from "@/slices/ordersSlice";
import {
  Clock,
  PackageSearch,
  ShoppingBag,
  XCircle,
  CreditCard,
} from "lucide-react";

// Helper for status tag
const statusClass = (status: string = "") => {
  switch (status.toLowerCase()) {
    case "completed":
    case "fulfilled":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "paid":
    case "in progress":
    case "processing":
      return "bg-yellow-100 text-yellow-900";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
const statusLabel = (status: string = "") =>
  status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending";

const OrderHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => state.profile.profile);
  const products = useSelector((state: RootState) => state.products.products);
  const loadingProducts = useSelector(
    (state: RootState) => state.products.loading
  );

  const orders = useSelector((state: RootState) => state.orders.orders);
  const ordersLoading = useSelector((state: RootState) => state.orders.loading);
  const ordersError = useSelector((state: RootState) => state.orders.error);

  // Fetch products/profile if not loaded
  useEffect(() => {
    if (!products.length) dispatch(fetchProducts());
    if (!profile) dispatch(fetchProfile());
    // eslint-disable-next-line
  }, [dispatch, products.length, profile]);

  // Fetch orders only if orders in redux are empty
  useEffect(() => {
    if (!orders.length && !ordersLoading && !ordersError) {
      dispatch(fetchOrders());
    }
    // eslint-disable-next-line
  }, [dispatch, orders.length, ordersLoading, ordersError]);

  // Memoize product map for lookup
  const productMap = useMemo(() => {
    const map = new Map();
    products.forEach((p) => map.set(p._id, p));
    return map;
  }, [products]);

  if (loadingProducts || ordersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin h-10 w-10 border-4 border-green-800 border-t-transparent rounded-full" />
        <span className="ml-3 text-gray-600">Loading orders...</span>
      </div>
    );
  }
  if (ordersError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <XCircle className="w-10 h-10 text-red-500 mb-2" />
        <p className="text-red-600">{ordersError}</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center">
        <PackageSearch className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          No Orders Yet
        </h1>
        <p className="text-gray-500">You haven’t placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 mt-12">
      <h1 className="text-3xl font-bold text-black mb-8 flex items-center gap-3">
        <ShoppingBag className="w-7 h-7 text-green-800" /> Orders History
      </h1>
      <div className="space-y-7">
        {orders
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 relative"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  Order{" "}
                  <span className="text-green-800">
                    #{order._id.slice(-6).toUpperCase()}
                  </span>
                </h2>
                <div className="flex items-center text-gray-500 text-sm gap-2 mt-1 sm:mt-0">
                  <Clock className="w-4 h-4" />
                  {new Date(order.createdAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5 mb-4">
                {/* Products */}
                <div>
                  <h3 className="font-medium mb-1 text-gray-700">Products</h3>
                  <ul className="space-y-3">
                    {order.items.map((item: any) => {
                      const prod = productMap.get(item.product);
                      return (
                        <li
                          key={item.product}
                          className="flex items-center gap-3 bg-gray-50 p-2 rounded"
                        >
                          <img
                            src={prod?.imageUrl || "/assets/placeholder.png"}
                            alt={prod?.name || "Product"}
                            className="w-12 h-12 rounded object-cover border"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">
                              {prod?.name || "Product"}
                            </span>
                            <span className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-xs text-gray-500">
                              {prod?.type} · ${prod?.price}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {/* Payment & Totals */}
                <div>
                  <h3 className="font-medium mb-1 text-gray-700">
                    Payment & Total
                  </h3>
                  <div className="text-gray-900 font-bold text-lg mb-1">
                    ${order.totalAmount?.toFixed(2)}
                  </div>
                  {order.paymentDetails && (
                    <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 mb-1">
                      {order.paymentDetails.brand && (
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          {order.paymentDetails.brand} ····
                          {order.paymentDetails.cardNumber}
                        </div>
                      )}
                      {order.paymentDetails.cardholderName && (
                        <div>
                          Cardholder: {order.paymentDetails.cardholderName}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mt-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border transition-all shadow-sm ${statusClass(
                        order.status
                      )}`}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </div>
                </div>
              </div>
              {/* Optional: Add more order info here */}
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrderHistory;
