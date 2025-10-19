import { motion } from "framer-motion";
import { Trophy, Clock, Move, Home, RotateCcw } from "lucide-react";
import { Modal } from "./Modal";
import { formatTime } from "../utils/date";

type CelebrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  moves: number;
  timeElapsed: number;
  gridSize: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
};

export function CelebrationModal({
  isOpen,
  onClose,
  moves,
  timeElapsed,
  gridSize,
  onPlayAgain,
  onGoHome,
}: CelebrationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="flex justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 10, 0],
              }}
              transition={{
                duration: 0.5,
                delay: 0.3,
                repeat: 2,
              }}
            >
              <Trophy className="w-24 h-24 text-amber-500" />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold"
            >
              ✓
            </motion.div>
          </div>
        </motion.div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-2"
          >
            Puzzle Solved!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            Congratulations on completing the {gridSize}×{gridSize} puzzle!
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
            <Move className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-blue-900 mb-1">{moves}</div>
            <div className="text-sm text-blue-600 font-medium">Moves</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
            <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-green-900 mb-1">
              {formatTime(timeElapsed)}
            </div>
            <div className="text-sm text-green-600 font-medium">Time</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-3 pt-4"
        >
          <button
            onClick={onGoHome}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
          >
            <Home size={20} />
            Home
          </button>
          <button
            onClick={onPlayAgain}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <RotateCcw size={20} />
            Play Again
          </button>
        </motion.div>
      </div>
    </Modal>
  );
}
