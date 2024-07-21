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
  isTrashed: boolean;
}

type Category = "all" | "favorites" | "trash";

const Home: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMarkdownView, setIsMarkdownView] = useState(false);

  const deleteNote = () => {
    setNotes((prevNotes) =>
      prevNotes.map((note, index) =>
        index === currentNoteIndex ? { ...note, isTrashed: true } : note
      )
    );
    setCurrentNoteIndex((prevIndex) =>
      Math.min(prevIndex, notes.filter((note) => !note.isTrashed).length - 1)
    );
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
          isTrashed: false,
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
      isTrashed: false,
    };
    setNotes((prevNotes) => [...prevNotes, newNote]);
    setCurrentNoteIndex(notes.length);
    setSelectedCategory("all");
  };

  const updateNote = (value: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note, index) =>
        index === currentNoteIndex ? { ...note, content: value } : note
      )
    );
  };

  const toggleFavorite = () => {
    setNotes((prevNotes) =>
      prevNotes.map((note, index) =>
        index === currentNoteIndex
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
    const plainTitle = firstLine.replace(/^#+\s*/, "");
    return plainTitle || "Untitled Note";
  };

  const filteredNotes =
    selectedCategory === "favorites"
      ? notes.filter((note) => note.isFavorite && !note.isTrashed)
      : selectedCategory === "trash"
      ? notes.filter((note) => note.isTrashed)
      : notes.filter((note) => !note.isTrashed);

  useEffect(() => {
    if (filteredNotes.length > 0) {
      setCurrentNoteIndex(0);
    }
  }, [selectedCategory, filteredNotes.length]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <CategoriesSidebar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        addNewNote={addNewNote}
      />
      <div className="flex flex-col flex-1">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            notes={filteredNotes}
            selectNote={setCurrentNoteIndex}
            getTitle={getTitle}
          />
          {filteredNotes.length > 0 ? (
            <NoteEditor
              note={filteredNotes[currentNoteIndex]}
              onChange={updateNote}
              isMarkdownView={isMarkdownView}
            />
          ) : (
            <div className="flex-1 p-6 bg-white flex flex-col h-full">
              <p>No notes available</p>
            </div>
          )}
        </div>
        {filteredNotes.length > 0 && (
          <BottomBar
            isFavorite={filteredNotes[currentNoteIndex]?.isFavorite || false}
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
