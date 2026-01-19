// src/slices/ordersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";

export interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  paymentDetails?: any;
  createdAt: string;
  status?: string;
  photos?: string[];
  shippingInfo?: any;
}

export interface OrderDraft {
  items: OrderItem[];
  totalAmount: number;
  paymentDetails?: any;
  status?: string;
  photos?: string[];
  shippingInfo?: any;
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  currentOrderDraft: OrderDraft | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
  currentOrderDraft: null,
};

// -- Thunks --
export const addOrder = createAsyncThunk<Order, void, { state: { orders: OrdersState } }>(
  "orders/addOrder",
  async (_, { getState, rejectWithValue }) => {
    try {
      const draft = getState().orders.currentOrderDraft;
      if (!draft || !draft.items?.length) throw new Error("Order draft is empty");
      const res = await api.post("/orders", draft);
      return res.data as Order;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to create order"
      );
    }
  }
);

export const fetchOrders = createAsyncThunk<Order[]>(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/orders");
      return res.data as Order[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch orders"
      );
    }
  }
);

export const cancelOrder = createAsyncThunk<string, string>(
  "orders/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      await api.delete(`/orders/${orderId}`);
      return orderId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to cancel order"
      );
    }
  }
);

// -- Slice --
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrderDraft(state, action: PayloadAction<OrderDraft>) {
      state.currentOrderDraft = action.payload;
    },
    clearOrderDraft(state) {
      state.currentOrderDraft = null;
    },
    updateOrderDraft(state, action: PayloadAction<Partial<OrderDraft>>) {
      // SAFEGUARD: If the draft doesn't exist, start with an empty base
      if (!state.currentOrderDraft) {
        state.currentOrderDraft = { items: [], totalAmount: 0 };
      }
      state.currentOrderDraft = {
        ...state.currentOrderDraft,
        ...action.payload,
      };
    },
    setOrderPhotos(
      state,
      action: PayloadAction<{ orderId: string; photos: string[] }>
    ) {
      const idx = state.orders.findIndex((o) => o._id === action.payload.orderId);
      if (idx !== -1) {
        state.orders[idx].photos = action.payload.photos;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = [action.payload, ...state.orders];
        state.currentOrderDraft = null; // Clear draft after submit
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o._id !== action.payload);
      });
  },
});

export const {
  setOrderDraft,
  clearOrderDraft,
  updateOrderDraft,
  setOrderPhotos,
} = ordersSlice.actions;
export default ordersSlice.reducer;
