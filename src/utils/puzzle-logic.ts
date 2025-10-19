import { TileData } from "./image-utils";

export function isSolvable(tiles: number[], gridSize: number): boolean {
  let inversions = 0;
  const arr = tiles.filter((t) => t !== gridSize * gridSize - 1);

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        inversions++;
      }
    }
  }

  const emptyRowFromBottom =
    gridSize - Math.floor(tiles.indexOf(gridSize * gridSize - 1) / gridSize);

  if (gridSize % 2 === 1) {
    return inversions % 2 === 0;
  } else {
    return (inversions + emptyRowFromBottom) % 2 === 0;
  }
}

export function shuffleTiles(tiles: TileData[], gridSize: number): TileData[] {
  const shuffled = [...tiles];
  let positions = tiles.map((_, i) => i);

  do {
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
  } while (!isSolvable(positions, gridSize) || isPuzzleSolved(positions));

  return shuffled.map((tile, index) => ({
    ...tile,
    currentPosition: positions[index],
  }));
}

export function isPuzzleSolved(positions: number[]): boolean {
  return positions.every((pos, index) => pos === index);
}

export function canSwap(pos1: number, pos2: number, gridSize: number): boolean {
  const row1 = Math.floor(pos1 / gridSize);
  const col1 = pos1 % gridSize;
  const row2 = Math.floor(pos2 / gridSize);
  const col2 = pos2 % gridSize;

  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);

  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

export function getAdjacentPositions(
  position: number,
  gridSize: number
): number[] {
  const row = Math.floor(position / gridSize);
  const col = position % gridSize;
  const adjacent: number[] = [];

  if (row > 0) adjacent.push((row - 1) * gridSize + col);
  if (row < gridSize - 1) adjacent.push((row + 1) * gridSize + col);
  if (col > 0) adjacent.push(row * gridSize + (col - 1));
  if (col < gridSize - 1) adjacent.push(row * gridSize + (col + 1));

  return adjacent;
}

export function swapTiles(
  tiles: TileData[],
  pos1: number,
  pos2: number
): TileData[] {
  const newTiles = [...tiles];
  const tile1Index = newTiles.findIndex((t) => t.currentPosition === pos1);
  const tile2Index = newTiles.findIndex((t) => t.currentPosition === pos2);

  if (tile1Index !== -1 && tile2Index !== -1) {
    const temp = newTiles[tile1Index].currentPosition;
    newTiles[tile1Index].currentPosition = newTiles[tile2Index].currentPosition;
    newTiles[tile2Index].currentPosition = temp;
  }

  return newTiles;
}

export function getKeyboardMove(
  currentPos: number,
  key: string,
  gridSize: number
): number | null {
  const row = Math.floor(currentPos / gridSize);
  const col = currentPos % gridSize;

  switch (key) {
    case "ArrowUp":
      return row > 0 ? (row - 1) * gridSize + col : null;
    case "ArrowDown":
      return row < gridSize - 1 ? (row + 1) * gridSize + col : null;
    case "ArrowLeft":
      return col > 0 ? row * gridSize + (col - 1) : null;
    case "ArrowRight":
      return col < gridSize - 1 ? row * gridSize + (col + 1) : null;
    default:
      return null;
  }
}
