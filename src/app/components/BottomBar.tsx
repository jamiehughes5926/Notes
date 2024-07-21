import React from "react";

interface BottomBarProps {
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onDeleteNote: () => void;
  isMarkdownView: boolean;
  onToggleMarkdownView: () => void;
}

const BottomBar: React.FC<BottomBarProps> = ({
  isFavorite,
  onToggleFavorite,
  onDeleteNote,
  isMarkdownView,
  onToggleMarkdownView,
}) => {
  return (
    <div className="h-12 bg-gray-100 border-t border-gray-200 flex items-center justify-between px-4">
      <div>
        <button
          onClick={onToggleFavorite}
          className={`mr-4 ${isFavorite ? "text-yellow-500" : "text-gray-500"}`}
        >
          {isFavorite ? "★" : "☆"}
        </button>
        <span className="text-sm text-gray-500">Last edited: Just now</span>
      </div>
      <div>
        <button
          onClick={onToggleMarkdownView}
          className="text-blue-500 hover:text-blue-700 mr-4"
        >
          {isMarkdownView ? "Edit" : "Preview"}
        </button>
        <button
          onClick={onDeleteNote}
          className="text-red-500 hover:text-red-700"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default BottomBar;
