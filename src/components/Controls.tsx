import {
  Shuffle,
  RotateCcw,
  Play,
  Pause,
  Trophy,
  Clock,
  Move,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatTime } from "../utils/date";

type ControlsProps = {
  moves: number;
  timeElapsed: number;
  isTimerRunning: boolean;
  onShuffle: () => void;
  onReset: () => void;
  onPauseResume: () => void;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  disabled?: boolean;
};

export function Controls({
  moves,
  timeElapsed,
  isTimerRunning,
  onShuffle,
  onReset,
  onPauseResume,
  gridSize,
  onGridSizeChange,
  disabled = false,
}: ControlsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200"
        >
          <div className="flex items-center gap-2 mb-1">
            <Move className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
              Moves
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{moves}</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200"
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
              Time
            </span>
          </div>
          <div className="text-2xl font-bold text-green-900">
            {formatTime(timeElapsed)}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border-2 border-amber-200"
        >
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
              Grid
            </span>
          </div>
          <div className="text-2xl font-bold text-amber-900">
            {gridSize}×{gridSize}
          </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Grid Size
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[3, 4, 5].map((size) => (
            <button
              key={size}
              onClick={() => onGridSizeChange(size)}
              disabled={disabled}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all
                ${
                  gridSize === size
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              aria-label={`${size}x${size} grid`}
              aria-pressed={gridSize === size}
            >
              {size}×{size}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onShuffle}
          disabled={disabled}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Shuffle puzzle"
        >
          <Shuffle size={20} />
          Shuffle
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          disabled={disabled}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Reset puzzle"
        >
          <RotateCcw size={20} />
          Reset
        </motion.button>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onPauseResume}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={isTimerRunning ? "Pause timer" : "Resume timer"}
      >
        {isTimerRunning ? (
          <>
            <Pause size={20} />
            Pause
          </>
        ) : (
          <>
            <Play size={20} />
            Resume
          </>
        )}
      </motion.button>
    </div>
  );
}
