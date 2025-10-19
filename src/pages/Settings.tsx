import { useNavigate } from "react-router-dom";
import { ArrowLeft, Palette, Zap, Volume2, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useLocalStorage } from "../hooks/useLocalStorage";

export function Settings() {
  const navigate = useNavigate();
  const { data, updateSettings } = useLocalStorage();

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
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Customize your puzzle experience</p>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Palette className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Appearance</h2>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <div>
                <div className="font-medium text-gray-900">Theme</div>
                <div className="text-sm text-gray-600">
                  Choose your preferred color scheme
                </div>
              </div>
              <select
                value={data.settings.theme}
                onChange={(e) =>
                  updateSettings({ theme: e.target.value as "light" | "dark" })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark (Coming Soon)</option>
              </select>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Performance</h2>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <div>
                <div className="font-medium text-gray-900">Animations</div>
                <div className="text-sm text-gray-600">
                  Enable smooth transitions and effects
                </div>
              </div>
              <button
                onClick={() =>
                  updateSettings({ animate: !data.settings.animate })
                }
                className={`
                  relative w-14 h-8 rounded-full transition-colors
                  ${data.settings.animate ? "bg-blue-600" : "bg-gray-300"}
                `}
                role="switch"
                aria-checked={data.settings.animate}
                aria-label="Toggle animations"
              >
                <span
                  className={`
                    absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform
                    ${data.settings.animate ? "translate-x-6" : "translate-x-0"}
                  `}
                />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Volume2 className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Audio</h2>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <div>
                <div className="font-medium text-gray-900">Sound Effects</div>
                <div className="text-sm text-gray-600">
                  Play sounds for actions and achievements
                </div>
              </div>
              <button
                onClick={() =>
                  updateSettings({ soundEnabled: !data.settings.soundEnabled })
                }
                className={`
                  relative w-14 h-8 rounded-full transition-colors
                  ${data.settings.soundEnabled ? "bg-blue-600" : "bg-gray-300"}
                `}
                role="switch"
                aria-checked={data.settings.soundEnabled}
                aria-label="Toggle sound effects"
              >
                <span
                  className={`
                    absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform
                    ${
                      data.settings.soundEnabled
                        ? "translate-x-6"
                        : "translate-x-0"
                    }
                  `}
                />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6"
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <div className="font-bold mb-2">About This Game</div>
                <p className="mb-2">
                  A modern sliding puzzle game built with React, TypeScript, and
                  Framer Motion. All game data is stored locally in your
                  browser.
                </p>
                <p className="text-xs text-blue-600">
                  Version 1.0.0 • Created with React + Vite
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
