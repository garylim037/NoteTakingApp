const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/notes/sync
// Called by CloudApi.syncToCloud() in the React Native app.
// Receives the full local notes array and upserts each one into MongoDB.
// "Upsert" = insert if new, update if already exists (matched by deviceId).
// ─────────────────────────────────────────────────────────────────────────────
router.post('/sync', async (req, res) => {
  try {
    const { notes } = req.body;

    if (!Array.isArray(notes)) {
      return res.status(400).json({ error: 'Request body must include a "notes" array.' });
    }

    if (notes.length === 0) {
      return res.json({ message: 'No notes to sync.', synced: 0 });
    }

    // Upsert every note from the device
    const ops = notes.map((note) => ({
      updateOne: {
        filter: { deviceId: note.id },        // match by device-side id
        update: {
          $set: {
            deviceId: note.id,
            title: note.title,
            content: note.content,
            category: note.category,
            deviceCreatedAt: note.createdAt,
            deviceUpdatedAt: note.updatedAt,
          },
        },
        upsert: true,                          // create if missing
      },
    }));

    const result = await Note.bulkWrite(ops);

    return res.json({
      message: 'Sync successful',
      synced: notes.length,
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
    });
  } catch (err) {
    console.error('Sync error:', err.message);
    return res.status(500).json({ error: 'Server error during sync.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/notes
// Returns all notes stored in the cloud (for the assignment demo).
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 });
    return res.json({ notes });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch notes.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/notes/:id
// Returns one note by its MongoDB _id.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found.' });
    return res.json({ note });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch note.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/notes
// Create a single new note directly in the cloud (full CRUD requirement).
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { title, content, category, id, createdAt, updatedAt } = req.body;

    const note = new Note({
      deviceId: id || Date.now().toString(),
      title,
      content,
      category: category || 'Personal',
      deviceCreatedAt: createdAt || new Date().toISOString(),
      deviceUpdatedAt: updatedAt || new Date().toISOString(),
    });

    const saved = await note.save();
    return res.status(201).json({ message: 'Note created', note: saved });
  } catch (err) {
    // Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    return res.status(500).json({ error: 'Failed to create note.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/notes/:id
// Update a note by its MongoDB _id.
// ─────────────────────────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        category,
        deviceUpdatedAt: new Date().toISOString(),
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Note not found.' });
    return res.json({ message: 'Note updated', note: updated });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    return res.status(500).json({ error: 'Failed to update note.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/notes/:id
// Delete a note by its MongoDB _id.
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Note not found.' });
    return res.json({ message: 'Note deleted' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete note.' });
  }
});

module.exports = router;
