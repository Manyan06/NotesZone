📝 Collaborative Notes (MERN + Socket.io)
A basic collaborative note-taking web app built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io for real-time sync.

Users can create, share, and edit notes with role-based access control:

Owner → Full access (CRUD + sharing)
Editor → Can update content
Viewer → Read-only access
🚀 Features
Authentication

Register & Login with JWT
Passwords hashed with bcrypt
Protected routes via middleware
Notes

CRUD for personal notes
Each note has: title, content, owner, sharedWith: [{ user, role }]
Role-based access enforcement
Sharing

Owners can share notes by email
Assign role: viewer or editor
Owners can revoke sharing
Real-Time Collaboration

Socket.io for live sync (last-write-wins)
Polling fallback if socket disconnects
Reconnect & resync logic included
Frontend (React + Vite)

Login & Register pages
Dashboard: shows owned & shared notes
Note Editor: role-aware (editable vs read-only)
Simple clean UI
📂 Project Structure
collab-notes-mern/
│
├── client/               # React frontend (Vite)
│   ├── src/
│   └── .env.example
│
├── server/               # Express backend + Socket.io
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── .env.example
│
├── README.md             # This file
└── .gitignore
⚙️ Setup Instructions
1. Clone Repo
git clone 
2. Server Setup
cd server
cp .env.example .env
# Edit .env values (Mongo URI, JWT secret, client origin)
npm install
npm run dev
.env example:

MONGO_URI=mongodb://127.0.0.1:27017/NotesZone
JWT_SECRET=supersecretkey
CLIENT_ORIGIN=http://localhost:5173
3. Client Setup
cd ../client
cp .env.example .env
# Edit API URL
npm install
npm run dev
.env example:

VITE_API_URL=http://localhost:5000
4. Open in Browser
Go to:
👉 http://localhost:5173

🛠 API Endpoints
Auth
POST /api/auth/register → Create account
POST /api/auth/login → Login, returns JWT
Notes
POST /api/notes → Create note
GET /api/notes/owned → Notes you own
GET /api/notes/shared → Notes shared with you
GET /api/notes/:id → Get single note
PUT /api/notes/:id → Update note (Owner/Editor)
DELETE /api/notes/:id → Delete note (Owner)
Sharing
POST /api/notes/:id/share → Share note { email, role }
POST /api/notes/:id/unshare → Remove a user
🔄 Real-Time Notes
When multiple users open the same note:
Changes sync instantly via Socket.io
If socket disconnects → fallback polling every 5s
On reconnect → note content is resynced
🌐 Deployment
Backend (Render)
Deploy /server to Render
Add environment variables from .env
Frontend (Netlify)
Deploy /client to Netlify
Set VITE_API_URL to your Render backend URL
📌 Assumptions & Notes
Authentication

JWT tokens are short-lived (1h by default); refresh token flow not implemented (kept simple).
Email uniqueness is enforced during registration.
Notes

Each note has exactly one owner.
Owners can’t be removed from their own note.
A note must always have a title (content can be empty).
Roles & Access Control

Owner → Full control (CRUD + sharing).
Editor → Can modify content, but cannot delete or share.
Viewer → Read-only, no edits allowed.
Owners can change or revoke roles anytime.
Sharing

Notes are shared by user email (assumes that email belongs to an existing registered user).
No email invitation system (user must already exist).
Real-Time Collaboration

Socket.io used for real-time updates.
Conflict resolution = last-write-wins.
If socket disconnects, app falls back to polling every 5s.
Security

Passwords are hashed with bcrypt.
All note routes are protected by JWT middleware.
No rate limiting or advanced security (e.g., brute-force protection) in this MVP.
Deployment

Designed to run with MongoDB Atlas or local MongoDB.
Example .env files included for both client and server.
Works with Netlify (client) and Render (server) deployments.
UI/UX

Minimal UI for clarity (React + Vite).
Can be enhanced with Material UI / Tailwind for production.
Basic editor (textarea) — no rich-text support.
