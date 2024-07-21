import React from "react";

interface Note {
  id: string;
  content: string;
  isFavorite: boolean;
}

interface NoteEditorProps {
  note: Note;
  onChange: (value: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onChange }) => {
  return (
    <div className="flex-1 p-6 bg-white flex flex-col h-full">
      <textarea
        value={note.content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start typing your note here..."
        className="w-full h-full p-2 resize-none overflow-y-auto text-lg focus:outline-none"
      />
    </div>
  );
};

export default NoteEditor;
