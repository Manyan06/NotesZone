import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { io } from "socket.io-client";
import ShareDialog from "../components/ShareDialog.jsx";

const useDebouncedCallback = (fn, delay) => {
  const timer = useRef(null);
  return (...args) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  };
};

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("disconnected");
  const [error, setError] = useState("");
  const [polling, setPolling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const socketRef = useRef(null);
  const pollRef = useRef(null);

  const editable = useMemo(
    () => note?.access === "owner" || note?.access === "editor",
    [note]
  );

  const fetchNote = async () => {
    try {
      const { data } = await api.get(`/notes/${id}`);
      setNote(data);
      setTitle(data.title || "");
      setContent(data.content || "");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load note");
    }
  };

  const startPolling = () => {
    if (pollRef.current) return;
    setPolling(true);
    pollRef.current = setInterval(fetchNote, 5000);
  };

  const stopPolling = () => {
    setPolling(false);
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
  };

  useEffect(() => {
    fetchNote();
  }, [id]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setStatus("connected");
      stopPolling();
      socket.emit("join_note", { noteId: id });
    });

    socket.on("disconnect", () => {
      setStatus("disconnected");
      startPolling();
    });

    socket.on("server_note_init", setNote);
    socket.on("server_note_update", setNote);

    return () => {
      socket.emit("leave_note", { noteId: id });
      socket.disconnect();
      stopPolling();
    };
  }, [id, token]);

  const sendUpdate = useDebouncedCallback((patch) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("client_note_update", {
        noteId: id,
        ...patch,
      });
    } else {
      api.put(`/notes/${id}`, patch).catch(() => {});
    }
  }, 400);

  const onTitle = (v) => {
    setTitle(v);
    if (editable) sendUpdate({ title: v });
  };

  const onContent = (v) => {
    setContent(v);
    if (editable) sendUpdate({ content: v });
  };

  const deleteNote = async () => {
    if (!window.confirm("Delete this note permanently?")) return;
    setDeleting(true);
    try {
      await api.delete(`/notes/${id}`);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (!note)
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-600">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#140021]/80 to-[#000000] text-white px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <input
            value={title}
            onChange={(e) => onTitle(e.target.value)}
            disabled={!editable}
            placeholder="Untitled note"
            className="flex-1 bg-purple-900/95 border border-purple-600/40 rounded-lg px-4 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-60"
          />

          <span className="text-xs px-2 py-1 rounded bg-purple-900/50">
            {note.access}
          </span>

          {note.access === "owner" && (
            <button
              onClick={deleteNote}
              disabled={deleting}
              className="px-3 py-2 bg-red-600 rounded-lg text-sm hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>

        <textarea
          rows={18}
          value={content}
          onChange={(e) => onContent(e.target.value)}
          disabled={!editable}
          placeholder="Start writing..."
          className="w-full bg-purple-900/95 border border-purple-600/40 rounded-lg p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-60"
        />

        {note.access === "owner" && (
          <ShareDialog
            note={note}
            onUpdated={(updated) => setNote(updated)}
          />
        )}

        {error && (
          <div className="text-sm text-red-400 font-medium">
            {error}
          </div>
        )}

        <div className="text-xs text-purple-400">
          Realtime: {status} {polling ? "(polling)" : ""}
        </div>
      </div>
    </div>
  );
}
