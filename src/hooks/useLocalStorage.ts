import { useState, useEffect, useCallback } from "react";
import { StorageData, loadFromStorage, saveToStorage } from "../utils/storage";

export function useLocalStorage() {
  const [data, setData] = useState<StorageData>(loadFromStorage);

  const updateStorage = useCallback((newData: StorageData) => {
    setData(newData);
    saveToStorage(newData);
  }, []);

  const updateCurrentGame = useCallback((game: StorageData["currentGame"]) => {
    setData((prev) => {
      const updated = { ...prev, currentGame: game };
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const addToHistory = useCallback((game: StorageData["history"][0]) => {
    setData((prev) => {
      const updated = {
        ...prev,
        history: [game, ...prev.history],
        currentGame: null,
      };
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const updateSettings = useCallback(
    (settings: Partial<StorageData["settings"]>) => {
      setData((prev) => {
        const updated = {
          ...prev,
          settings: { ...prev.settings, ...settings },
        };
        saveToStorage(updated);
        return updated;
      });
    },
    []
  );

  const clearHistory = useCallback(() => {
    setData((prev) => {
      const updated = { ...prev, history: [] };
      saveToStorage(updated);
      return updated;
    });
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "puzzle_v1" && e.newValue) {
        setData(JSON.parse(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return {
    data,
    updateStorage,
    updateCurrentGame,
    addToHistory,
    updateSettings,
    clearHistory,
  };
}
