import { describe, it, expect } from "vitest";
import {
  isSolvable,
  isPuzzleSolved,
  canSwap,
  getAdjacentPositions,
  swapTiles,
  getKeyboardMove,
} from "../puzzle-logic";
import { TileData } from "../image-utils";

describe("puzzle-logic", () => {
  describe("isSolvable", () => {
    it("should return true for solvable 3x3 configuration", () => {
      const tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      expect(isSolvable(tiles, 3)).toBe(true);
    });

    it("should return false for unsolvable 3x3 configuration", () => {
      const tiles = [1, 0, 2, 3, 4, 5, 6, 7, 8];
      expect(isSolvable(tiles, 3)).toBe(false);
    });

    it("should handle 4x4 grids", () => {
      const tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      expect(isSolvable(tiles, 4)).toBe(true);
    });
  });

  describe("isPuzzleSolved", () => {
    it("should return true when all positions match", () => {
      const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      expect(isPuzzleSolved(positions)).toBe(true);
    });

    it("should return false when positions do not match", () => {
      const positions = [1, 0, 2, 3, 4, 5, 6, 7, 8];
      expect(isPuzzleSolved(positions)).toBe(false);
    });
  });

  describe("canSwap", () => {
    it("should allow swap between adjacent horizontal tiles", () => {
      expect(canSwap(0, 1, 3)).toBe(true);
      expect(canSwap(1, 0, 3)).toBe(true);
    });

    it("should allow swap between adjacent vertical tiles", () => {
      expect(canSwap(0, 3, 3)).toBe(true);
      expect(canSwap(3, 0, 3)).toBe(true);
    });

    it("should not allow swap between non-adjacent tiles", () => {
      expect(canSwap(0, 2, 3)).toBe(false);
      expect(canSwap(0, 8, 3)).toBe(false);
    });

    it("should not allow swap across row boundaries", () => {
      expect(canSwap(2, 3, 3)).toBe(false);
      expect(canSwap(5, 6, 3)).toBe(false);
    });
  });

  describe("getAdjacentPositions", () => {
    it("should return correct adjacent positions for corner tile", () => {
      const adjacent = getAdjacentPositions(0, 3);
      expect(adjacent).toContain(1);
      expect(adjacent).toContain(3);
      expect(adjacent).toHaveLength(2);
    });

    it("should return correct adjacent positions for center tile", () => {
      const adjacent = getAdjacentPositions(4, 3);
      expect(adjacent).toContain(1);
      expect(adjacent).toContain(7);
      expect(adjacent).toContain(3);
      expect(adjacent).toContain(5);
      expect(adjacent).toHaveLength(4);
    });

    it("should return correct adjacent positions for edge tile", () => {
      const adjacent = getAdjacentPositions(1, 3);
      expect(adjacent).toContain(0);
      expect(adjacent).toContain(2);
      expect(adjacent).toContain(4);
      expect(adjacent).toHaveLength(3);
    });
  });

  describe("swapTiles", () => {
    const createMockTiles = (): TileData[] => [
      {
        id: 0,
        currentPosition: 0,
        correctPosition: 0,
        imageUrl: "",
        isEmpty: false,
      },
      {
        id: 1,
        currentPosition: 1,
        correctPosition: 1,
        imageUrl: "",
        isEmpty: false,
      },
      {
        id: 2,
        currentPosition: 2,
        correctPosition: 2,
        imageUrl: "",
        isEmpty: true,
      },
    ];

    it("should swap tile positions correctly", () => {
      const tiles = createMockTiles();
      const swapped = swapTiles(tiles, 0, 1);

      expect(swapped[0].currentPosition).toBe(1);
      expect(swapped[1].currentPosition).toBe(0);
      expect(swapped[2].currentPosition).toBe(2);
    });

    it("should not mutate original tiles array", () => {
      const tiles = createMockTiles();
      const originalPos = tiles[0].currentPosition;
      swapTiles(tiles, 0, 1);

      expect(tiles[0].currentPosition).toBe(originalPos);
    });
  });

  describe("getKeyboardMove", () => {
    it("should return correct position for arrow up", () => {
      expect(getKeyboardMove(4, "ArrowUp", 3)).toBe(1);
    });

    it("should return correct position for arrow down", () => {
      expect(getKeyboardMove(1, "ArrowDown", 3)).toBe(4);
    });

    it("should return correct position for arrow left", () => {
      expect(getKeyboardMove(4, "ArrowLeft", 3)).toBe(3);
    });

    it("should return correct position for arrow right", () => {
      expect(getKeyboardMove(3, "ArrowRight", 3)).toBe(4);
    });

    it("should return null at boundaries", () => {
      expect(getKeyboardMove(0, "ArrowUp", 3)).toBe(null);
      expect(getKeyboardMove(0, "ArrowLeft", 3)).toBe(null);
      expect(getKeyboardMove(8, "ArrowDown", 3)).toBe(null);
      expect(getKeyboardMove(8, "ArrowRight", 3)).toBe(null);
    });

    it("should return null for invalid keys", () => {
      expect(getKeyboardMove(4, "Space", 3)).toBe(null);
      expect(getKeyboardMove(4, "Enter", 3)).toBe(null);
    });
  });
});
