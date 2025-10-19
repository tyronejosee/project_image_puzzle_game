import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TileData } from "../utils/image-utils";

type TileProps = {
  tile: TileData;
  gridSize: number;
  isSelected: boolean;
  onClick: () => void;
  isDragging?: boolean;
};

export function Tile({ tile, isSelected, onClick }: TileProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: tile.currentPosition,
    disabled: tile.isEmpty,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCorrectPosition = tile.currentPosition === tile.correctPosition;

  if (tile.isEmpty) {
    return (
      <div
        className="aspect-square rounded-lg bg-gray-100 border-2 border-dashed border-gray-300"
        aria-hidden="true"
      />
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      className={`
        aspect-square rounded-lg overflow-hidden cursor-grab active:cursor-grabbing
        ${isSelected ? "ring-4 ring-blue-500 ring-offset-2" : ""}
        ${isSortableDragging ? "opacity-50 z-50" : ""}
        ${isCorrectPosition ? "ring-2 ring-green-400" : "ring-2 ring-gray-200"}
        hover:ring-blue-400 transition-all
      `}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      role="button"
      tabIndex={0}
      aria-label={`Puzzle tile ${tile.id + 1}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <img
        src={tile.imageUrl}
        alt={`Puzzle piece ${tile.id + 1}`}
        className="w-full h-full object-cover select-none"
        draggable={false}
      />
    </motion.div>
  );
}
