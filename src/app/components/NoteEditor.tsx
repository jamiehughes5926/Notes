import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

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

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onChange,
  isMarkdownView,
}) => {
  const components: Components = {
    code({ node, inline, className, children, ...props }: CodeProps) {
      return !inline ? (
        <pre className="bg-gray-800 p-4 rounded-md overflow-auto red-code">
          <code className="text-red-500" {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code
          className="bg-gray-800 text-red-500 p-1 rounded-md red-code"
          {...props}
        >
          {children}
        </code>
      );
    },
  };

  return (
    <div className="flex-1 p-6 bg-white flex flex-col h-full">
      {isMarkdownView ? (
        <div className="prose max-w-none w-full overflow-y-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={components}
          >
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
