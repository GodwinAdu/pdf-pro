import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Note {
    id: string;
    title: string;
    content: string;
    tags: string[];
}

interface NotebookState {
    notes: Note[];
    addNote: (note: Note) => void;
    updateNote: (id: string, updatedNote: Partial<Note>) => void;
    removeNote: (id: string) => void;
}

export const useNotebookStore = create(
    persist<NotebookState>(
        (set) => ({
            notes: [],
            addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
            updateNote: (id, updatedNote) =>
                set((state) => ({
                    notes: state.notes.map((note) =>
                        note.id === id ? { ...note, ...updatedNote } : note
                    ),
                })),
            removeNote: (id) =>
                set((state) => ({
                    notes: state.notes.filter((note) => note.id !== id),
                })),
        }),
        {
            name: 'notebook-storage', // Key to store in localStorage
        }
    )
);
