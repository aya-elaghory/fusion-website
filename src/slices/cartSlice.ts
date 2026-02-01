import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";

export type PurchaseOption = "REFILL_2M" | "ONE_TIME";

const DEFAULT_PURCHASE_OPTION: PurchaseOption = "ONE_TIME";

export interface CartItem {
  id: string; // legacy id used in UI (product id fallback)
  productId: string; // backend product_id key used for cart ops
  lineId?: string; // backend cart line id, preferred for updates
  imageSrc: string;
  name: string;
  price: string; // UI (current selection)
  oneTimePrice?: string;
  refillPrice?: string;
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
  const fallbackImage = "/assets/Fusion_Sample_Product.jpeg";

  const toCents = (value: any): number | null => {
    if (value == null) return null;

    const cleaned = String(value)
      .replace(/[^0-9.-]/g, "")
      .trim();
    const num = typeof value === "number" ? value : parseFloat(cleaned);

    if (!Number.isFinite(num)) return null;

    // Heuristic: large values are likely already cents; small are dollars
    if (num >= 1000) return Math.round(num);
    return Math.round(num * 100);
  };

  return (rawItems ?? []).map((row: any) => {
    const prod = row.product ?? row;

    const lineId = String(row.id ?? row.cart_item_id ?? "");
    const productId = String(
      row.product_id ?? row.productId ?? prod.product_id ?? prod.id ?? "",
    );
    const id = String(prod.id ?? (productId || lineId));
    const name = String(prod.name ?? "");

    const imageSrc = String(
      prod.imageUrl ??
        prod.image_url ??
        prod.image ??
        prod.imageSrc ??
        prod.photoUrl ??
        "",
    ).trim();

    const purchaseOptionRaw = String(
      row.purchase_option ??
        row.purchaseOption ??
        prod.purchase_option ??
        prod.purchaseOption ??
        "",
    ).toUpperCase();
    const purchaseOption: PurchaseOption =
      purchaseOptionRaw === "REFILL_2M" ? "REFILL_2M" : DEFAULT_PURCHASE_OPTION;

    const quantityRaw =
      row.quantity ?? row.qty ?? prod.quantity ?? prod.qty ?? 1;
    const quantity =
      typeof quantityRaw === "number" && quantityRaw > 0 ? quantityRaw : 1;

    // Support multiple price shapes (cents, dollars, snake_case)
    const priceRefillRaw =
      prod.priceRefill2MCents ??
      prod.price_refill_2m_cents ??
      prod.priceRefill ??
      prod.price_refill ??
      prod.priceRefill2M ??
      prod.price_refill_2m ??
      row.priceRefill ??
      row.price_refill ??
      row.priceRefill2M ??
      row.price_refill_2m;

    const priceOneTimeRaw =
      prod.priceOneTimeCents ??
      prod.price_one_time_cents ??
      prod.priceOneTime ??
      prod.price_one_time ??
      prod.price ??
      prod.price_cents ??
      row.price ??
      row.price_cents ??
      row.priceCents ??
      row.priceOneTimeCents ??
      row.price_one_time_cents ??
      row.priceOneTime ??
      row.price_one_time ??
      row.unitPrice ??
      row.unit_price ??
      row.unit_price_cents ??
      row.unitPriceCents;

    const fallbackPriceRaw =
      prod.listPrice ??
      prod.list_price ??
      prod.amount ??
      row.amount ??
      row.unitPrice ??
      prod.unitPrice ??
      row.unit_price ??
      prod.unit_price;

    const totalCentsRaw = row.total_cents ?? row.totalCents;

    const rawCents = priceOneTimeRaw ?? priceRefillRaw ?? fallbackPriceRaw;

    const rawCentsNormalized = toCents(rawCents);
    const totalCentsNormalized = toCents(totalCentsRaw);
    const cents =
      rawCentsNormalized ??
      (totalCentsNormalized != null && quantity > 0
        ? Math.round(totalCentsNormalized / quantity)
        : 0);
    const oneTimeCents = rawCentsNormalized ?? cents;

    // Attempt to compute refill cents if provided, else derive: (2 * oneTime) - $11
    const refillCentsNormalized = toCents(priceRefillRaw);
    const derivedRefill =
      oneTimeCents != null ? Math.max(0, oneTimeCents * 2 - 1100) : null;
    const refillCents = refillCentsNormalized ?? derivedRefill ?? oneTimeCents;

    const activeCents =
      purchaseOption === "REFILL_2M"
        ? (refillCents ?? oneTimeCents)
        : oneTimeCents;

    const price = centsToDollarsString(activeCents ?? 0);
    const oneTimePrice = centsToDollarsString(oneTimeCents ?? 0);
    const refillPrice = centsToDollarsString(refillCents ?? oneTimeCents ?? 0);

    return {
      id,
      productId: productId || id,
      lineId: lineId || undefined,
      name,
      imageSrc: imageSrc || fallbackImage,
      price,
      oneTimePrice,
      refillPrice,
      quantity,
      purchaseOption,
    };
  });
}

