import { getAllNotes, Note } from './noteStorage';

const API_BASE_URL = 'http://10.0.2.2:8000/api';


// ─── Shared fetch helper ────────────────────────────────────────────────────
async function apiFetch(path: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...options,
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `HTTP ${response.status}`);
  }
  return response.json();
}

// ─── CloudApi ───────────────────────────────────────────────────────────────
export const CloudApi = {

  // SYNC - Push all local notes to cloud (called by "BACKUP TO CLOUD" button)
  syncToCloud: async (): Promise<boolean> => {
    try {
      const localNotes = await getAllNotes();
      const result = await apiFetch('/notes/sync', {
        method: 'POST',
        body: JSON.stringify({ notes: localNotes }),
      });
      console.log('Cloud Sync Success:', result);
      return true;
    } catch (error) {
      console.error('Cloud Sync Failed:', error);
      return false;
    }
  },

  // READ - Fetch all notes from the cloud
  fetchAllFromCloud: async (): Promise<Note[]> => {
    try {
      const result = await apiFetch('/notes');
      return result.notes.map((n: any) => ({
        id: n.deviceId,
        title: n.title,
        content: n.content,
        category: n.category,
        createdAt: n.deviceCreatedAt || n.createdAt,
        updatedAt: n.deviceUpdatedAt || n.updatedAt,
      }));
    } catch (error) {
      console.error('Fetch Failed:', error);
      return [];
    }
  },

  // CREATE - Upload a single note to the cloud
  createInCloud: async (note: Note): Promise<boolean> => {
    try {
      await apiFetch('/notes', {
        method: 'POST',
        body: JSON.stringify(note),
      });
      return true;
    } catch (error) {
      console.error('Cloud Create Failed:', error);
      return false;
    }
  },

  // UPDATE - Update a cloud note by MongoDB _id
  updateInCloud: async (
    cloudId: string,
    title: string,
    content: string,
    category: string,
  ): Promise<boolean> => {
    try {
      await apiFetch(`/notes/${cloudId}`, {
        method: 'PUT',
        body: JSON.stringify({ title, content, category }),
      });
      return true;
    } catch (error) {
      console.error('Cloud Update Failed:', error);
      return false;
    }
  },

  // DELETE - Delete a cloud note by MongoDB _id
  deleteFromCloud: async (cloudId: string): Promise<boolean> => {
    try {
      await apiFetch(`/notes/${cloudId}`, { method: 'DELETE' });
      return true;
    } catch (error) {
      console.error('Cloud Delete Failed:', error);
      return false;
    }
  },
};
