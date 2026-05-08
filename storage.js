const STORAGE_KEY = "diario-cafe.registros";
const BEST_KEY = "diario-cafe.mejor";

export function loadEntries() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function loadBestId() {
  return localStorage.getItem(BEST_KEY) || "";
}

export function saveBestId(id) {
  if (id) {
    localStorage.setItem(BEST_KEY, id);
  } else {
    localStorage.removeItem(BEST_KEY);
  }
}
