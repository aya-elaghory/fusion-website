import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";

// --- Types ---
export interface Answer {
  id?: string;
  user?: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AnswersState {
  answers: Answer[];
  dirtyMap: { [questionId: string]: boolean };
  loading: boolean;
  error: string | null;
  hasFetched: boolean;            // NEW
  lastFetchedAt?: string | null;  // optional
}

const initialState: AnswersState = {
  answers: [],
  dirtyMap: {},
  loading: false,
  error: null,
  hasFetched: false,              // NEW
  lastFetchedAt: null,            // optional
};

// Fetch answers (guarded; won't refetch if already fetched or loading)
export const fetchAnswers = createAsyncThunk<
  Answer[],
  void,
  { state: { answers: AnswersState } }
>(
  "answers/fetchAnswers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/answers");
      return Array.isArray(res.data) ? res.data : [];
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Failed to fetch answers"
      );
    }
  },
  {
    // Prevent duplicate/background re-dispatches
    condition: (_, { getState }) => {
      const { loading, hasFetched } = getState().answers;
      return !loading && !hasFetched;
    },
  }
);

// Only update DB for one answer at a time
export const saveAnswer = createAsyncThunk<
  Answer,
  { questionId: string; answer: string },
  { state: { answers: AnswersState } }
>(
  "answers/saveAnswer",
  async ({ questionId, answer }, { rejectWithValue }) => {
    try {
      const res = await api.post("/answers", { question: questionId, answer });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Failed to save answer"
      );
    }
  }
);

// Sync only dirty answers to DB in batch (for review/unmount)
export const syncDirtyAnswersToDB = createAsyncThunk<
  void,
  void,
  { state: { answers: AnswersState } }
>(
  "answers/syncDirtyAnswersToDB",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { answers, dirtyMap } = getState().answers;
    const dirtyAnswers = answers.filter((a) => dirtyMap[a.question]);
    try {
      for (const a of dirtyAnswers) {
        await api.post("/answers", { question: a.question, answer: a.answer });
        dispatch(markAnswerSynced(a.question));
      }
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Failed to sync answers"
      );
    }
  }
);

function upsertAnswer(state: AnswersState, newAnswer: Answer) {
  const idx = state.answers.findIndex((a) => a.question === newAnswer.question);
  if (idx > -1) {
    state.answers[idx] = { ...state.answers[idx], ...newAnswer };
  } else {
    state.answers.push(newAnswer);
  }
}

const answersSlice = createSlice({
  name: "answers",
  initialState,
  reducers: {
    clearAnswers: (state) => {
      state.answers = [];
      state.dirtyMap = {};
      state.loading = false;
      state.error = null;
      state.hasFetched = false;       // reset so we can refetch if needed
      state.lastFetchedAt = null;
    },
    setAnswer: (state, action: PayloadAction<{ questionId: string; answer: string }>) => {
      upsertAnswer(state, {
        question: action.payload.questionId,
        answer: action.payload.answer,
      });
      state.dirtyMap[action.payload.questionId] = true;
    },
    markAnswerSynced: (state, action: PayloadAction<string>) => {
      delete state.dirtyMap[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnswers.fulfilled, (state, action) => {
        state.answers = Array.isArray(action.payload) ? action.payload : [];
        state.dirtyMap = {}; // DB is source of truth now
        state.loading = false;
        state.hasFetched = true; // NEW
        state.lastFetchedAt = new Date().toISOString();
      })
      .addCase(fetchAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to fetch answers";
        // keep hasFetched as-is (still false) so you can retry intentionally
      })

      // Optional single-answer save
      .addCase(saveAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveAnswer.fulfilled, (state, action) => {
        if (action.payload && action.payload.question) {
          upsertAnswer(state, action.payload);
          delete state.dirtyMap[action.payload.question];
        }
        state.loading = false;
      })
      .addCase(saveAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to save answer";
      });
  },
});

export const { clearAnswers, setAnswer, markAnswerSynced } = answersSlice.actions;
export default answersSlice.reducer;
