// src/slices/cartPhotosRequirementSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/store";

// --- Interface ---
export interface CartPhotosRequirementState {
  [cartItemId: string]: string[];
}

const initialState: CartPhotosRequirementState = {};

// --- Slice ---
const cartPhotosRequirementSlice = createSlice({
  name: "cartPhotosRequirement",
  initialState,
  reducers: {
    setPhotoRequirements(
      state,
      action: PayloadAction<{ cartItemId: string; photoKeys: string[] }>
    ) {
      state[action.payload.cartItemId] = Array.from(
        new Set(action.payload.photoKeys)
      );
    },
    addPhotoRequirement(
      state,
      action: PayloadAction<{ cartItemId: string; photoKey: string }>
    ) {
      const arr = state[action.payload.cartItemId] || [];
      if (!arr.includes(action.payload.photoKey)) {
        arr.push(action.payload.photoKey);
        state[action.payload.cartItemId] = arr;
      }
    },
    clearPhotoRequirements(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
  },
});

export const {
  setPhotoRequirements,
  addPhotoRequirement,
  clearPhotoRequirements,
} = cartPhotosRequirementSlice.actions;

export default cartPhotosRequirementSlice.reducer;

// ========== THUNK TO SYNC PHOTO REQUIREMENTS FROM CART+PRODUCTS ==========
/**
 * Dispatch this after cart or products change to keep requirements in sync!
 */
export function updateCartPhotoRequirements() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const cartItems = state.cart.items; // array of { id: string, ... }
    const products = state.products.products; // array of Product

    cartItems.forEach((item) => {
      const product =
        products.find((p) => p._id === item.id || p._id === item.id) || {};
      const photoKeys: string[] = Array.isArray((product as any).photos)
        ? (product as any).photos
        : [];
      dispatch(
        setPhotoRequirements({
          cartItemId: item.id,
          photoKeys: photoKeys,
        })
      );
    });
  };
}

/*
USAGE:
dispatch(updateCartPhotoRequirements());
You can call this after fetching cart or products.
*/
