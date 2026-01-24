import React, { useState } from "react";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";

export default function ShareDialog({ note, onUpdated }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const share = async () => {
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post(`/notes/${note._id}/share`, {
        email,
        role,
      });
      onUpdated(data);
      setEmail("");
      setRole("viewer");
      setTimeout(() => nav("/dashboard"), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Share failed");
    } finally {
      setBusy(false);
    }
  };

  const unshare = async (userId, emailFallback) => {
    setBusy(true);
    setError("");
    try {
      const payload = {};
      if (userId) payload.userId = userId;
      if (emailFallback) payload.email = emailFallback;
      const { data } = await api.post(`/notes/${note._id}/unshare`, payload);
      onUpdated(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Unshare failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-purple-900/20 backdrop-blur-xl border border-purple-600/30 rounded-xl p-5 shadow-lg text-white">
      <h4 className="text-lg font-semibold mb-4">Sharing</h4>

      {/* Add user */}
      <div className="flex gap-2 mb-4">
        <input
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-purple-900/30 backdrop-blur-md border border-purple-600/40 rounded-lg px-3 py-2 text-sm text-white placeholder:text-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="bg-purple-900/30 backdrop-blur-md border border-purple-600/40 rounded-lg px-2 py-2 text-sm text-white focus:outline-none"
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
        </select>
        <button
          disabled={busy}
          onClick={share}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg disabled:opacity-50 transition"
        >
          Add / Update
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-400 mb-3">
          {error}
        </div>
      )}

      {/* Access list */}
      <div>
        <div className="text-sm font-medium text-purple-300 mb-2">
          Current access
        </div>

        <ul className="space-y-2">
          <li className="text-sm">
            <strong>Owner</strong>: You
          </li>

          {note.sharedWith?.map((sw) => (
            <li
              key={sw.user}
              className="flex items-center justify-between text-sm border-b border-purple-600/20 pb-1"
            >
              <span>
                {sw.email || sw.user}
                <span
                  className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                    sw.role === "editor"
                      ? "bg-purple-700/40 text-purple-200"
                      : "bg-gray-700/40 text-gray-300"
                  }`}
                >
                  {sw.role}
                </span>
              </span>
              <button
                onClick={() => unshare(sw.user, sw.email)}
                className="ml-3 px-2 py-1 text-xs bg-red-600/30 text-red-300 rounded hover:bg-red-600/50 transition"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <div className="text-xs text-purple-300 mt-3">
          Note: To share, the target user must already be registered.
        </div>
      </div>
    </div>
  );
}
