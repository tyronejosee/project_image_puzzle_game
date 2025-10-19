import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { PuzzleBoard } from "../components/PuzzleBoard";
import { Controls } from "../components/Controls";
import { CelebrationModal } from "../components/CelebrationModal";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { usePuzzle } from "../hooks/usePuzzle";
import { useTimer } from "../hooks/useTimer";
import { sliceImageIntoTiles } from "../utils/image-utils";

export function Game() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, updateCurrentGame, addToHistory } = useLocalStorage();
  const [showCelebration, setShowCelebration] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const currentGame = data.currentGame;

  const {
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
  } = usePuzzle({
    initialTiles: currentGame?.tiles || [],
    gridSize: currentGame?.grid || 3,
    onMove: () => {
      if (currentGame && !currentGame.isStarted) {
        timer.start();
        updateCurrentGame({
          ...currentGame,
          isStarted: true,
        });
      }
    },
    onSolved: () => {
      timer.pause();
      setShowCelebration(true);
    },
  });

  const timer = useTimer(currentGame?.timeElapsed || 0);

  useEffect(() => {
    if (!currentGame || currentGame.id !== id) {
      navigate("/");
      return;
    }

    if (!isInitialized) {
      setTilesDirectly(currentGame.tiles);
      setMovesDirectly(currentGame.moves);
      timer.setTime(currentGame.timeElapsed);
      if (currentGame.isStarted && !isSolved) {
        timer.start();
      }
      setIsInitialized(true);
    }
  }, [currentGame, id, navigate, isInitialized]);

  useEffect(() => {
    if (!currentGame || !isInitialized) return;

    const interval = setInterval(() => {
      if (timer.isRunning) {
        updateCurrentGame({
          ...currentGame,
          tiles,
          moves,
          timeElapsed: timer.timeElapsed,
          lastUpdatedAt: new Date().toISOString(),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    currentGame,
    tiles,
    moves,
    timer.timeElapsed,
    timer.isRunning,
    updateCurrentGame,
    isInitialized,
  ]);

  useEffect(() => {
    if (isSolved && currentGame && isInitialized) {
      addToHistory({
        id: currentGame.id,
        finishedAt: new Date().toISOString(),
        grid: currentGame.grid,
        time: timer.timeElapsed,
        moves,
        imageHash: currentGame.imageHash,
      });
    }
  }, [
    isSolved,
    currentGame,
    timer.timeElapsed,
    moves,
    addToHistory,
    isInitialized,
  ]);

  const handleShuffle = () => {
    shuffle();
    timer.reset();
    if (currentGame) {
      updateCurrentGame({
        ...currentGame,
        tiles,
        moves: 0,
        timeElapsed: 0,
        isStarted: false,
      });
    }
  };

  const handleReset = () => {
    reset();
    timer.reset();
    if (currentGame) {
      updateCurrentGame({
        ...currentGame,
        tiles: currentGame.tiles,
        moves: 0,
        timeElapsed: 0,
        isStarted: false,
      });
    }
  };

  const handlePauseResume = () => {
    if (timer.isRunning) {
      timer.pause();
    } else {
      timer.start();
    }
  };

  const handleGridSizeChange = async (newSize: number) => {
    if (!currentGame) return;

    const confirmed = window.confirm(
      "Changing grid size will start a new puzzle with the same image. Continue?"
    );

    if (!confirmed) return;

    const newTiles = await sliceImageIntoTiles(currentGame.imageUrl, newSize);
    const newGame = {
      ...currentGame,
      grid: newSize,
      tiles: newTiles,
      moves: 0,
      timeElapsed: 0,
      isStarted: false,
    };

    updateCurrentGame(newGame);
    setTilesDirectly(newTiles);
    setMovesDirectly(0);
    timer.reset();
  };

  const handlePlayAgain = () => {
    setShowCelebration(false);
    handleShuffle();
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (!currentGame || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </motion.button>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <PuzzleBoard
              tiles={tiles}
              gridSize={currentGame.grid}
              onMove={moveTile}
              selectedTile={selectedTile}
              onSelectTile={selectTile}
              disabled={isSolved}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Controls
              moves={moves}
              timeElapsed={timer.timeElapsed}
              isTimerRunning={timer.isRunning}
              onShuffle={handleShuffle}
              onReset={handleReset}
              onPauseResume={handlePauseResume}
              gridSize={currentGame.grid}
              onGridSizeChange={handleGridSizeChange}
              disabled={isSolved}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-white rounded-xl p-6 border border-gray-200"
            >
              <h3 className="font-bold text-gray-900 mb-3">How to Play</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Drag tiles to swap with the empty space</li>
                <li>• Use arrow keys to move tiles</li>
                <li>• Click tiles adjacent to empty space</li>
                <li>• Green borders show correct placement</li>
                <li>• Timer starts on first move</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        moves={moves}
        timeElapsed={timer.timeElapsed}
        gridSize={currentGame.grid}
        onPlayAgain={handlePlayAgain}
        onGoHome={handleGoHome}
      />
    </div>
  );
}
