import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export type ProductType = "RX" | "OTC";

export interface ProductIngredient {
  name: string;
  description: string;
  howItWorks: string;
}

export interface FormulationIngredient {
  ingredientName: string;
  percentage: string;
}

export interface ProductFormulation {
  formulaName: string;
  ingredients: FormulationIngredient[];
}

export interface ProductPair {
  name: string;
  description: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface Product {
  id: string; // e.g. "68d907e7fba6e61ba6e9dc8b"
  name: string;
  description: string;
  price: number | null; // dollars; keep for legacy uses
  priceOneTimeCents?: number | null;
  priceRefill2MCents?: number | null;
  type: ProductType;
  imageUrl: string;

  ingredients: ProductIngredient[];
  formulations: ProductFormulation[];

  concerns: string[];
  photos: string[];

  topIcon: string;
  sideIcon: string;

  howWhy: string;
  howToUse: string;
  pairsWith: ProductPair[];
  faqs?: ProductFaq[];
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

const normalizeProduct = (item: Record<string, unknown>): Product => {
  const toStringArray = (value: unknown) =>
    Array.isArray(value) ? value.map((v) => String(v)) : [];

  const ingredients = Array.isArray(item.ingredients)
    ? (item.ingredients as ProductIngredient[])
    : [];

  const formulations = Array.isArray(item.formulations)
    ? (item.formulations as ProductFormulation[])
    : [];

  const pairsWith = Array.isArray(item.pairsWith)
    ? (item.pairsWith as ProductPair[])
    : [];

  const faqs = Array.isArray((item as any).faqs)
    ? ((item as any).faqs as ProductFaq[]).map((faq) => ({
        question: String((faq as any).question || ""),
        answer: String((faq as any).answer || ""),
      }))
    : [];

  const rawPrice = item.price;
  const price =
    typeof rawPrice === "number"
      ? rawPrice
      : rawPrice == null
        ? null
        : Number(rawPrice);

  const priceOneTimeCents = (() => {
    const direct =
      (item as any).priceOneTimeCents ??
      (item as any).price_one_time_cents ??
      (item as any).price_cents;
    if (typeof direct === "number") return direct;
    if (price != null && Number.isFinite(price)) return Math.round(price * 100);
    return null;
  })();

  const priceRefill2MCents = (() => {
    const direct =
      (item as any).priceRefill2MCents ??
      (item as any).price_refill_2m_cents ??
      (item as any).priceRefill ??
      (item as any).price_refill;
    if (typeof direct === "number") return direct;
    return null;
  })();

  return {
    id: String(
      (item.id as string | undefined) || (item._id as string | undefined) || "",
    ),
    name: String((item.name as string) || ""),
    description: String((item.description as string) || ""),
    price,
    priceOneTimeCents,
    priceRefill2MCents,
    type: ((item.type as ProductType | undefined) ||
      (item.Type as ProductType | undefined) ||
      "RX") as ProductType,
    imageUrl: String((item.imageUrl as string) || ""),
    ingredients,
    formulations,
    concerns: toStringArray(item.concerns),
    photos: toStringArray(item.photos),
    topIcon: String((item.topIcon as string) || ""),
    sideIcon: String((item.sideIcon as string) || ""),
    howWhy: String((item.howWhy as string) || ""),
    howToUse: String((item.howToUse as string) || ""),
    pairsWith,
    faqs,
  };
};

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  const loadStatic = async (): Promise<Product[]> => {
    const response = await fetch("/static/products.json");
    if (!response.ok) throw new Error("Failed to fetch local products");
    const data = await response.json();
    return (data || []).map(normalizeProduct);
  };

  const mergeWithFallback = (primary: Product[], fallback: Product[]) => {
    const fallbackByName = new Map(
      fallback.map((p) => [p.name.toLowerCase(), p]),
    );

    const useString = (val?: string, fb?: string) => {
      const trimmed = (val || "").trim();
      if (!trimmed.length) return (fb || "").trim();

      const fallback = (fb || "").trim();
      const looksSeeded = /seeded product/i.test(trimmed);
      const veryShort = trimmed.length < 20 && fallback.length > trimmed.length;

      if (looksSeeded || veryShort) return fallback || trimmed;
      return trimmed;
    };

    const useArray = <T>(val?: T[], fb?: T[]) =>
      Array.isArray(val) && val.length ? val : fb || [];

    return primary.map((p) => {
      const fb = fallbackByName.get(p.name.toLowerCase());
      if (!fb) return p;

      const concerns = useArray(p.concerns, fb.concerns);
      const photos = useArray(p.photos, fb.photos);
      const ingredients = useArray(p.ingredients, fb.ingredients);
      const formulations = useArray(p.formulations, fb.formulations);
      const pairsWith = useArray(p.pairsWith, fb.pairsWith);
      const faqs = useArray(p.faqs, fb.faqs);

      const description = useString(p.description, fb.description);
      const howWhy = useString(p.howWhy, fb.howWhy);
      const howToUse = useString(p.howToUse, fb.howToUse);
      const topIcon = useString(p.topIcon, fb.topIcon);
      const sideIcon = useString(p.sideIcon, fb.sideIcon);

      const price = p.price ?? fb.price;
      const priceOneTimeCents =
        p.priceOneTimeCents ??
        fb.priceOneTimeCents ??
        (price != null ? Math.round(price * 100) : null);
      const priceRefill2MCents = p.priceRefill2MCents ?? fb.priceRefill2MCents;
      const imageUrl = p.imageUrl || fb.imageUrl;

      return {
        ...fb,
        ...p,
        description,
        howWhy,
        howToUse,
        topIcon,
        sideIcon,
        ingredients,
        formulations,
        pairsWith,
        faqs,
        concerns,
        photos,
        price,
        priceOneTimeCents,
        priceRefill2MCents,
        imageUrl,
      };
    });
  };

  try {
    // Prefer backend catalog so product IDs match cart API
    const res = await api.get("/products/");
    const items = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.items)
        ? res.data.items
        : Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.products)
            ? res.data.products
            : [];

    let normalized = items.map(normalizeProduct);

    // Always enrich API data with static fallback to fill optional fields (e.g., FAQs)
    if (!normalized.length) return await loadStatic();

    try {
      const fallback = await loadStatic();
      normalized = mergeWithFallback(normalized, fallback);
    } catch {
      // If fallback fails, keep API data; errors handled below
    }

    return normalized;
  } catch (apiErr: unknown) {
    // Fallback to static file so UI still renders offline
    try {
      return await loadStatic();
    } catch (fallbackErr: unknown) {
      const fallbackMessage =
        fallbackErr instanceof Error ? fallbackErr.message : undefined;
      const apiMessage = apiErr instanceof Error ? apiErr.message : undefined;
      return rejectWithValue(
        fallbackMessage || apiMessage || "Failed to load products",
      );
    }
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch products";
      });
  },
});

export default productsSlice.reducer;
