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

// Accept either key; some backends return `access_token`
const rawToken =
  localStorage.getItem("token") || localStorage.getItem("access_token");
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
  const emailClean = email.trim().toLowerCase();
  const passwordClean = password.trim();

  if (!emailClean || !passwordClean) {
    return rejectWithValue("Email and password are required");
  }

  try {
    // Use trailing slash to avoid 301/308 redirects that break CORS preflight
    // Use stable, slash-normalized paths to avoid backend 404s on strict routers
    const res = await api.post("/auth/login", {
      email: emailClean,
      password: passwordClean,
    });

    // Accept multiple token shapes from backend
    const token =
      res.data?.token ||
      res.data?.access_token ||
      res.data?.accessToken ||
      res.data?.jwt;
    if (!token) return rejectWithValue("Login response is missing token");

    return {
      user: {
        email: res.data.user?.email || emailClean,
        firstName: res.data.user?.firstName || "",
        lastName: res.data.user?.lastName,
        role: res.data.user?.role,
      },
      token,
    };
  } catch (err: any) {
    const data = err?.response?.data;
    const messageFromArray =
      Array.isArray(data?.errors) && data.errors.length
        ? data.errors[0]?.message || data.errors[0]
        : null;

    const message =
      messageFromArray ||
      data?.message ||
      data?.detail ||
      (typeof data === "string" ? data : undefined) ||
      err?.message ||
      "Login failed";

    return rejectWithValue(message);
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
    confirmPassword?: string;
  },
  { rejectValue: string }
>("auth/signupUser", async (payload, { rejectWithValue }) => {
  try {
    const email = payload.email.trim();
    const password = payload.password.trim();
    const confirm = (payload.confirmPassword ?? payload.password).trim();
    const firstName = payload.firstName.trim();
    const lastName = payload.lastName?.trim();
    const birthDate = payload.birthDate?.trim();

    const body: Record<string, any> = {
      email,
      password,
      confirmPassword: confirm,
      confirm_password: confirm,
      passwordConfirmation: confirm,
      password_confirmation: confirm,
      firstName,
      first_name: firstName,
    };

    if (lastName) {
      body.lastName = lastName;
      body.last_name = lastName;
    }
    if (birthDate) {
      body.birthDate = birthDate;
      body.birth_date = birthDate;
    }

    // Use trailing slash to avoid 301/308 redirects during preflight
    const res = await api.post("/auth/signup", body);

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
    const data = err?.response?.data;
    const messageFromArray =
      Array.isArray(data?.errors) && data.errors.length
        ? data.errors[0]?.message || data.errors[0]
        : null;

    const message =
      messageFromArray ||
      data?.message ||
      data?.error ||
      data?.detail ||
      (typeof data === "string" ? data : undefined) ||
      err?.message ||
      "Signup failed";
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserInfo; token?: string | null }>,
    ) => {
      const token = action.payload.token;

      state.user = action.payload.user;
      state.token = token || null;
      state.isAuthenticated = !!token;
      state.error = null;
      state.loading = false;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("access_token", token);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
    },
    resetAuth: (state) => {
      Object.assign(state, initialState);
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
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
        localStorage.setItem("access_token", action.payload.token);
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
