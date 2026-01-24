import React, { useContext } from "react";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Editor from "./pages/Editor.jsx";
import { AuthContext } from "./context/AuthContext.jsx";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const { user, token, logout } = useContext(AuthContext);
  const nav = useNavigate();
  const location = useLocation();

  // ⛔ Routes where navbar must NOT appear
  const hideNavbarRoutes = ["/login", "/register"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {/* ✅ Navbar only for non-auth pages */}
      {!hideNavbar && (
        <nav className="bg-[#05010A]/80 border-b border-purple-600/30 px-6 py-3 flex items-center justify-between text-white">



          <Link
            to="/dashboard"
            className="text-3xl font-bold text-purple-500 hover:text-purple-400 transition"
          >
            NotesZone
          </Link>

          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <span className="text-sm text-white-700">
                  <span className="font-semibold">Hi, </span>
                  <span className="font-bold">{user?.name}</span>
                </span>

                <button
                  onClick={() => nav("/dashboard")}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-blue-700 transition"
                >
                  Dashboard
                </button>

                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => nav("/login")}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-blue-600 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => nav("/register")}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-blue-600 transition"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </nav>
      )}

      {/* ✅ IMPORTANT: no container wrapper for login */}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/dashboard" />}
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/notes/:id"
          element={
            <PrivateRoute>
              <Editor />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}
