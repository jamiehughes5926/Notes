import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Note {
  id: string;
  content: string;
  isFavorite: boolean;
}

interface NoteEditorProps {
  note: Note;
  onChange: (value: string) => void;
  isMarkdownView: boolean;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onChange,
  isMarkdownView,
}) => {
  return (
    <div className="flex-1 p-6 bg-white flex flex-col h-full">
      {isMarkdownView ? (
        <div className="prose max-w-full overflow-y-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {note.content}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={note.content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Start typing your note here..."
          className="w-full h-full p-2 resize-none overflow-y-auto text-lg focus:outline-none"
        />
      )}
    </div>
  );
};

export default NoteEditor;
