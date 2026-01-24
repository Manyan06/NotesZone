import React from "react";
import { Link } from "react-router-dom";

export default function NoteList({ notes, title }) {
  return (
    <div className="rounded-2xl p-6 border border-purple-600/30 bg-purple-900/60 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-700/60 text-purple-200">
          {notes.length}
        </span>
      </div>

      {notes.length === 0 ? (
        <p className="text-sm text-purple-300 italic">
          No notes here yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {notes.map((n) => (
            <li
              key={n._id}
              className="rounded-lg border border-purple-600/30 bg-purple-950/60 hover:bg-purple-800/50 transition"
            >
              <Link to={`/notes/${n._id}`} className="block p-4">
                <div className="font-medium text-white truncate">
                  {n.title || "Untitled"}
                </div>
                <div className="text-xs text-purple-300 mt-1">
                  updated {new Date(n.updatedAt).toLocaleString()}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
