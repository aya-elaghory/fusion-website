// src/pages/Login.tsx
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/slices/authSlice";
import { fetchProfile } from "@/slices/profileSlice";
import { fetchCart } from "@/slices/cartSlice";
import { fetchQuestions } from "@/slices/questionsSlice";
import { fetchAnswers } from "@/slices/answersSlice";
import { RootState } from "@/store";
import { useNavigate, useLocation } from "react-router-dom";

const Login: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authLoading = useSelector((s: RootState) => s.auth.loading);
  const authError = useSelector((s: RootState) => s.auth.error);
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const token = useSelector((s: RootState) => s.auth.token);

  // Avoid duplicate navigation in StrictMode
  const effectRan = useRef(false);

  useEffect(() => {
    if (isAuthenticated && token && !effectRan.current) {
      effectRan.current = true;

      (async () => {
        // 1) Always try to fetch the profile (prevents skeleton flash on next screen)
        try {
          await dispatch(fetchProfile()).unwrap();
        } catch {
          /* non-blocking */
        }

        // Parse router state
        const state = (location.state || {}) as any;
        const intent = state?.intent as string | undefined;
        const fromRaw = state?.from;
        const fromPath =
          typeof fromRaw === "string"
            ? fromRaw
            : typeof fromRaw === "object" && fromRaw
            ? fromRaw.pathname
            : undefined;

        const cameFromCheckout =
          intent === "checkout" ||
          fromPath === "/checkout" ||
          fromPath === "/uploadphotos";

        if (cameFromCheckout) {
          // 2) Preload Cart (to know which product-questions to fetch)
          let cartItems: Array<{ id: string; name: string }> = [];
          try {
            const fetched = await dispatch(fetchCart()).unwrap();
            // cartSlice fetchCart returns CartItem[] with { id, name, ... }
            cartItems = Array.isArray(fetched)
              ? fetched.map((it: any) => ({ id: it.id, name: it.name }))
              : [];
          } catch {
            cartItems = [];
          }

          // 3) Preload Answers + Questions (guarded thunks; safe to call)
          try {
            await Promise.all([
              dispatch(fetchAnswers()),
              dispatch(fetchQuestions({ cartItems })),
            ]);
          } catch {
            /* still go on */
          }

          // 4) Now navigate to Questionnaire
          navigate("/questionnaire", { replace: true });
          return;
        }

        // Default navigation when not from checkout-intent
        const fallbackTarget = fromPath || "/";
        navigate(fallbackTarget, { replace: true });
      })();
    }

    return () => {
      effectRan.current = false;
    };
  }, [isAuthenticated, token, dispatch, navigate, location.state]);

  const renderError = (error: any) => {
    if (!error) return null;
    if (typeof error === "string") return error;
    if (error.message) return error.message;
    return JSON.stringify(error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        className="bg-white shadow-lg p-8 max-w-md w-full"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

        <div className="mb-4">
          <label className="block font-semibold mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="block w-full border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-green-800 focus:border-green-800"
            value={email}
            required
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            disabled={authLoading}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="block w-full border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-green-800 focus:border-green-800"
            value={password}
            required
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            disabled={authLoading}
          />
        </div>

        {authError && (
          <div className="text-red-600 mb-3 text-sm">
            {renderError(authError)}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-800 hover:bg-green-600 text-white font-semibold py-2 px-4 transition"
          disabled={authLoading}
        >
          {authLoading ? "Signing in..." : "Sign In"}
        </button>

        <div className="mt-4 text-sm text-center">
          <span>Don't have an account?</span>
          <button
            type="button"
            className="text-green-600 underline ml-1"
            onClick={() => navigate("/signup")}
            disabled={authLoading}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
