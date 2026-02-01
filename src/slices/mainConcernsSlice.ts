import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface SubConcern {
  name: string;
  imageUrl: string;
  ingredients: string [];
  whatCauseItUrl: string;
  howItWorksUrl: string;
}

export interface MainConcern {
  id?: string;
  main_concern_name: string;
  subConcerns: SubConcern[];
}

interface MainConcernsState {
  concerns: MainConcern[];
  loading: boolean;
  error: string | null;
}

const initialState: MainConcernsState = {
  concerns: [],
  loading: false,
  error: null,
};

// Update: Fetch from static JSON!
export const fetchMainConcerns = createAsyncThunk<MainConcern[]>(
  'mainConcerns/fetchMainConcerns',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/static/mainConcerns.json');
      if (!res.ok) throw new Error('Failed to fetch main concerns');
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message || "Unknown error");
    }
  }
);

const mainConcernsSlice = createSlice({
  name: 'mainConcerns',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMainConcerns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMainConcerns.fulfilled, (state, action) => {
        state.loading = false;
        state.concerns = action.payload;
      })
      .addCase(fetchMainConcerns.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch main concerns';
      });
  },
});

export default mainConcernsSlice.reducer;
