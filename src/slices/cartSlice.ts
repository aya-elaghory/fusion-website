import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";

export type PurchaseOption = "REFILL_2M" | "ONE_TIME";

export interface CartItem {
  id: string; // ✅ Prisma Product.id
  imageSrc: string;
  name: string;
  price: string; // "$55.00" (UI only)
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

// ✅ GET /cart (expects backend returns { items: [...] })
export const fetchCart = createAsyncThunk<CartItem[]>(
  "cart/fetchCart",
  async () => {
    const res = await api.get("/cart");
    const rawItems = res.data?.items ?? [];

    // expected row shape:
    // row = { product: { id,name,imageUrl, priceOneTimeCents, priceRefill2MCents }, quantity, purchaseOption }
    const normalized: CartItem[] = rawItems.map((row: any) => {
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

    return normalized;
  }
);

// ✅ POST /cart
export const addToCartThunk = createAsyncThunk<
  void,
  { productId: string; quantity: number; purchaseOption?: PurchaseOption }
>("cart/addToCartThunk", async ({ productId, quantity, purchaseOption }) => {
  await api.post("/cart", { productId, quantity, purchaseOption });
});

// ✅ PUT /cart/:productId
export const updateCartQuantityThunk = createAsyncThunk<
  void,
  { productId: string; quantity: number; purchaseOption?: PurchaseOption }
>("cart/updateCartQuantityThunk", async ({ productId, quantity, purchaseOption }) => {
  await api.put(`/cart/${productId}`, { quantity, purchaseOption });
});

// ✅ DELETE /cart/:productId
export const removeFromCartThunk = createAsyncThunk<
  void,
  { productId: string; purchaseOption?: PurchaseOption }
>("cart/removeFromCartThunk", async ({ productId, purchaseOption }) => {
  // if your backend ignores purchaseOption, it’s fine
  await api.delete(`/cart/${productId}`, { data: { purchaseOption } });
});

// ✅ DELETE /cart
export const clearCartThunk = createAsyncThunk<void>("cart/clearCartThunk", async () => {
  await api.delete("/cart");
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(
        (i) => i.id === action.payload.id && i.purchaseOption === action.payload.purchaseOption
      );
      if (existing) existing.quantity += action.payload.quantity;
      else state.items.push(action.payload);
    },

    removeFromCart(
      state,
      action: PayloadAction<{ id: string; purchaseOption?: PurchaseOption }>
    ) {
      state.items = state.items.filter(
        (i) =>
          !(i.id === action.payload.id &&
            (action.payload.purchaseOption ? i.purchaseOption === action.payload.purchaseOption : true))
      );
    },

    updateQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number; purchaseOption?: PurchaseOption }>
    ) {
      const it = state.items.find(
        (i) =>
          i.id === action.payload.id &&
          (action.payload.purchaseOption ? i.purchaseOption === action.payload.purchaseOption : true)
      );
      if (it) it.quantity = action.payload.quantity;
    },

    clearCart(state) {
      state.items = [];
      state.hasFetched = false;
      state.addConsultation = false;
    },

    toggleConsultation(state, action: PayloadAction<boolean>) {
      state.addConsultation = !!action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.hasFetched = true;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.hasFetched = true;
        state.error = action.error.message || "Failed to fetch cart";
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.error = action.error.message || "Add to cart failed";
      })
      .addCase(updateCartQuantityThunk.rejected, (state, action) => {
        state.error = action.error.message || "Update quantity failed";
      })
      .addCase(removeFromCartThunk.rejected, (state, action) => {
        state.error = action.error.message || "Remove failed";
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.error = action.error.message || "Clear cart failed";
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleConsultation } =
  cartSlice.actions;

export default cartSlice.reducer;
