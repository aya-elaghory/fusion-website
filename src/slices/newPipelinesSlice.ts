import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

// Define the type
export interface NewPipeline {
  _id: string;
  label: string;
  description: string;
  icon: string;
}

interface NewPipelinesState {
  pipelines: NewPipeline[];
  loading: boolean;
  error: string | null;
}

const initialState: NewPipelinesState = {
  pipelines: [],
  loading: false,
  error: null,
};

// Thunk to fetch all new pipelines from backend
export const fetchNewPipelines = createAsyncThunk<NewPipeline[]>(
  "newPipelines/fetchNewPipelines",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/new-pipelines");
      return response.data as NewPipeline[];
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.error || "Unknown error");
    }
  }
);

// Slice
const newPipelinesSlice = createSlice({
  name: "newPipelines",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewPipelines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewPipelines.fulfilled, (state, action) => {
        state.loading = false;
        state.pipelines = action.payload;
      })
      .addCase(fetchNewPipelines.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          (action.error.message as string) ||
          "Failed to fetch new pipelines";
      });
  },
});

export default newPipelinesSlice.reducer;
