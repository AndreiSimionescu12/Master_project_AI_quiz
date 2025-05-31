"use client";

import { useState } from "react";
import InteractiveMap3D from "@/components/InteractiveMap3D";

export default function ExplorareInteractiva() {
  const [currentMode, setCurrentMode] = useState<"explore" | "quiz" | "story">("explore");

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explorare Interactivă a României
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descoperă regiunile României într-un mod nou și captivant. Alege modul de explorare care ți se potrivește cel mai bine.
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setCurrentMode("explore")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentMode === "explore"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Explorare
          </button>
          <button
            onClick={() => setCurrentMode("quiz")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentMode === "quiz"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Quiz
          </button>
          <button
            onClick={() => setCurrentMode("story")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentMode === "story"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Poveste
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <InteractiveMap3D mode={currentMode} />
        </div>
      </div>
    </main>
  );
} 