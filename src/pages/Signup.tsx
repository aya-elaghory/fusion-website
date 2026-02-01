// src/pages/Signup.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { signupUser } from "@/slices/authSlice";
import { RootState } from "@/store";

const Signup: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const loading = useSelector((s: RootState) => s.auth.loading);
  const authError = useSelector((s: RootState) => s.auth.error);

  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const pwd = password.trim();
    const confirmed = confirmPassword.trim();

    if (pwd !== confirmed) {
      setLocalError("Passwords do not match");
      return;
    }

    if (pwd.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

    // Normalize birth date to YYYY-MM-DD if user typed dd/mm/yyyy
    let normalizedBirth = birthDate.trim();
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(normalizedBirth)) {
      const [d, m, y] = normalizedBirth.split("/");
      normalizedBirth = `${y}-${m}-${d}`; // backend usually expects ISO-style date
    }

    const result = await dispatch(
      signupUser({
        email: trimmedEmail,
        password: pwd,
        firstName: trimmedFirst,
        lastName: trimmedLast,
        birthDate: normalizedBirth,
        confirmPassword: confirmed,
      }),
    );

    if (signupUser.fulfilled.match(result)) {
      // backend usually returns token → you are logged in
      // go home
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 mt-16">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <div className="mb-4">
          <label htmlFor="firstName" className="block font-semibold mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="block w-full border border-gray-300 px-3 py-2 shadow-sm
              focus:outline-none focus:ring-1 focus:ring-green-800 focus:border-green-800"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block font-semibold mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="block w-full border border-gray-300 px-3 py-2 shadow-sm
              focus:outline-none focus:ring-1 focus:ring-green-800 focus:border-green-800"
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full border border-gray-300 px-3 py-2 shadow-sm
              focus:outline-none focus:ring-1 focus:ring-green-800 focus:border-green-800"
            required
            autoComplete="email"
            disabled={loading}
          />
        </div>

        <div className="mb-4 relative">
          <label htmlFor="password" className="block font-semibold mb-1">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full border border-gray-300 px-3 py-2 shadow-sm
              focus:outline-none focus:ring-1 focus:ring-green-800 focus:border-green-800"
            required
            autoComplete="new-password"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 pt-6"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-500" />
            ) : (
              <Eye className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        <div className="mb-4 relative">
          <label htmlFor="confirmPassword" className="block font-semibold mb-1">
            Confirm Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full border border-gray-300 px-3 py-2 shadow-sm
              focus:outline-none focus:ring-1 focus:ring-green-800 focus:border-green-800"
            required
            autoComplete="new-password"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 pt-6"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5 text-gray-500" />
            ) : (
              <Eye className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="birthDate" className="block font-semibold mb-1">
            Birth Date
          </label>
          <input
            type="date"
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="block w-full border border-gray-300 px-3 py-2 shadow-sm
              focus:outline-none focus:ring-1 focus:ring-green-800 focus:border-green-800"
            disabled={loading}
          />
        </div>

        {(localError || authError) && (
          <div className="text-red-600 mb-3 text-sm text-center">
            {localError || authError}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-800 hover:bg-green-600 text-white font-semibold py-2 px-4 transition"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <div className="mt-4 text-sm text-center">
          <span>Already have an account?</span>
          <button
            type="button"
            className="text-green-600 underline ml-1"
            onClick={() => navigate("/login")}
            disabled={loading}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
