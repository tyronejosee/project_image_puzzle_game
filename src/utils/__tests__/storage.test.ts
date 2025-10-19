import { describe, it, expect, beforeEach } from "vitest";
import {
  loadFromStorage,
  saveToStorage,
  exportHistory,
  importHistory,
  getBestTimeForGrid,
  getAverageMoves,
  getTotalGamesPlayed,
  CompletedGame,
  StorageData,
} from "../storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("loadFromStorage", () => {
    it("should return default data when storage is empty", () => {
      const data = loadFromStorage();
      expect(data.version).toBe(1);
      expect(data.currentGame).toBe(null);
      expect(data.history).toEqual([]);
      expect(data.settings).toBeDefined();
    });

    it("should load data from localStorage", () => {
      const mockData: StorageData = {
        version: 1,
        currentGame: null,
        history: [],
        settings: {
          theme: "light",
          animate: true,
          soundEnabled: false,
        },
      };

      localStorage.setItem("puzzle_v1", JSON.stringify(mockData));
      const data = loadFromStorage();

      expect(data).toEqual(mockData);
    });

    it("should handle corrupted storage gracefully", () => {
      localStorage.setItem("puzzle_v1", "invalid json");
      const data = loadFromStorage();

      expect(data.version).toBe(1);
      expect(data.currentGame).toBe(null);
    });
  });

  describe("saveToStorage", () => {
    it("should save data to localStorage", () => {
      const mockData: StorageData = {
        version: 1,
        currentGame: null,
        history: [],
        settings: {
          theme: "light",
          animate: true,
          soundEnabled: false,
        },
      };

      saveToStorage(mockData);
      const saved = localStorage.getItem("puzzle_v1");

      expect(saved).toBeDefined();
      expect(JSON.parse(saved!)).toEqual(mockData);
    });
  });

  describe("exportHistory", () => {
    it("should export history as JSON string", () => {
      const history: CompletedGame[] = [
        {
          id: "1",
          finishedAt: "2025-10-12T12:00:00Z",
          grid: 3,
          time: 120,
          moves: 50,
          imageHash: "abc123",
        },
      ];

      const exported = exportHistory(history);
      const parsed = JSON.parse(exported);

      expect(parsed.history).toEqual(history);
      expect(parsed.exportedAt).toBeDefined();
    });
  });

  describe("importHistory", () => {
    it("should import history from valid JSON", () => {
      const history: CompletedGame[] = [
        {
          id: "1",
          finishedAt: "2025-10-12T12:00:00Z",
          grid: 3,
          time: 120,
          moves: 50,
          imageHash: "abc123",
        },
      ];

      const json = JSON.stringify({
        history,
        exportedAt: new Date().toISOString(),
      });
      const imported = importHistory(json);

      expect(imported).toEqual(history);
    });

    it("should return empty array for invalid JSON", () => {
      const imported = importHistory("invalid json");
      expect(imported).toEqual([]);
    });

    it("should return empty array for JSON without history array", () => {
      const imported = importHistory(JSON.stringify({ data: "test" }));
      expect(imported).toEqual([]);
    });
  });

  describe("getBestTimeForGrid", () => {
    const history: CompletedGame[] = [
      { id: "1", finishedAt: "", grid: 3, time: 120, moves: 50, imageHash: "" },
      { id: "2", finishedAt: "", grid: 3, time: 90, moves: 45, imageHash: "" },
      { id: "3", finishedAt: "", grid: 4, time: 200, moves: 80, imageHash: "" },
    ];

    it("should return best time for specified grid size", () => {
      expect(getBestTimeForGrid(history, 3)).toBe(90);
      expect(getBestTimeForGrid(history, 4)).toBe(200);
    });

    it("should return null when no games exist for grid size", () => {
      expect(getBestTimeForGrid(history, 5)).toBe(null);
    });

    it("should return null for empty history", () => {
      expect(getBestTimeForGrid([], 3)).toBe(null);
    });
  });

  describe("getAverageMoves", () => {
    it("should calculate average moves correctly", () => {
      const history: CompletedGame[] = [
        {
          id: "1",
          finishedAt: "",
          grid: 3,
          time: 120,
          moves: 50,
          imageHash: "",
        },
        {
          id: "2",
          finishedAt: "",
          grid: 3,
          time: 90,
          moves: 40,
          imageHash: "",
        },
        {
          id: "3",
          finishedAt: "",
          grid: 4,
          time: 200,
          moves: 60,
          imageHash: "",
        },
      ];

      expect(getAverageMoves(history)).toBe(50);
    });

    it("should return 0 for empty history", () => {
      expect(getAverageMoves([])).toBe(0);
    });
  });

  describe("getTotalGamesPlayed", () => {
    it("should return total number of games", () => {
      const history: CompletedGame[] = [
        {
          id: "1",
          finishedAt: "",
          grid: 3,
          time: 120,
          moves: 50,
          imageHash: "",
        },
        {
          id: "2",
          finishedAt: "",
          grid: 3,
          time: 90,
          moves: 40,
          imageHash: "",
        },
      ];

      expect(getTotalGamesPlayed(history)).toBe(2);
    });

    it("should return 0 for empty history", () => {
      expect(getTotalGamesPlayed([])).toBe(0);
    });
  });
});
