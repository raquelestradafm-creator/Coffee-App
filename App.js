import React, { useMemo, useState } from "react";
import { CoffeeForm } from "./components/CoffeeForm.js";
import { DetailView } from "./components/DetailView.js";
import { HomeView } from "./components/HomeView.js";
import { emptyForm } from "./data.js";
import { loadBestId, loadEntries, saveBestId, saveEntries } from "./storage.js";
import { h } from "./react-utils.js";

export function App() {
  const [entries, setEntries] = useState(() => sortEntries(loadEntries()));
  const [bestId, setBestId] = useState(loadBestId);
  const [screen, setScreen] = useState("home");
  const [selectedId, setSelectedId] = useState("");

  const selectedEntry = useMemo(
    () => entries.find((entry) => entry.id === selectedId),
    [entries, selectedId]
  );

  function persist(nextEntries, nextBestId = bestId) {
    const sorted = sortEntries(nextEntries);
    setEntries(sorted);
    setBestId(nextBestId);
    saveEntries(sorted);
    saveBestId(nextBestId);
  }

  function handleSave(form) {
    const entry = {
      ...form,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    persist([entry, ...entries]);
    setScreen("home");
  }

  function handleDelete(id) {
    const nextBestId = bestId === id ? "" : bestId;
    persist(entries.filter((entry) => entry.id !== id), nextBestId);
    setSelectedId("");
    setScreen("home");
  }

  function handleSetBest(id) {
    persist(entries, bestId === id ? "" : id);
  }

  function openDetail(id) {
    setSelectedId(id);
    setScreen("detail");
  }

  return h(
    "div",
    { className: "min-h-screen bg-coffee-crema text-coffee-ink" },
    h(
      "main",
      { className: "mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-8 pt-5 sm:px-6" },
      screen === "home" &&
        h(HomeView, {
          entries,
          bestId,
          onNew: () => setScreen("form"),
          onOpen: openDetail
        }),
      screen === "form" &&
        h(CoffeeForm, {
          initialValue: emptyForm(),
          onCancel: () => setScreen("home"),
          onSave: handleSave
        }),
      screen === "detail" &&
        h(DetailView, {
          entry: selectedEntry,
          isBest: selectedEntry?.id === bestId,
          onBack: () => setScreen("home"),
          onDelete: handleDelete,
          onSetBest: handleSetBest
        })
    )
  );
}

function sortEntries(entries) {
  return [...entries].sort((a, b) => {
    const dateA = new Date(`${a.date}T00:00:00`).getTime();
    const dateB = new Date(`${b.date}T00:00:00`).getTime();
    if (dateA !== dateB) return dateB - dateA;
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });
}
