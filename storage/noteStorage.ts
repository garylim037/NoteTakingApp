// storage/noteStorage.ts  ← CREATE THIS FILE (new folder + new file)

import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = 'notes';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// READ - get all notes
export async function getAllNotes(): Promise<Note[]> {
  try {
    const json = await AsyncStorage.getItem(NOTES_KEY);
    return json ? (JSON.parse(json) as Note[]) : [];
  } catch (error) {
    console.error('getAllNotes error:', error);
    return [];
  }
}

// READ - get one note by id
export async function getNoteById(id: string): Promise<Note | null> {
  try {
    const notes = await getAllNotes();
    return notes.find(n => n.id === id) ?? null;
  } catch (error) {
    console.error('getNoteById error:', error);
    return null;
  }
}

// CREATE - save a new note
export async function createNote(
  title: string,
  content: string,
  category: string,
): Promise<Note> {
  const now = new Date().toISOString();
  const newNote: Note = {
    id: Date.now().toString(),
    title: title.trim(),
    content: content.trim(),
    category,
    createdAt: now,
    updatedAt: now,
  };
  const notes = await getAllNotes();
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify([newNote, ...notes]));
  return newNote;
}

// UPDATE - edit an existing note
export async function updateNote(
  id: string,
  title: string,
  content: string,
  category: string,
): Promise<Note | null> {
  const notes = await getAllNotes();
  const index = notes.findIndex(n => n.id === id);
  if (index === -1) return null;

  const updatedNote: Note = {
    ...notes[index],
    title: title.trim(),
    content: content.trim(),
    category,
    updatedAt: new Date().toISOString(),
  };
  notes[index] = updatedNote;
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  return updatedNote;
}

// DELETE - remove a note by id
export async function deleteNote(id: string): Promise<boolean> {
  const notes = await getAllNotes();
  const filtered = notes.filter(n => n.id !== id);
  if (filtered.length === notes.length) return false;
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(filtered));
  return true;
}

// SEED - fill sample data on first launch
export async function seedNotesIfEmpty(): Promise<void> {
  const notes = await getAllNotes();
  if (notes.length > 0) return;
  const now = new Date().toISOString();
  const samples: Note[] = [
    { id: '1', title: 'Shopping List', content: 'Buy milk, bread, eggs, and fruits.', category: 'Personal', createdAt: now, updatedAt: now },
    { id: '2', title: 'Class Reminder', content: 'Submit WAD assignment before Sunday 11:59 PM.', category: 'Study', createdAt: now, updatedAt: now },
    { id: '3', title: 'Ideas', content: 'Create a note-taking app with clean UI and navigation.', category: 'Ideas', createdAt: now, updatedAt: now },
  ];
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(samples));
}