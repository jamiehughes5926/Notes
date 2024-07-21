import React from "react";

type Category = "all" | "favorites" | "trash";

interface CategoriesSidebarProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  addNewNote: () => void;
}

const CategoriesSidebar: React.FC<CategoriesSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  addNewNote,
}) => {
  return (
    <div className="w-48 bg-gray-900 text-white p-4 flex flex-col h-full">
      <button
        className="mb-4 text-left bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={addNewNote}
      >
        <span className="mr-2">+</span>New note
      </button>
      <nav>
        <ul>
          <li
            className={`mb-2 cursor-pointer hover:bg-gray-700 p-2 rounded ${
              selectedCategory === "all" ? "bg-gray-700" : ""
            }`}
            onClick={() => onSelectCategory("all")}
          >
            <span className="mr-2">📝</span>All Notes
          </li>
          <li
            className={`mb-2 cursor-pointer hover:bg-gray-700 p-2 rounded ${
              selectedCategory === "favorites" ? "bg-gray-700" : ""
            }`}
            onClick={() => onSelectCategory("favorites")}
          >
            <span className="mr-2">⭐</span>Favorites
          </li>
          <li
            className={`mb-2 cursor-pointer hover:bg-gray-700 p-2 rounded ${
              selectedCategory === "trash" ? "bg-gray-700" : ""
            }`}
            onClick={() => onSelectCategory("trash")}
          >
            <span className="mr-2">🗑️</span>Trash
          </li>
        </ul>
      </nav>
      <div className="mt-auto">
        <h3 className="text-sm uppercase text-gray-500 mb-2">Categories</h3>
        <button className="text-left w-full hover:bg-gray-700 p-2 rounded">
          <span className="mr-2">+</span>Add Category
        </button>
      </div>
    </div>
  );
};

export default CategoriesSidebar;
