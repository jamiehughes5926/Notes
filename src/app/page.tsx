"use client";

import React, { useState, useEffect } from "react";
import CategoriesSidebar from "./components/CategoriesSidebar";
import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";
import BottomBar from "./components/BottomBar";

interface Note {
  id: string;
  content: string;
  isFavorite: boolean;
  isDeleted?: boolean;
}

type Category = "all" | "favorites" | "trash";

const Home: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMarkdownView, setIsMarkdownView] = useState(false);

  const deleteNote = () => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === currentNoteId ? { ...note, isDeleted: true } : note
      )
    );
    setCurrentNoteId(null);
    setIsMarkdownView(false); // Switch to edit mode when deleting a note
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
      setIsLoaded(true);
    };

    loadNotes();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }, [notes, isLoaded]);

  const addNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: "",
      isFavorite: false,
    };
    setNotes((prevNotes) => [...prevNotes, newNote]);
    setCurrentNoteId(newNote.id);
    setSelectedCategory("all");
    setIsMarkdownView(false); // Ensure new notes open in edit mode
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
    setIsMarkdownView(false); // Switch to edit mode when selecting a note
  };

  const filteredNotes = notes.filter((note) => {
    if (selectedCategory === "favorites") {
      return note.isFavorite && !note.isDeleted;
    } else if (selectedCategory === "trash") {
      return note.isDeleted;
    }
    return !note.isDeleted;
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
      />
      <div className="flex flex-col flex-1">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            notes={filteredNotes}
            selectNote={selectNote}
            getTitle={getTitle}
          />
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
