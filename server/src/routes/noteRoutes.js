import express from "express";
import Note from "../models/Note.js";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
import { getUserAccess, hasAccess } from "../utils/access.js";

const router = express.Router();

// All routes below require auth
router.use(auth);

// List notes owned by the user
router.get("/owned", async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.user.id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// List notes shared with the user
router.get("/shared", async (req, res) => {
  try {
    const notes = await Note.find({ "sharedWith.user": req.user.id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new note
router.post("/", async (req, res) => {
  try {
    const { title = "", content = "" } = req.body;
    const note = await Note.create({ title, content, owner: req.user.id, sharedWith: [] });
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a note by id (with access info)
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).lean();
    if (!note) return res.status(404).json({ message: "Note not found" });

    const access = getUserAccess(note, req.user.id);
    if (!access) return res.status(403).json({ message: "No access" });

    res.json({ ...note, access });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a note (owner or editor)
router.put("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (!hasAccess(note, req.user.id, ["owner", "editor"])) return res.status(403).json({ message: "No access" });

    const allowed = {};
    if (typeof req.body.title === "string") allowed.title = req.body.title;
    if (typeof req.body.content === "string") allowed.content = req.body.content;

    Object.assign(note, allowed);
    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a note (owner only)
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (!hasAccess(note, req.user.id, ["owner"])) return res.status(403).json({ message: "No access" });
    await note.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Share note (owner only)
router.post("/:id/share", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (!hasAccess(note, req.user.id, ["owner"])) return res.status(403).json({ message: "Owner only" });

    const { email, role } = req.body;
    if (!email || !["viewer", "editor"].includes(role)) {
      return res.status(400).json({ message: "Email and role (viewer|editor) required" });
    }

    const target = await User.findOne({ email });
    if (!target) return res.status(404).json({ message: "Target user not found" });
    if (String(target._id) === String(note.owner)) {
      return res.status(400).json({ message: "Owner already has full access" });
    }

    const idx = note.sharedWith.findIndex(sw => String(sw.user) == String(target._id));
    if (idx >= 0) {
      note.sharedWith[idx].role = role;
    } else {
      note.sharedWith.push({ user: target._id, role });
    }
    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Unshare note (owner only)
router.post("/:id/unshare", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (!hasAccess(note, req.user.id, ["owner"])) return res.status(403).json({ message: "Owner only" });

    const { email, userId } = req.body || {};
    if (!email && !userId) {
      return res.status(400).json({ message: "Email or userId required" });
    }

    let targetId = userId;
    if (!targetId) {
      const target = await User.findOne({ email });
      if (!target) return res.status(404).json({ message: "Target user not found" });
      targetId = target._id;
    }

    const targetIdStr = String(targetId);
    const before = note.sharedWith.length;
    note.sharedWith = note.sharedWith.filter(sw => String(sw.user) !== targetIdStr);
    if (note.sharedWith.length === before) {
      return res.status(404).json({ message: "Target user not shared" });
    }

    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
