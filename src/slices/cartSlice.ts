import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";

export type PurchaseOption = "REFILL_2M" | "ONE_TIME";

export interface CartItem {
  id: string; // Prisma Product.id
  imageSrc: string;
  name: string;
  price: string; // UI only
  quantity: number;
  purchaseOption: PurchaseOption;
}

interface CartState {
  items: CartItem[];
  addConsultation: boolean;
  loading: boolean;
  hasFetched: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  addConsultation: false,
  loading: false,
  hasFetched: false,
  error: null,
};

const centsToDollarsString = (cents?: number) =>
  `$${(((cents ?? 0) as number) / 100).toFixed(2)}`;

function normalizeCartItems(rawItems: any[]): CartItem[] {
  return (rawItems ?? []).map((row: any) => {
    const prod = row.product ?? row;

    const id = String(prod.id ?? row.productId ?? "");
    const name = String(prod.name ?? "");
    const imageSrc = String(prod.imageUrl ?? prod.imageSrc ?? "");

    const purchaseOption: PurchaseOption =
      (row.purchaseOption as PurchaseOption) ?? "ONE_TIME";

    const price =
      purchaseOption === "REFILL_2M"
        ? centsToDollarsString(prod.priceRefill2MCents)
        : centsToDollarsString(prod.priceOneTimeCents);

    const quantity =
      typeof row.quantity === "number" && row.quantity > 0 ? row.quantity : 1;

    return { id, name, imageSrc, price, quantity, purchaseOption };
  });
}

function extractErrorMessage(err: any) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Request failed"
  );
}

// ✅ GET /cart
export const fetchCart = createAsyncThunk<CartItem[], void, { rejectValue: string }>(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/cart");
      return normalizeCartItems(res.data?.items ?? []);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(err));
    }
  }
);

// ✅ POST /cart then refresh cart
export const addToCartThunk = createAsyncThunk<
  CartItem[],
  { productId: string; quantity: number; purchaseOption?: PurchaseOption },
  { rejectValue: string }
>("cart/addToCartThunk", async (payload, thunkAPI) => {
  try {
    if (!payload?.productId) {
      return thunkAPI.rejectWithValue("Missing productId");
    }

    await api.post("/cart", {
      productId: payload.productId,
      quantity: payload.quantity,
      purchaseOption: payload.purchaseOption ?? "ONE_TIME",
    });

    const res = await api.get("/cart");
    return normalizeCartItems(res.data?.items ?? []);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

// ✅ PUT /cart/:productId then refresh cart
export const updateCartQuantityThunk = createAsyncThunk<
  CartItem[],
  { productId: string; quantity: number; purchaseOption?: PurchaseOption },
  { rejectValue: string }
>("cart/updateCartQuantityThunk", async ({ productId, quantity, purchaseOption }, thunkAPI) => {
  try {
    if (!productId) return thunkAPI.rejectWithValue("Missing productId");

    await api.put(`/cart/${productId}`, { quantity, purchaseOption });

    const res = await api.get("/cart");
    return normalizeCartItems(res.data?.items ?? []);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

// ✅ DELETE /cart/:productId then refresh cart
export const removeFromCartThunk = createAsyncThunk<
  CartItem[],
  { productId: string; purchaseOption?: PurchaseOption },
  { rejectValue: string }
>("cart/removeFromCartThunk", async ({ productId, purchaseOption }, thunkAPI) => {
  try {
    if (!productId) return thunkAPI.rejectWithValue("Missing productId");

    await api.delete(`/cart/${productId}`, { data: { purchaseOption } });

    const res = await api.get("/cart");
    return normalizeCartItems(res.data?.items ?? []);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

// ✅ DELETE /cart then refresh cart
export const clearCartThunk = createAsyncThunk<CartItem[], void, { rejectValue: string }>(
  "cart/clearCartThunk",
  async (_, thunkAPI) => {
    try {
      await api.delete("/cart");
      const res = await api.get("/cart");
      return normalizeCartItems(res.data?.items ?? []);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(err));
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // (Optional UI-only reducers; keep if you want)
    clearCart(state) {
      state.items = [];
      state.hasFetched = false;
      state.addConsultation = false;
      state.error = null;
    },
    toggleConsultation(state, action: PayloadAction<boolean>) {
      state.addConsultation = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    const pending = (state: CartState) => {
      state.loading = true;
      state.error = null;
    };
    const fulfilled = (state: CartState, action: any) => {
      state.items = action.payload;
      state.loading = false;
      state.hasFetched = true;
      state.error = null;
    };
    const rejected = (state: CartState, action: any, fallback: string) => {
      state.loading = false;
      state.hasFetched = true;
      state.error = action.payload || action.error?.message || fallback;
    };

    builder
      // fetch
      .addCase(fetchCart.pending, pending)
      .addCase(fetchCart.fulfilled, fulfilled)
      .addCase(fetchCart.rejected, (s, a) => rejected(s, a, "Failed to fetch cart"))

      // add
      .addCase(addToCartThunk.pending, pending)
      .addCase(addToCartThunk.fulfilled, fulfilled)
      .addCase(addToCartThunk.rejected, (s, a) => rejected(s, a, "Add to cart failed"))

      // update
      .addCase(updateCartQuantityThunk.pending, pending)
      .addCase(updateCartQuantityThunk.fulfilled, fulfilled)
      .addCase(updateCartQuantityThunk.rejected, (s, a) => rejected(s, a, "Update quantity failed"))

      // remove
      .addCase(removeFromCartThunk.pending, pending)
      .addCase(removeFromCartThunk.fulfilled, fulfilled)
      .addCase(removeFromCartThunk.rejected, (s, a) => rejected(s, a, "Remove failed"))

      // clear
      .addCase(clearCartThunk.pending, pending)
      .addCase(clearCartThunk.fulfilled, fulfilled)
      .addCase(clearCartThunk.rejected, (s, a) => rejected(s, a, "Clear cart failed"));
  },
});

export const { clearCart, toggleConsultation } = cartSlice.actions;
export default cartSlice.reducer;
