import React from "react";

interface BottomBarProps {
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const BottomBar: React.FC<BottomBarProps> = ({
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div className="h-12 bg-gray-100 border-t border-gray-200 flex items-center px-4">
      <button
        onClick={onToggleFavorite}
        className={`mr-4 ${isFavorite ? "text-yellow-500" : "text-gray-500"}`}
      >
        {isFavorite ? "★" : "☆"}
      </button>
      <span className="text-sm text-gray-500">Last edited: Just now</span>
    </div>
  );
};

export default BottomBar;
