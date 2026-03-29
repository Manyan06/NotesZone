# 📝 NotesZone

A real-time collaborative note-taking web application built with the MERN stack (MongoDB, Express, React, Node.js and Socket.io. Create, share and edit notes with role-based access control (RBAC) and live synchronization.

🌐 **[Live Demo](https://noteszone0.netlify.app)**

---

## Features

### 🔐 Authentication & Security
- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Protected routes and API endpoints
- Token-based authorization

### 📄 Note Management
- Create, read, update, and delete personal notes
- Rich text editing interface
- Real-time auto-save functionality
- Organize notes by ownership and sharing status

### 🤝 Collaborative Features
- **Owner**: Full access to notes (CRUD operations + sharing management)
- **Editor**: Can view and modify note content
- **Viewer**: Read-only access to shared notes
- Share notes by email with specific role assignments
- Revoke access anytime

### ⚡ Real-Time Synchronization
- Live collaboration using Socket.io
- Instant updates across all connected clients
- Automatic reconnection handling
- Polling fallback for disconnected states
- Last-write-wins conflict resolution

### 🎨 Modern UI/UX
- Clean and intuitive interface
- Responsive design with Tailwind CSS
- Purple-themed dark mode aesthetic
- Separate dashboards for owned and shared notes

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Tailwind CSS** - Utility-first styling

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - WebSocket library
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing

---

## 🌐 Deployment

- **Frontend**: Deployed on [Netlify](https://www.netlify.com/)
- **Backend**: Deployed on [Render](https://render.com/)

---

## 📂 Project Structure

```
NotesZone/
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # Axios configuration
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth context provider
│   │   ├── pages/         # Route pages
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Express backend
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── middleware/   # Auth middleware
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Helper functions
│   │   └── index.js      # Server entry point
│   └── package.json
│
└── README.md             # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/Manyan06/NotesZone.git
cd NotesZone
```

### 2. Server Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
MONGO_URI=mongodb://127.0.0.1:27017/NotesZone
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_ORIGIN=http://localhost:5173
PORT=5000
```

Start the server:

```bash
npm run dev
```

Server will run on `http://localhost:5000`

### 3. Client Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the client:

```bash
npm run dev
```

Client will run on `http://localhost:5173`

### 4. Open in Browser

Navigate to `http://localhost:5173` and start taking notes! 🎉

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Login and receive JWT |

### Notes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/notes/owned` | Get notes you own | Authenticated |
| GET | `/api/notes/shared` | Get notes shared with you | Authenticated |
| GET | `/api/notes/:id` | Get a specific note | Owner/Editor/Viewer |
| POST | `/api/notes` | Create a new note | Authenticated |
| PUT | `/api/notes/:id` | Update a note | Owner/Editor |
| DELETE | `/api/notes/:id` | Delete a note | Owner |

### Sharing
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/share/:id` | Share a note with a user | Owner |
| DELETE | `/api/share/:id/:userId` | Revoke access from a user | Owner |

---

## 🌐 Socket.io Events

### Client → Server
- `join_note` - Join a note room for real-time updates
- `leave_note` - Leave a note room
- `client_note_update` - Send note changes to server

### Server → Client
- `server_note_init` - Initial note data when joining
- `server_note_update` - Broadcast changes to all clients
- `error_message` - Error notifications

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author

**Manyan06**
- GitHub: [@Manyan06](https://github.com/Manyan06)

---

## Acknowledgments

- Socket.io for real-time capabilities
- MongoDB for flexible data storage
- React and Vite for modern frontend tooling
- Tailwind CSS for beautiful styling

---

