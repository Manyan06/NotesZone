import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#140021] to-[#000000] text-white flex flex-col">
      
      {/* Header */}
      <header className="w-full px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <h2 className="text-purple-400 text-3xl font-bold tracking-tight">
          NotesZone
        </h2>
        <div className="flex items-center gap-5">
          <Link
            to="/login"
            className="text-white/80 hover:text-white text-sm font-medium transition"
          >
            Login
          </Link>
          <span className="text-purple-400 text-sm font-medium ring-2 ring-purple-600/50 px-4 py-1.5 rounded-lg">
            Register
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center gap-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Create your account
              </h1>
              <p className="text-purple-400 mt-1">
                Start collaborating on notes today
              </p>
            </div>

            <form
              onSubmit={onSubmit}
              noValidate
              className="w-full flex flex-col gap-4"
            >
              {/* Name */}
              <div className="flex flex-col">
                <label className="text-sm font-medium pb-2">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="John Doe"
                  className="h-12 px-4 rounded-lg bg-[#05010A] border border-purple-600/50 text-white placeholder:text-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

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
                <label className="text-sm font-medium pb-2">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Create a password"
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
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-sm text-purple-400/80">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-purple-400 hover:text-purple-300 transition"
          >
            Log in
          </Link>
        </p>
      </footer>
    </div>
  );
}
