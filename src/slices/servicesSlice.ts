import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Service {
  _id?: string;
  name: string;
  category: string;
  description?: string;
  imageUrl?: string;
}

interface ServicesState {
  services: Service[];
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  loading: false,
  error: null,
};

// Update: Fetch from static JSON!
export const fetchServices = createAsyncThunk<Service[]>(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/static/services.json');
      if (!res.ok) throw new Error('Failed to fetch services');
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message || "Unknown error");
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch services';
      });
  },
});

export default servicesSlice.reducer;
