"use client"


import { useNotebookStore } from '@/hooks/use-notebook-store';
import { useState } from 'react';
import NoteEditor from './NoteEditor';


const Notebook = () => {
  const { notes, addNote, updateNote, removeNote } = useNotebookStore();
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>('Untitled');

  const handleSaveNote = (content: string) => {
    const newNote = {
      id: Date.now().toString(),
      title: newTitle,
      content,
      tags: [],
    };
    addNote(newNote);
    setNewTitle('Untitled'); // Reset title input
  };
  

  return (
    <div className="flex h-screen">
      {/* Sidebar for notes list */}
      <div className="w-1/4 p-4 bg-gray-100 border-r">
        <h2 className="text-2xl font-semibold mb-4">Your Notes</h2>
        <ul className="space-y-2">
          {notes.map((note) => (
            <li
              key={note.id}
              className={`cursor-pointer p-2 rounded ${selectedNote === note.id ? 'bg-blue-200' : 'bg-white'}`}
              onClick={() => setSelectedNote(note.id)}
            >
              {note.title}
            </li>
          ))}
        </ul>
        <button
          onClick={() => setSelectedNote(null)}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          + Add New Note
        </button>
      </div>

      {/* Note Editor */}
      <div className="w-3/4 p-6">
        {selectedNote ? (
          <div>
            <h3 className="text-lg mb-4">Edit Note</h3>
            <NoteEditor 
              onSave={(content) => updateNote(selectedNote, { content })}
            />
            <button
              onClick={() => removeNote(selectedNote)}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
            >
              Delete Note
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-lg mb-4">New Note</h3>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="border p-2 rounded mb-4 w-full"
              placeholder="Note Title"
            />
            <NoteEditor onSave={handleSaveNote} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notebook;
