import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

// Define the type
export interface NewPipeline {
  id: string;
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
      // Trailing slash avoids redirects that can surface as CORS issues.
      const response = await api.get("/new-pipelines/");
      const data = response.data;
      if (typeof data === "string") {
        // Likely an HTML error or proxy returned index.html — treat as empty
        return [] as NewPipeline[];
      }
      // API may return either an array or an object with a `pipelines` field
      return (data?.pipelines ?? data) as NewPipeline[];
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) return [] as NewPipeline[]; // tolerate missing endpoint
      return rejectWithValue(err?.response?.data?.error || "Unknown error");
    }
  },
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
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.pipelines = payload;
        } else if (payload && Array.isArray((payload as any).pipelines)) {
          state.pipelines = (payload as any).pipelines;
        } else {
          state.pipelines = [];
        }
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