function extractErrorMessage(err: any) {
  const data = err?.response?.data;
  const arrayError =
    Array.isArray(data?.errors) && data.errors.length
      ? data.errors[0]?.message || data.errors[0]
      : null;

  return (
    arrayError ||
    data?.message ||
    data?.error ||
    err?.message ||
    "Request failed"
  );
}

// ✅ GET /cart
export const fetchCart = createAsyncThunk<
  CartItem[],
  void,
  { rejectValue: string }
>("cart/fetchCart", async (_, thunkAPI) => {
  try {
    // Trailing slash prevents backend redirects that break CORS in dev
    const res = await api.get("/cart/");
    return normalizeCartItems(res.data?.items ?? []);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

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

    console.log("🛒 addToCartThunk payload:", payload);
    console.log("🛒 Backend URL:", api.defaults.baseURL);

    const normalizedPurchaseOption =
      payload.purchaseOption ?? DEFAULT_PURCHASE_OPTION;
    const productIdNormalized = String(payload.productId);

    // Use trailing slash to avoid redirects (301/307) that can trigger CORS
    // Match backend shape exactly: snake_case keys only
    await api.post("/cart/", {
      product_id: productIdNormalized,
      quantity: payload.quantity,
      purchase_option: normalizedPurchaseOption,
    });

    const res = await api.get("/cart/");
    return normalizeCartItems(res.data?.items ?? []);
  } catch (err: any) {
    console.error("🛒 Full error object:", {
      status: err.response?.status,
      message: err.response?.data?.message,
      data: err.response?.data,
      config: err.config,
    });
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

// ✅ PUT /cart/:productId then refresh cart
export const updateCartQuantityThunk = createAsyncThunk<
  CartItem[],
  {
    productId: string;
    lineId?: string;
    quantity: number;
    purchaseOption?: PurchaseOption;
  },
  { rejectValue: string }
>(
  "cart/updateCartQuantityThunk",
  async ({ productId, lineId, quantity, purchaseOption }, thunkAPI) => {
    try {
      const targetId = lineId || productId;
      if (!targetId)
        return thunkAPI.rejectWithValue("Missing product/cart line id");

      const normalizedPurchaseOption =
        purchaseOption ?? DEFAULT_PURCHASE_OPTION;

      // Debug signal in console to verify base URL and token presence when qty updates fail
      const tokenDebug =
        localStorage.getItem("token") || localStorage.getItem("access_token");
      console.log("🛒 updateCartQuantity", {
        baseURL: api.defaults.baseURL,
        hasToken: !!tokenDebug,
        purchaseOption: normalizedPurchaseOption,
      });

      // Use cart line id when present; backend path is /cart/{id}
      await api.put(`/cart/${targetId}`, {
        product_id: productId,
        quantity,
        purchase_option: normalizedPurchaseOption,
      });

      const res = await api.get("/cart/");
      return normalizeCartItems(res.data?.items ?? []);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(err));
    }
  },
);

// ✅ DELETE /cart/:productId then refresh cart
export const removeFromCartThunk = createAsyncThunk<
  CartItem[],
  { productId: string; lineId?: string; purchaseOption?: PurchaseOption },
  { rejectValue: string }
>(
  "cart/removeFromCartThunk",
  async ({ productId, lineId, purchaseOption }, thunkAPI) => {
    try {
      const targetId = lineId || productId;
      if (!targetId)
        return thunkAPI.rejectWithValue("Missing product/cart line id");

      const normalizedPurchaseOption =
        purchaseOption ?? DEFAULT_PURCHASE_OPTION;

      // Debug signal in console for remove flow
      const tokenDebug =
        localStorage.getItem("token") || localStorage.getItem("access_token");
      console.log("🛒 removeFromCart", {
        baseURL: api.defaults.baseURL,
        hasToken: !!tokenDebug,
        purchaseOption: normalizedPurchaseOption,
      });

      // Request deletion without scoping to purchaseOption to clear item fully
      // Backend expects /cart/{id} (no trailing slash)
      await api.delete(`/cart/${targetId}`, {
        data: {
          product_id: productId,
          purchase_option: normalizedPurchaseOption,
        },
      });

      const res = await api.get("/cart/");
      return normalizeCartItems(res.data?.items ?? []);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(err));
    }
  },
);

// ✅ DELETE /cart then refresh cart
export const clearCartThunk = createAsyncThunk<
  CartItem[],
  void,
  { rejectValue: string }
>("cart/clearCartThunk", async (_, thunkAPI) => {
  try {
    await api.delete("/cart/");
    const res = await api.get("/cart/");
    return normalizeCartItems(res.data?.items ?? []);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

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
    // ✅ ADD THIS - simple action for addToCart
    addToCart(state, action: PayloadAction<CartItem>) {
      const purchaseOption =
        action.payload.purchaseOption ?? DEFAULT_PURCHASE_OPTION;
      const existing = state.items.find(
        (item) =>
          (item.lineId && action.payload.lineId
            ? item.lineId === action.payload.lineId
            : item.productId === action.payload.productId) &&
          item.purchaseOption === purchaseOption,
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push({ ...action.payload, purchaseOption });
      }
    },
    // ✅ ADD THIS - simple action for removeFromCart
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) =>
          item.lineId !== action.payload && item.productId !== action.payload,
      );
    },
    // ✅ ADD THIS - simple action for updateQuantity
    updateQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) {
      const item = state.items.find(
        (item) =>
          item.lineId === action.payload.id ||
          item.productId === action.payload.id,
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
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
      .addCase(fetchCart.rejected, (s, a) =>
        rejected(s, a, "Failed to fetch cart"),
      )

      // add
      .addCase(addToCartThunk.pending, pending)
      .addCase(addToCartThunk.fulfilled, fulfilled)
      .addCase(addToCartThunk.rejected, (s, a) =>
        rejected(s, a, "Add to cart failed"),
      )

      // update
      .addCase(updateCartQuantityThunk.pending, pending)
      .addCase(updateCartQuantityThunk.fulfilled, fulfilled)
      .addCase(updateCartQuantityThunk.rejected, (s, a) =>
        rejected(s, a, "Update quantity failed"),
      )

      // remove
      .addCase(removeFromCartThunk.pending, pending)
      .addCase(removeFromCartThunk.fulfilled, fulfilled)
      .addCase(removeFromCartThunk.rejected, (s, a) =>
        rejected(s, a, "Remove failed"),
      )

      // clear
      .addCase(clearCartThunk.pending, pending)
      .addCase(clearCartThunk.fulfilled, fulfilled)
      .addCase(clearCartThunk.rejected, (s, a) =>
        rejected(s, a, "Clear cart failed"),
      );
  },
});

export const {
  clearCart,
  toggleConsultation,
  addToCart,
  removeFromCart,
  updateQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
