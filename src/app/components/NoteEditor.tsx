import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeRunner from "./CodeRunner";

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

const extractCodeBlocks = (content: string) => {
  const parts = content.split(/\[CODE\]|\[\/CODE\]/);
  let sections = [];
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      sections.push({ type: "markdown", content: parts[i] });
    } else {
      const htmlMatch = parts[i].match(/\[HTML\](.*?)\[\/HTML\]/s);
      const cssMatch = parts[i].match(/\[CSS\](.*?)\[\/CSS\]/s);
      const jsMatch = parts[i].match(/\[JS\](.*?)\[\/JS\]/s);
      sections.push({
        type: "code",
        html: htmlMatch ? htmlMatch[1] : "",
        css: cssMatch ? cssMatch[1] : "",
        js: jsMatch ? jsMatch[1] : "",
      });
    }
  }
  return sections;
};

const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onChange,
  isMarkdownView,
}) => {
  const sections = extractCodeBlocks(note.content);

  return (
    <div className="flex-1 p-6 bg-white flex flex-col h-full overflow-y-auto">
      {isMarkdownView ? (
        sections.map((section, index) =>
          section.type === "markdown" ? (
            <div key={index} className="prose max-w-full">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {section.content}
              </ReactMarkdown>
            </div>
          ) : (
            <CodeRunner
              key={index}
              html={section.html || ""}
              css={section.css || ""}
              js={section.js || ""}
            />
          )
        )
      ) : (
        <textarea
          value={note.content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Start typing your note here..."
          className="w-full h-full p-2 resize-none text-lg focus:outline-none"
        />
      )}
    </div>
  );
};

export default NoteEditor;
