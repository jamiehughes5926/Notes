import React, { useState, useEffect } from "react";

type Category = "all" | "favorites" | "trash" | string;

interface Note {
  id: string;
  content: string;
  isFavorite: boolean;
  isDeleted?: boolean;
  category?: string;
}

interface CategoriesSidebarProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  addNewNote: (category?: string) => void;
  notes: Note[];
  selectNote: (id: string) => void;
  getTitle: (content: string) => string;
  onSearch: (query: string) => void;
  customCategories: string[];
  addCategory: (name: string) => void;
  clearTrash: () => void;
}

const CategoriesSidebar: React.FC<CategoriesSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  addNewNote,
  notes,
  selectNote,
  getTitle,
  onSearch,
  customCategories,
  addCategory,
  clearTrash,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<{
    [key in Category]: boolean;
  }>({
    all: true,
    favorites: false,
    trash: false,
  });

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showClearTrashConfirm, setShowClearTrashConfirm] = useState(false);

  useEffect(() => {
    const filtered = notes.filter((note) =>
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNotes(filtered);
  }, [searchQuery, notes]);

  const toggleCategory = (category: Category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName);
      setNewCategoryName("");
    }
  };

  const handleClearTrash = () => {
    setShowClearTrashConfirm(true);
  };

  const confirmClearTrash = () => {
    clearTrash();
    setShowClearTrashConfirm(false);
  };

  const cancelClearTrash = () => {
    setShowClearTrashConfirm(false);
  };

  const renderCategory = (category: Category, icon: string) => (
    <li key={category}>
      <div className="mb-2 p-2 rounded flex items-center">
        {category !== "trash" && (
          <button
            className="mr-2 text-gray-400 hover:text-white focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              addNewNote(category === "all" ? undefined : category);
            }}
          >
            +
          </button>
        )}
        <div
          className={`flex-grow flex items-center justify-between cursor-pointer ${
            selectedCategory === category ? "bg-gray-700" : ""
          }`}
          onClick={() => {
            onSelectCategory(category);
            toggleCategory(category);
          }}
        >
          <div className="flex items-center">
            <span className="mr-2">{icon}</span>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </div>
          <span className="ml-2">
            {expandedCategories[category] ? "▼" : "▶"}
          </span>
        </div>
      </div>
      {expandedCategories[category] && (
        <ul className="ml-4">
          {filteredNotes
            .filter((note) => {
              if (category === "favorites")
                return note.isFavorite && !note.isDeleted;
              if (category === "trash") return note.isDeleted;
              if (category === "all") return !note.isDeleted;
              return note.category === category && !note.isDeleted;
            })
            .map((note) => (
              <li
                key={note.id}
                className="cursor-pointer p-2 mb-2"
                onClick={() => selectNote(note.id)}
              >
                {getTitle(note.content)}
              </li>
            ))}
          {category === "trash" && (
            <li>
              <button
                onClick={handleClearTrash}
                className="w-full text-left p-2 text-red-500 hover:text-red-700"
              >
                Clear Trash
              </button>
            </li>
          )}
        </ul>
      )}
    </li>
  );

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-48"
      } bg-gray-900 text-white flex flex-col h-full transition-width duration-300 ease-in-out flex-shrink-0`}
    >
      <div className="p-4 flex-shrink-0">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-white focus:outline-none mb-4"
        >
          {isCollapsed ? "→" : "←"}
        </button>
        {!isCollapsed && (
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="mb-4 p-2 rounded bg-gray-800 text-white w-full"
          />
        )}
      </div>
      {!isCollapsed && (
        <div className="flex-grow overflow-y-auto">
          <nav className="p-4">
            <ul>
              {renderCategory("all", "📝")}
              {renderCategory("favorites", "⭐")}
              {renderCategory("trash", "🗑️")}
              {customCategories.map((category) =>
                renderCategory(category, "📁")
              )}
            </ul>
          </nav>
        </div>
      )}
      {!isCollapsed && (
        <div className="p-4 flex-shrink-0">
          <h3 className="text-sm uppercase text-gray-500 mb-2">CATEGORIES</h3>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category..."
            className="mb-2 p-2 rounded bg-gray-800 text-white w-full"
          />
          <button
            className="text-left w-full p-2 bg-green-500 text-white font-bold py-1 px-2 rounded"
            onClick={handleAddCategory}
          >
            <span className="mr-2">+</span>Add Category
          </button>
        </div>
      )}
      {showClearTrashConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg text-black">
            <p>
              Are you sure you want to permanently delete all trashed notes?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={cancelClearTrash}
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearTrash}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesSidebar;
