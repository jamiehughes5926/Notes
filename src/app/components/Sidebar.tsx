import React from "react";

interface Note {
  id: string;
  content: string;
  isFavorite: boolean;
}

interface SidebarProps {
  notes: Note[];
  selectNote: (index: number) => void;
  getTitle: (content: string) => string;
}

const Sidebar: React.FC<SidebarProps> = ({ notes, selectNote, getTitle }) => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">Notes</h2>
      <ul className="overflow-y-auto flex-grow">
        {notes.map((note, index) => (
          <li
            key={note.id}
            onClick={() => selectNote(index)}
            className="cursor-pointer p-2 hover:bg-gray-700 rounded mb-2"
          >
            {getTitle(note.content)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
