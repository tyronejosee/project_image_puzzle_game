import { Link } from "react-router-dom";
import {
  PlusCircle,
  History,
  Settings as SettingsIcon,
  Trophy,
  Clock,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  getBestTimeForGrid,
  getTotalGamesPlayed,
  getAverageMoves,
} from "../utils/storage";
import { formatTime } from "../utils/date";

export function Dashboard() {
  const { data } = useLocalStorage();

  const totalGames = getTotalGamesPlayed(data.history);
  const avgMoves = getAverageMoves(data.history);
  const bestTime3x3 = getBestTimeForGrid(data.history, 3);
  const bestTime4x4 = getBestTimeForGrid(data.history, 4);
  const bestTime5x5 = getBestTimeForGrid(data.history, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Puzzle Game</h1>
          <p className="text-xl text-gray-600">
            Challenge yourself with sliding puzzles
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              to="/new"
              className="block bg-white rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-400 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <PlusCircle className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">New Game</h2>
                  <p className="text-gray-600">Start a fresh puzzle</p>
                </div>
              </div>
            </Link>
          </motion.div>

          {data.currentGame && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to={`/game/${data.currentGame.id}`}
                className="block bg-white rounded-2xl p-8 border-2 border-green-200 hover:border-green-400 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                    <Trophy className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Continue Game
                    </h2>
                    <p className="text-gray-600">
                      {data.currentGame.grid}×{data.currentGame.grid} •{" "}
                      {data.currentGame.moves} moves
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>

        {totalGames > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Your Stats
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                <Trophy className="w-6 h-6 text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-blue-900">
                  {totalGames}
                </div>
                <div className="text-sm text-blue-600 font-medium">Games</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                <Clock className="w-6 h-6 text-green-600 mb-2" />
                <div className="text-2xl font-bold text-green-900">
                  {avgMoves}
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Avg Moves
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border-2 border-amber-200">
                <Clock className="w-6 h-6 text-amber-600 mb-2" />
                <div className="text-lg font-bold text-amber-900">
                  {bestTime3x3 ? formatTime(bestTime3x3) : "N/A"}
                </div>
                <div className="text-xs text-amber-600 font-medium">
                  Best 3×3
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-4 border-2 border-rose-200">
                <Clock className="w-6 h-6 text-rose-600 mb-2" />
                <div className="text-lg font-bold text-rose-900">
                  {bestTime4x4 ? formatTime(bestTime4x4) : "N/A"}
                </div>
                <div className="text-xs text-rose-600 font-medium">
                  Best 4×4
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-4 border-2 border-violet-200">
                <Clock className="w-6 h-6 text-violet-600 mb-2" />
                <div className="text-lg font-bold text-violet-900">
                  {bestTime5x5 ? formatTime(bestTime5x5) : "N/A"}
                </div>
                <div className="text-xs text-violet-600 font-medium">
                  Best 5×5
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <Link
            to="/history"
            className="block bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <History className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">History</h3>
                <p className="text-sm text-gray-600">View past games</p>
              </div>
            </div>
          </Link>

          <Link
            to="/settings"
            className="block bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <SettingsIcon className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600">
                  Customize your experience
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
