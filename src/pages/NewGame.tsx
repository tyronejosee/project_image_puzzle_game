import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ImageUploader } from "../components/ImageUploader";
import { sliceImageIntoTiles, generateImageHash } from "../utils/image-utils";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { motion } from "framer-motion";

export function NewGame() {
  const navigate = useNavigate();
  const { updateCurrentGame } = useLocalStorage();
  const [gridSize, setGridSize] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageCropped = async (imageUrl: string) => {
    setIsProcessing(true);
    try {
      const tiles = await sliceImageIntoTiles(imageUrl, gridSize);
      const imageHash = await generateImageHash(imageUrl);
      const gameId = crypto.randomUUID();

      const newGame = {
        id: gameId,
        imageHash,
        imageUrl,
        grid: gridSize,
        tiles,
        moves: 0,
        timeElapsed: 0,
        startedAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        isStarted: false,
      };

      updateCurrentGame(newGame);
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error("Error creating puzzle:", error);
      alert("Failed to create puzzle. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create New Puzzle
          </h1>
          <p className="text-lg text-gray-600">
            Upload an image and choose your difficulty
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Select Grid Size
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { size: 3, label: "Easy", color: "green" },
              { size: 4, label: "Medium", color: "amber" },
              { size: 5, label: "Hard", color: "rose" },
            ].map(({ size, label, color }) => (
              <button
                key={size}
                onClick={() => setGridSize(size)}
                className={`
                  p-6 rounded-xl border-2 transition-all
                  ${
                    gridSize === size
                      ? `bg-${color}-50 border-${color}-500 ring-4 ring-${color}-200`
                      : "bg-gray-50 border-gray-300 hover:border-gray-400"
                  }
                `}
              >
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {size}×{size}
                </div>
                <div
                  className={`text-sm font-medium ${
                    gridSize === size ? `text-${color}-600` : "text-gray-600"
                  }`}
                >
                  {label}
                </div>
              </button>
            ))}
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Upload Your Image
          </h2>
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-600 font-medium">
                Creating your puzzle...
              </p>
            </div>
          ) : (
            <ImageUploader onImageCropped={handleImageCropped} />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <h3 className="font-bold text-blue-900 mb-2">Tips:</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Choose images with clear subjects for easier puzzles</li>
            <li>• Complex patterns make for more challenging puzzles</li>
            <li>• Square images work best and will be cropped automatically</li>
            <li>• Higher grid sizes significantly increase difficulty</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
