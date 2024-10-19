"use client"
import { useState } from 'react';
import ReactQuill from 'react-quill';

interface NoteEditorProps {
  onSave: (content: string, tags: string[]) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ onSave }) => {
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string>('');

  return (
    <div className="editor-container">
      <ReactQuill theme="snow" value={content} onChange={setContent} />
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="border mt-4 p-2 rounded w-full"
        placeholder="Tags (comma separated)"
      />
      <button
        onClick={() => onSave(content, tags.split(',').map(tag => tag.trim()))}
        className="bg-blue-500 text-white p-2 mt-4 rounded"
      >
        Save Note
      </button>
    </div>
  );
};

export default NoteEditor;
