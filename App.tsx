import React, { useState, useCallback } from 'react';
import { generateExplanation } from './services/geminiService';
import type { ExplanationResponse } from './types';
import VisualizationRenderer from './components/VisualizationRenderer';
import { LoadingSpinner } from './components/Icons';
import { EXAMPLE_PROMPT } from './constants';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(EXAMPLE_PROMPT);
  const [response, setResponse] = useState<ExplanationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState<number>(0);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await generateExplanation(prompt);
      setResponse(result);
      setAnimationKey(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  const handleReplay = () => {
    if (response) setAnimationKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col h-screen bg-[#121212] font-sans text-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1a1a1a] to-[#222] py-4 px-6 text-center border-b border-gray-700 shadow-lg">
        <h1 className="text-2xl font-bold text-[#B844AD] tracking-wide">📘 Concept Visualizer</h1>
      </header>

      {/* Main split panel */}
      <main className="flex flex-1 overflow-hidden gap-4 p-4">
        {/* Left panel - Explanation */}
        <div className="w-1/2 p-4 bg-[#1E1E1E] rounded-xl shadow-lg flex flex-col">
          <h2 className="text-sm font-semibold text-gray-400 mb-2">💡 Explanation</h2>
          <div className="bg-[#222] p-4 rounded-xl flex-1 overflow-y-auto shadow-inner">
            {error && <p className="text-red-400">{error}</p>}
            {!response && !error && !isLoading && (
              <p className="text-gray-500 animate-pulse">Your explanation will appear here...</p>
            )}
            <AnimatePresence>
              {response && !isLoading && (
                <motion.p
                  key={animationKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                  className="whitespace-pre-wrap text-gray-100 leading-relaxed"
                >
                  {response.text}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right panel - Visualization */}
        <div className="w-1/2 p-4 bg-[#1E1E1E] rounded-xl shadow-lg flex items-center justify-center relative">
          <div className="bg-[#222] w-full h-full rounded-xl shadow-inner flex items-center justify-center relative overflow-hidden">
            {isLoading && (
              <div className="flex flex-col items-center gap-3 animate-pulse">
                <LoadingSpinner className="w-12 h-12 text-[#B844AD]" />
                <span className="text-gray-400 text-sm">Bringing the concept to life...</span>
              </div>
            )}
            {response && !isLoading && (
              <>
                <VisualizationRenderer spec={response.visualization} key={animationKey} />
                <button
                  onClick={handleReplay}
                  className="absolute top-4 right-4 bg-[#B844AD]/30 p-3 rounded-full hover:bg-[#B844AD]/50 transition-transform hover:scale-110"
                  aria-label="Replay visualization"
                >
                  ↻
                </button>
                {/* Subtle concept-building nodes */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.2, 0], scale: [0.9, 1, 0.9] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <span className="absolute bg-[#B844AD] rounded-full w-2 h-2 top-1/4 left-1/3 animate-pulse"></span>
                  <span className="absolute bg-[#A163F2] rounded-full w-2 h-2 top-2/3 left-2/3 animate-pulse"></span>
                  <span className="absolute bg-[#B844AD] rounded-full w-2 h-2 top-1/2 left-1/2 animate-pulse"></span>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Bottom input bar */}
      <footer className="bg-[#111] p-4 border-t border-gray-700 flex items-center gap-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a concept..."
          className="flex-1 bg-[#222] text-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B844AD] transition"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-[#B844AD] px-6 py-3 rounded-xl font-semibold hover:bg-[#9955E2] disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105"
        >
          {isLoading ? 'Visualizing...' : 'Visualize'}
        </button>
      </footer>
    </div>
  );
};

export default App;
