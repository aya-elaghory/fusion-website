// src/slices/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export interface UserInfo {
  email: string;
  firstName: string;
  lastName?: string;
  role?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const rawToken = localStorage.getItem("token");
const storedToken =
  rawToken && rawToken !== "undefined" && rawToken !== "null" ? rawToken : null;

const initialState: AuthState = {
  isAuthenticated: !!storedToken,
  user: null,
  token: storedToken,
  loading: false,
  error: null,
};

// --- Thunk: loginUser
export const loginUser = createAsyncThunk<
  { user: UserInfo; token: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/login", { email, password });

    const token = res.data?.token;
    if (!token) return rejectWithValue("Login response is missing token");

    return {
      user: {
        email: res.data.user?.email || email,
        firstName: res.data.user?.firstName || "",
        lastName: res.data.user?.lastName,
        role: res.data.user?.role,
      },
      token,
    };
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || err?.message || "Login failed"
    );
  }
});

// --- Thunk: signupUser
export const signupUser = createAsyncThunk<
  { user: UserInfo; token?: string },
  {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    birthDate?: string;
  },
  { rejectValue: string }
>("auth/signupUser", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/signup", payload);

    return {
      user: {
        email: res.data.user?.email || payload.email,
        firstName: res.data.user?.firstName || payload.firstName,
        lastName: res.data.user?.lastName || payload.lastName,
        role: res.data.user?.role,
      },
      token: res.data?.token, // may exist (your backend sends it)
    };
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || err?.message || "Signup failed"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserInfo; token?: string | null }>
    ) => {
      const token = action.payload.token;

      state.user = action.payload.user;
      state.token = token || null;
      state.isAuthenticated = !!token;
      state.error = null;
      state.loading = false;

      if (token) localStorage.setItem("token", token);
      else localStorage.removeItem("token");
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("token");
    },
    resetAuth: (state) => {
      Object.assign(state, initialState);
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        // ✅ if backend returned token → auto login
        if (action.payload.token) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
      });
  },
});

export const { setCredentials, logout, resetAuth } = authSlice.actions;
export default authSlice.reducer;
