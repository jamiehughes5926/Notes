import React, { useState } from "react";

type Category = "all" | "favorites" | "trash";

interface Note {
  id: string;
  content: string;
  isFavorite: boolean;
  isDeleted?: boolean;
}

interface CategoriesSidebarProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  addNewNote: () => void;
  notes: Note[];
  selectNote: (id: string) => void;
  getTitle: (content: string) => string;
}

const CategoriesSidebar: React.FC<CategoriesSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  addNewNote,
  notes,
  selectNote,
  getTitle,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<{
    [key in Category]: boolean;
  }>({
    all: true,
    favorites: false,
    trash: false,
  });

  const toggleCategory = (category: Category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const filteredNotes = (category: Category) => {
    if (category === "favorites") {
      return notes.filter((note) => note.isFavorite && !note.isDeleted);
    } else if (category === "trash") {
      return notes.filter((note) => note.isDeleted);
    }
    return notes.filter((note) => !note.isDeleted);
  };

  return (
    <div className="w-48 bg-gray-900 text-white p-4 flex flex-col h-full">
      <button
        className="mb-4 text-left bg-blue-500 text-white font-bold py-2 px-4 rounded"
        onClick={addNewNote}
      >
        <span className="mr-2">+</span>New note
      </button>
      <nav>
        <ul>
          {(["all", "favorites", "trash"] as Category[]).map((category) => (
            <li key={category}>
              <div
                className={`mb-2 cursor-pointer p-2 rounded ${
                  selectedCategory === category ? "bg-gray-700" : ""
                } flex justify-between`}
                onClick={() => {
                  onSelectCategory(category);
                  toggleCategory(category);
                }}
              >
                <span className="flex items-center">
                  <span className="mr-2">
                    {category === "all" && "📝"}
                    {category === "favorites" && "⭐"}
                    {category === "trash" && "🗑️"}
                  </span>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
                <span>{expandedCategories[category] ? "▼" : "▶"}</span>
              </div>
              {expandedCategories[category] && (
                <ul className="ml-4">
                  {filteredNotes(category).map((note) => (
                    <li
                      key={note.id}
                      className="cursor-pointer p-2  mb-2"
                      onClick={() => selectNote(note.id)}
                    >
                      {getTitle(note.content)}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <h3 className="text-sm uppercase text-gray-500 mb-2">Categories</h3>
        <button className="text-left w-full p-2 ">
          <span className="mr-2">+</span>Add Category
        </button>
      </div>
    </div>
  );
};

export default CategoriesSidebar;
