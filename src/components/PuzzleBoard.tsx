import { useCallback, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Tile } from "./Tile";
import { TileData } from "../utils/image-utils";
import { getKeyboardMove, canSwap } from "../utils/puzzle-logic";

type PuzzleBoardProps = {
  tiles: TileData[];
  gridSize: number;
  onMove: (fromPos: number, toPos: number) => boolean;
  selectedTile: number | null;
  onSelectTile: (position: number) => void;
  disabled?: boolean;
};

export function PuzzleBoard({
  tiles,
  gridSize,
  onMove,
  selectedTile,
  onSelectTile,
  disabled = false,
}: PuzzleBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const fromPos = Number(active.id);
      const toPos = Number(over.id);

      onMove(fromPos, toPos);
    },
    [onMove]
  );

  const handleTileClick = useCallback(
    (position: number) => {
      if (disabled) return;

      const emptyTile = tiles.find((t) => t.isEmpty);
      if (!emptyTile) return;

      const emptyPos = emptyTile.currentPosition;

      if (canSwap(position, emptyPos, gridSize)) {
        onMove(position, emptyPos);
      } else {
        onSelectTile(position);
      }
    },
    [tiles, gridSize, onMove, onSelectTile, disabled]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        disabled ||
        !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        return;
      }

      e.preventDefault();

      const emptyTile = tiles.find((t) => t.isEmpty);
      if (!emptyTile) return;

      const emptyPos = emptyTile.currentPosition;
      const targetPos = getKeyboardMove(emptyPos, e.key, gridSize);

      if (targetPos !== null) {
        onMove(targetPos, emptyPos);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tiles, gridSize, onMove, disabled]);

  const sortedTiles = [...tiles].sort(
    (a, b) => a.currentPosition - b.currentPosition
  );
  const positions = sortedTiles.map((t) => t.currentPosition);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={positions} strategy={rectSortingStrategy}>
        <div
          className={`
            grid gap-2 p-4 bg-white rounded-2xl
            ${gridSize === 3 ? "grid-cols-3" : ""}
            ${gridSize === 4 ? "grid-cols-4" : ""}
            ${gridSize === 5 ? "grid-cols-5" : ""}
            ${disabled ? "pointer-events-none opacity-75" : ""}
          `}
          role="group"
          aria-label="Puzzle board"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {sortedTiles.map((tile) => (
            <Tile
              key={tile.id}
              tile={tile}
              gridSize={gridSize}
              isSelected={selectedTile === tile.currentPosition}
              onClick={() => handleTileClick(tile.currentPosition)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
