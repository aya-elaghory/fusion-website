// src/slices/questionsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// --- Types ---
export interface DetailsQuestion {
  questionText: string;
  type: "text";
  showIf: string[];
}

export interface Question {
  id?: string;
  questionId: string;
  questionText: string;
  type: "radio" | "text";
  options?: string[];
  category: "personal" | "medical" | "product";
  productKey?: string | null;
  detailsQuestion?: DetailsQuestion;
}

export interface Section {
  name: string;
  questions: Question[];
}

interface QuestionsState {
  questions: Question[];
  sections: Section[];
  loading: boolean;
  error: string | null;
}

const initialState: QuestionsState = {
  questions: [],
  sections: [],
  loading: false,
  error: null,
};

// Group questions into sections, only for products in cart
function groupBySection(questions: Question[], cartProductKeys: string[]): Section[] {
  const personal = questions.filter((q) => q.category === "personal");
  const medical = questions.filter((q) => q.category === "medical");

  const productQuestions = questions.filter(
    (q) => q.category === "product" && q.productKey && cartProductKeys.includes(q.productKey)
  );

  const productKeys = Array.from(new Set(productQuestions.map((q) => q.productKey)));
  const productSections = productKeys.map((productKey) => ({
    name: productKey || "Other Product",
    questions: productQuestions.filter((q) => q.productKey === productKey),
  }));

  return [
    { name: "Personal Information", questions: personal },
    { name: "Medical History", questions: medical },
    ...productSections,
  ].filter((sec) => sec.questions.length > 0);
}

// Accept either { cartItems } or { items } to be robust
type FetchQuestionsArg = {
  cartItems?: { id: string; name: string }[];
  items?: { id: string; name: string }[]; // legacy callers
};

export const fetchQuestions = createAsyncThunk<
  { questions: Question[]; sections: Section[] },
  FetchQuestionsArg
>("questions/fetchQuestions", async (payload, { rejectWithValue }) => {
  try {
    const res = await fetch("/static/questions.json");
    if (!res.ok) throw new Error("Failed to load questions");
    const questions: Question[] = await res.json();

    const source = payload.cartItems ?? payload.items ?? [];
    const cartProductKeys = source.map((item) => item.name);
    const sections = groupBySection(questions, cartProductKeys);

    return { questions, sections };
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch questions");
  }
});

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    clearQuestions: (state) => {
      state.questions = [];
      state.sections = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questions = action.payload.questions;
        state.sections = action.payload.sections;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch questions";
      });
  },
});

export const { clearQuestions } = questionsSlice.actions;
export default questionsSlice.reducer;
