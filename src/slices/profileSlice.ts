import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";

// --- Types ---
export interface Address {
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentMethod {
  cardholderName: string;
  cardNumber: string; // Last 4 digits only
  expMonth: string;
  expYear: string;
  brand: string;
}

export interface ProfileData {
  _id?: string;
  user?: string;
  userId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  incompleteVisit: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// --- Redux State ---
interface ProfileState {
  profile: ProfileData | null;
  loading: boolean;
  hasFetched: boolean; // ✅ NEW
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  hasFetched: false, // ✅ NEW
  error: null,
};

// --- Thunks ---
export const fetchProfile = createAsyncThunk<ProfileData>(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/profile");
      return res.data as ProfileData;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Unknown error"
      );
    }
  }
);

export const updateProfile = createAsyncThunk<
  ProfileData,
  Partial<ProfileData>
>("profile/updateProfile", async (updateData, { rejectWithValue }) => {
  try {
    const res = await api.put("/profile", updateData);
    return res.data as ProfileData;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || err.message || "Unknown error"
    );
  }
});

// --- Slice ---
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile(state) {
      state.profile = null;
      state.error = null;
      state.hasFetched = false; // ✅ reset
      state.loading = false;
    },
    setProfile(state, action: PayloadAction<ProfileData>) {
      state.profile = action.payload;
      state.hasFetched = true;
      state.loading = false;
      state.error = null;
    },
    // Addresses CRUD
    updateAddresses(state, action: PayloadAction<Address[]>) {
      if (state.profile) state.profile.addresses = action.payload;
    },
    // Payment Methods CRUD
    updatePaymentMethods(state, action: PayloadAction<PaymentMethod[]>) {
      if (state.profile) state.profile.paymentMethods = action.payload;
    },
    // Visit flag
    setIncompleteVisit(state, action: PayloadAction<boolean>) {
      if (state.profile) state.profile.incompleteVisit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.hasFetched = true; // ✅ NEW
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.hasFetched = true; // ✅ NEW (we tried)
        state.error = (action.payload as string) || "Failed to fetch profile";
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.hasFetched = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update profile";
      });
  },
});

export const {
  clearProfile,
  setProfile,
  updateAddresses,
  updatePaymentMethods,
  setIncompleteVisit,
} = profileSlice.actions;

export default profileSlice.reducer;
