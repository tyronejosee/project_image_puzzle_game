import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  Clock,
  Move,
  Calendar,
  Download,
  Trash2,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { exportHistory } from "../utils/storage";
import { formatDate, formatTime } from "../utils/date";

type SortOption = "date" | "time" | "moves" | "grid";
type FilterOption = "all" | 3 | 4 | 5;

export function History() {
  const navigate = useNavigate();
  const { data, clearHistory } = useLocalStorage();
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [filterGrid, setFilterGrid] = useState<FilterOption>("all");

  const handleExport = () => {
    const json = exportHistory(data.history);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `puzzle-history-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearHistory = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all history? This cannot be undone."
      )
    ) {
      clearHistory();
    }
  };

  let filteredHistory = [...data.history];

  if (filterGrid !== "all") {
    filteredHistory = filteredHistory.filter(
      (game) => game.grid === filterGrid
    );
  }

  filteredHistory.sort((a, b) => {
    switch (sortBy) {
      case "date":
        return (
          new Date(b.finishedAt).getTime() - new Date(a.finishedAt).getTime()
        );
      case "time":
        return a.time - b.time;
      case "moves":
        return a.moves - b.moves;
      case "grid":
        return a.grid - b.grid;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
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
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Game History
          </h1>
          <p className="text-gray-600">
            {data.history.length} game{data.history.length !== 1 ? "s" : ""}{" "}
            completed
          </p>
        </motion.div>

        {data.history.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 mb-6"
            >
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Filter:
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {(["all", 3, 4, 5] as FilterOption[]).map((option) => (
                      <button
                        key={option}
                        onClick={() => setFilterGrid(option)}
                        className={`
                          px-4 py-2 rounded-lg text-sm font-medium transition-all
                          ${
                            filterGrid === option
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }
                        `}
                      >
                        {option === "all" ? "All" : `${option}×${option}`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="sort-select"
                    className="text-sm font-medium text-gray-700"
                  >
                    Sort by:
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Date</option>
                    <option value="time">Time</option>
                    <option value="moves">Moves</option>
                    <option value="grid">Grid Size</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <Download size={16} />
                  Export
                </button>
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              </div>
            </motion.div>

            <div className="space-y-4">
              {filteredHistory.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="bg-white rounded-xl p-6 border border-gray-200"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Trophy className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900 mb-1">
                          {game.grid}×{game.grid} Puzzle
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(game.finishedAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-gray-600 mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-medium">Time</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {formatTime(game.time)}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center gap-1 text-gray-600 mb-1">
                          <Move className="w-4 h-4" />
                          <span className="text-xs font-medium">Moves</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {game.moves}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {data.history.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-12 text-center"
          >
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Games Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Complete your first puzzle to see it here
            </p>
            <button
              onClick={() => navigate("/new")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Start Your First Game
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
