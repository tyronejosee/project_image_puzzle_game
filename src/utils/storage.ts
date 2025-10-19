import { TileData } from "./image-utils";

export type CurrentGame = {
  id: string;
  imageHash: string;
  imageUrl: string;
  grid: number;
  tiles: TileData[];
  moves: number;
  timeElapsed: number;
  startedAt: string;
  lastUpdatedAt: string;
  isStarted: boolean;
};

export type CompletedGame = {
  id: string;
  finishedAt: string;
  grid: number;
  time: number;
  moves: number;
  imageHash: string;
};

export type Settings = {
  theme: "light" | "dark";
  animate: boolean;
  soundEnabled: boolean;
};

export type StorageData = {
  version: number;
  currentGame: CurrentGame | null;
  history: CompletedGame[];
  settings: Settings;
};

const STORAGE_KEY = "puzzle_v1";
const CURRENT_VERSION = 1;

const DEFAULT_SETTINGS: Settings = {
  theme: "light",
  animate: true,
  soundEnabled: false,
};

export function loadFromStorage(): StorageData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return {
        version: CURRENT_VERSION,
        currentGame: null,
        history: [],
        settings: DEFAULT_SETTINGS,
      };
    }

    const parsed = JSON.parse(data);

    if (parsed.version !== CURRENT_VERSION) {
      return migrateStorage(parsed);
    }

    return parsed;
  } catch (error) {
    console.error("Error loading from storage:", error);
    return {
      version: CURRENT_VERSION,
      currentGame: null,
      history: [],
      settings: DEFAULT_SETTINGS,
    };
  }
}

export function saveToStorage(data: StorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to storage:", error);
  }
}

function migrateStorage(oldData: any): StorageData {
  return {
    version: CURRENT_VERSION,
    currentGame: oldData.currentGame || null,
    history: oldData.history || [],
    settings: { ...DEFAULT_SETTINGS, ...oldData.settings },
  };
}

export function exportHistory(history: CompletedGame[]): string {
  return JSON.stringify(
    { history, exportedAt: new Date().toISOString() },
    null,
    2
  );
}

export function importHistory(jsonString: string): CompletedGame[] {
  try {
    const data = JSON.parse(jsonString);
    if (Array.isArray(data.history)) {
      return data.history;
    }
    return [];
  } catch (error) {
    console.error("Error importing history:", error);
    return [];
  }
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getBestTimeForGrid(
  history: CompletedGame[],
  grid: number
): number | null {
  const gamesForGrid = history.filter((g) => g.grid === grid);
  if (gamesForGrid.length === 0) return null;
  return Math.min(...gamesForGrid.map((g) => g.time));
}

export function getAverageMoves(history: CompletedGame[]): number {
  if (history.length === 0) return 0;
  const totalMoves = history.reduce((sum, game) => sum + game.moves, 0);
  return Math.round(totalMoves / history.length);
}

export function getTotalGamesPlayed(history: CompletedGame[]): number {
  return history.length;
}
