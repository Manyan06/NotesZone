import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#140021] to-[#000000] text-white flex flex-col">
      
      {/* Header (auth-only, replaces global navbar visually) */}
      <header className="w-full px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <h2 className="text-purple-400 text-3xl font-bold tracking-tight">
          NotesZone
        </h2>
        <div className="flex items-center gap-5">
          <span className="text-purple-400 text-sm font-medium ring-2 ring-purple-600/50 px-4 py-1.5 rounded-lg">
            Login
          </span>
          <Link
            to="/register"
            className="text-white/80 hover:text-white text-sm font-medium transition"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center gap-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back
              </h1>
              <p className="text-purple-400 mt-1">
                Log in to your account to continue
              </p>
            </div>

            <form
              onSubmit={onSubmit}
              noValidate
              className="w-full flex flex-col gap-4"
            >
              {/* Email */}
              <div className="flex flex-col">
                <label className="text-sm font-medium pb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="Enter your email address"
                  className="h-12 px-4 rounded-lg bg-[#05010A] border border-purple-600/50 text-white placeholder:text-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center pb-2">
                  <label className="text-sm font-medium">Password</label>
                  <span className="text-purple-400 text-sm opacity-60 cursor-not-allowed">
                    Forgot Password?
                  </span>
                </div>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  className="h-12 px-4 rounded-lg bg-[#05010A] border border-purple-600/50 text-white placeholder:text-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="text-sm text-red-400 font-medium">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-lg bg-purple-600 hover:bg-purple-700 transition font-semibold disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-sm text-purple-400/80">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-purple-400 hover:text-purple-300 transition"
          >
            Sign Up
          </Link>
        </p>
      </footer>
    </div>
  );
}
