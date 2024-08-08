"use client";

import React, { useState, useEffect } from "react";
import CategoriesSidebar from "./components/CategoriesSidebar";
import NoteEditor from "./components/NoteEditor";
import BottomBar from "./components/BottomBar";

interface Note {
  id: string;
  content: string;
  isFavorite: boolean;
  isDeleted?: boolean;
  category?: string;
}

type Category = "all" | "favorites" | "trash" | string;

const Home: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMarkdownView, setIsMarkdownView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  const deleteNote = () => {
    if (!currentNoteId) return;

    const currentNote = notes.find((note) => note.id === currentNoteId);
    if (!currentNote) return;

    if (currentNote.isDeleted) {
      // Permanent deletion
      setNotes((prevNotes) =>
        prevNotes.filter((note) => note.id !== currentNoteId)
      );
    } else {
      // Move to trash
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === currentNoteId
            ? { ...note, isDeleted: true, category: undefined }
            : note
        )
      );
    }
    setCurrentNoteId(null);
    setIsMarkdownView(false);
  };

  useEffect(() => {
    const loadNotes = () => {
      const savedNotes = localStorage.getItem("notes");
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      } else {
        const defaultNote: Note = {
          id: Date.now().toString(),
          content: "Welcome to your notes app!",
          isFavorite: false,
        };
        setNotes([defaultNote]);
      }
    };

    const loadCustomCategories = () => {
      const savedCategories = localStorage.getItem("customCategories");
      if (savedCategories) {
        setCustomCategories(JSON.parse(savedCategories));
      }
    };

    loadNotes();
    loadCustomCategories();
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }, [notes, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        "customCategories",
        JSON.stringify(customCategories)
      );
    }
  }, [customCategories, isLoaded]);

  const addNewNote = (category?: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: "",
      isFavorite: false,
      category: category || undefined,
    };
    setNotes((prevNotes) => [...prevNotes, newNote]);
    setCurrentNoteId(newNote.id);
    setSelectedCategory(category || "all");
    setIsMarkdownView(false);
  };

  const updateNote = (value: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === currentNoteId ? { ...note, content: value } : note
      )
    );
  };

  const toggleFavorite = () => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === currentNoteId
          ? { ...note, isFavorite: !note.isFavorite }
          : note
      )
    );
  };

  const toggleMarkdownView = () => {
    setIsMarkdownView(!isMarkdownView);
  };

  const getTitle = (content: string) => {
    const firstLine = content.split("\n")[0].trim();
    return firstLine || "Untitled Note";
  };

  const selectNote = (id: string) => {
    setCurrentNoteId(id);
    setIsMarkdownView(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddCategory = (name: string) => {
    if (!customCategories.includes(name)) {
      setCustomCategories((prevCategories) => [...prevCategories, name]);
    }
  };

  const clearTrash = () => {
    setNotes((prevNotes) => prevNotes.filter((note) => !note.isDeleted));
    if (selectedCategory === "trash") {
      setCurrentNoteId(null);
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.content
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (selectedCategory === "favorites") {
      return note.isFavorite && !note.isDeleted && matchesSearch;
    } else if (selectedCategory === "trash") {
      return note.isDeleted && matchesSearch;
    } else if (customCategories.includes(selectedCategory)) {
      return (
        note.category === selectedCategory && !note.isDeleted && matchesSearch
      );
    }
    return !note.isDeleted && matchesSearch;
  });

  const currentNote =
    notes.find((note) => note.id === currentNoteId) || filteredNotes[0];

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <CategoriesSidebar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        addNewNote={addNewNote}
        notes={notes}
        selectNote={selectNote}
        getTitle={getTitle}
        onSearch={handleSearch}
        customCategories={customCategories}
        addCategory={handleAddCategory}
        clearTrash={clearTrash}
      />

      <div className="flex flex-col flex-1 h-full">
        <div className="flex flex-1 overflow-hidden h-full">
          {currentNote && (
            <NoteEditor
              note={currentNote}
              onChange={updateNote}
              isMarkdownView={isMarkdownView}
            />
          )}
        </div>
        {currentNote && (
          <BottomBar
            isFavorite={currentNote.isFavorite}
            onToggleFavorite={toggleFavorite}
            onDeleteNote={deleteNote}
            isMarkdownView={isMarkdownView}
            onToggleMarkdownView={toggleMarkdownView}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
