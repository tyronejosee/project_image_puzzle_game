import { useState, useCallback } from "react";
import { TileData } from "../utils/image-utils";
import {
  shuffleTiles,
  swapTiles,
  canSwap,
  isPuzzleSolved,
} from "../utils/puzzle-logic";

export type UsePuzzleProps = {
  initialTiles: TileData[];
  gridSize: number;
  onMove?: () => void;
  onSolved?: () => void;
};

export function usePuzzle({
  initialTiles,
  gridSize,
  onMove,
  onSolved,
}: UsePuzzleProps) {
  const [tiles, setTiles] = useState<TileData[]>(initialTiles);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);

  const shuffle = useCallback(() => {
    const shuffled = shuffleTiles(tiles, gridSize);
    setTiles(shuffled);
    setMoves(0);
    setIsSolved(false);
    setSelectedTile(null);
  }, [tiles, gridSize]);

  const moveTile = useCallback(
    (fromPos: number, toPos: number) => {
      if (!canSwap(fromPos, toPos, gridSize)) {
        return false;
      }

      const emptyTile = tiles.find((t) => t.isEmpty);
      if (!emptyTile) return false;

      const emptyPos = emptyTile.currentPosition;
      if (toPos !== emptyPos && fromPos !== emptyPos) {
        return false;
      }

      const newTiles = swapTiles(tiles, fromPos, toPos);
      setTiles(newTiles);
      setMoves((prev) => prev + 1);
      setSelectedTile(null);

      if (onMove) {
        onMove();
      }

      const sortedTiles = [...newTiles].sort(
        (a, b) => a.currentPosition - b.currentPosition
      );
      const isSolved = isPuzzleSolved(
        sortedTiles.map((t) => t.correctPosition)
      );

      if (isSolved) {
        setIsSolved(true);
        if (onSolved) {
          onSolved();
        }
      }

      return true;
    },
    [tiles, gridSize, onMove, onSolved]
  );

  const selectTile = useCallback((position: number) => {
    setSelectedTile((prev) => (prev === position ? null : position));
  }, []);

  const reset = useCallback(() => {
    setTiles(initialTiles);
    setMoves(0);
    setIsSolved(false);
    setSelectedTile(null);
  }, [initialTiles]);

  const setTilesDirectly = useCallback((newTiles: TileData[]) => {
    setTiles(newTiles);
  }, []);

  const setMovesDirectly = useCallback((newMoves: number) => {
    setMoves(newMoves);
  }, []);

  return {
    tiles,
    moves,
    isSolved,
    selectedTile,
    shuffle,
    moveTile,
    selectTile,
    reset,
    setTilesDirectly,
    setMovesDirectly,
  };
}
