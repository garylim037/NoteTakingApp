const mongoose = require('mongoose');

// This schema mirrors the Note interface in storage/noteStorage.ts:
// { id, title, content, category, createdAt, updatedAt }
const noteSchema = new mongoose.Schema(
  {
    // We store the original device id from AsyncStorage so we can match
    // notes on re-sync without creating duplicates.
    deviceId: {
      type: String,
      required: true,
      unique: true,  // one cloud record per device note id
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [3, 'Title must be at least 3 characters'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [5, 'Content must be at least 5 characters'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Study', 'Personal', 'Ideas'],
      default: 'Personal',
    },
    // Keep the original timestamps from the device for display accuracy
    deviceCreatedAt: { type: String },
    deviceUpdatedAt: { type: String },
  },
  {
    // Mongoose auto-manages createdAt / updatedAt on the server side too
    timestamps: true,
  }
);

module.exports = mongoose.model('Note', noteSchema);
