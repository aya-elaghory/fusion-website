import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

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

export interface Product {
  id: string; // e.g. "68d907e7fba6e61ba6e9dc8b"
  name: string;
  description: string;
  price: number | null; // Spot Peel has null price
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

export const fetchProducts = createAsyncThunk<Product[]>(
  'products/fetchProducts',
  async () => {
    const response = await fetch('/static/products.json');
    if (!response.ok) throw new Error('Failed to fetch local products');
    const data = await response.json();
    // Normalize to expected Product type if necessary
    return data.map((item: any) => ({
      ...item,
      type: item.type || item.Type,
      _id: item._id || String(item.id),
    }));
  }
);

const productsSlice = createSlice({
  name: 'products',
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
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export default productsSlice.reducer;
