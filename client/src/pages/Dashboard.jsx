import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import NoteList from "../components/NoteList.jsx";

export default function Dashboard() {
  const navigate = useNavigate();

  const [owned, setOwned] = useState([]);
  const [shared, setShared] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [o, s] = await Promise.all([
        api.get("/notes/owned"),
        api.get("/notes/shared"),
      ]);
      setOwned(o.data);
      setShared(s.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    try {
      const { data } = await api.post("/notes", {
        title: "",
        content: "",
      });
      navigate(`/notes/${data._id}`);
    } catch {
      setError("Failed to create note");
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-purple-600">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-400 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#140021]/80 to-[#000000] text-white px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Your Notes
          </h1>
          <button
            onClick={createNote}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition"
          >
            + New Note
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <NoteList title="Owned by me" notes={owned} dark />
          <NoteList title="Shared with me" notes={shared} dark />
        </div>
      </div>
    </div>
  );
}
