// src/pages/AdminOrders.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "@/services/api";
import { RootState } from "@/store";
import {
  User,
  Clock,
  CheckCircle,
  X as XIcon,
  Loader2,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout as logoutAction } from "@/slices/authSlice";

const ORDER_STATUSES = [
  {
    value: "pending",
    label: "Pending",
    icon: <Clock className="w-4 h-4 text-yellow-500 inline" />,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: <User className="w-4 h-4 text-blue-500 inline" />,
  },
  {
    value: "completed",
    label: "Completed",
    icon: <CheckCircle className="w-4 h-4 text-green-600 inline" />,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: <XIcon className="w-4 h-4 text-red-500 inline" />,
  },
];

function getStatusIcon(status: string) {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4 text-yellow-500 inline" />;
    case "in progress":
      return <User className="w-4 h-4 text-blue-500 inline" />;
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-600 inline" />;
    case "cancelled":
      return <XIcon className="w-4 h-4 text-red-500 inline" />;
    default:
      return null;
  }
}

// --- Helpers: sort newest first ---
const getOrderTimestamp = (o: any): number => {
  if (o?.createdAt) {
    const t = new Date(o.createdAt).getTime();
    if (!Number.isNaN(t)) return t;
  }
  // Fallback: extract timestamp from Mongo ObjectId (first 4 bytes = seconds since epoch)
  if (o?._id && typeof o._id === "string" && o._id.length >= 8) {
    const seconds = parseInt(o._id.substring(0, 8), 16);
    if (!Number.isNaN(seconds)) return seconds * 1000;
  }
  return 0;
};

const sortOrdersDesc = (arr: any[]) =>
  [...arr].sort((a, b) => getOrderTimestamp(b) - getOrderTimestamp(a));

const AdminOrders: React.FC = () => {
  const products = useSelector((state: RootState) => state.products.products);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lock/unlock body scroll when modal open/close
  useEffect(() => {
    if (zoomedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [zoomedImage]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!zoomedImage) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomedImage(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [zoomedImage]);

  useEffect(() => {
    setLoading(true);
    api
      .get("/orders/all")
      .then((res) => setOrders(sortOrdersDesc(res.data)))
      .catch(() => setError("Failed to fetch orders"))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingOrderId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        sortOrdersDesc(
          prev.map((order) =>
            order._id === orderId ? { ...order, status } : order
          )
        )
      );
    } catch {
      alert("Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore errors on logout (may already be logged out)
    }
    dispatch(logoutAction());
    navigate("/login");
  };

  // If anything ever changes the array order, this guarantees newest-first rendering
  const sortedOrders = useMemo(() => sortOrdersDesc(orders), [orders]);

  if (loading)
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        Loading orders...
      </div>
    );

  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 mt-28 lg:mt-16 relative">
      {/* Centered header with logout on the right */}
      <div className="flex items-center justify-center mb-8 relative">
        <h1 className="text-3xl font-bold text-center w-full">
          Admin – All Orders
        </h1>
        <button
          onClick={handleLogout}
          className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-red-100 text-red-700 font-semibold px-4 py-2 rounded hover:bg-red-200 transition"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

      <div className="space-y-7">
        {sortedOrders.map((order) => (
          <div key={order._id} className="bg-white shadow p-5 rounded-xl mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-lg">
                #{order._id.slice(-6).toUpperCase()}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <User className="w-4 h-4 text-green-800" />
              {order.user?.email} ({order.user?.firstName}{" "}
              {order.user?.lastName})
            </div>

            <div className="mb-2">
              <span className="font-semibold">Total: </span>$
              {order.totalAmount?.toFixed(2)}
            </div>

            <div className="mb-2 flex items-center gap-2">
              <span className="font-semibold">Status: </span>
              <span>{getStatusIcon(order.status)}</span>
              <select
                value={order.status || "pending"}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="border rounded p-1 text-sm"
                disabled={updatingOrderId === order._id}
              >
                {ORDER_STATUSES.map((statusOpt) => (
                  <option key={statusOpt.value} value={statusOpt.value}>
                    {statusOpt.label}
                  </option>
                ))}
              </select>
              {updatingOrderId === order._id && (
                <Loader2 className="w-4 h-4 animate-spin text-green-800 ml-2" />
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-2">Products:</h4>
              <ul className="space-y-3">
                {order.items.map((item: any, idx: number) => {
                  const product = products.find((p) => p._id === item.product);
                  return (
                    <li key={idx} className="flex gap-4 items-center">
                      <img
                        src={product?.imageUrl || "/assets/placeholder.png"}
                        alt={product?.name || "Product"}
                        className="w-16 h-16 rounded object-cover border"
                      />
                      <div>
                        <div className="font-semibold">
                          {product?.name || "Product"}
                        </div>
                        <div className="text-xs text-gray-600">
                          Ingredients:{" "}
                          {product?.ingredients?.length
                            ? product.ingredients
                                .map((ing) =>
                                  ing.percentage
                                    ? `${ing.name} (${(ing as any).percentage})`
                                    : ing.name
                                )
                                .join(", ")
                            : "N/A"}
                        </div>
                        <div className="text-xs">
                          Qty: {item.quantity}, Price: ${item.price}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Uploaded photos */}
            {order.photos && order.photos.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Uploaded Photos:</h4>
                <div className="flex flex-wrap gap-3">
                  {order.photos.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setZoomedImage(img)}
                      className="group border-none bg-transparent p-0"
                      tabIndex={0}
                      aria-label={`Zoom photo ${idx + 1}`}
                    >
                      <img
                        src={img}
                        alt={`Order Photo ${idx + 1}`}
                        className="w-24 h-24 object-cover rounded border cursor-zoom-in transition group-hover:scale-110"
                        style={{ transition: "transform 0.2s" }}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Click any image to zoom.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Zoom Modal Overlay */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 mb-60"
          style={{
            cursor: "zoom-out",
            boxSizing: "border-box",
            paddingBottom: "max(3rem, 7vh)",
            paddingTop: "max(3rem, 7vh)",
          }}
          onClick={() => setZoomedImage(null)}
        >
          <img
            src={zoomedImage}
            alt="Zoomed Order"
            className="max-w-full max-h-[80vh] rounded-lg shadow-2xl border-4 border-white"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              maxHeight: "80vh",
              maxWidth: "96vw",
              objectFit: "contain",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
