"use client";

import { useState, useEffect } from 'react';
import EuropeMap from './EuropeMap';
import GameItems from './GameItems';
import GameStatus from './GameStatus';

interface GeoItem {
  label: string;
  country_iso2: string;
  category: 'CAPITAL' | 'RIVER' | 'RELIEF' | 'EU_FACT';
  explanation: string;
}

interface GameState {
  items: GeoItem[];
  currentItem: GeoItem | null;
  score: number;
  totalItems: number;
  feedback: {
    message: string;
    type: 'success' | 'error' | 'info' | null;
  };
  isLoading: boolean;
  gameStarted: boolean;
}

export default function EuropeMapGame() {
  const [gameState, setGameState] = useState<GameState>({
    items: [],
    currentItem: null,
    score: 0,
    totalItems: 0,
    feedback: { message: '', type: null },
    isLoading: false,
    gameStarted: false
  });

  const generateItems = async (count = 5) => {
    setGameState(prev => ({ ...prev, isLoading: true, feedback: { message: '', type: null } }));
    
    try {
      const response = await fetch('/api/generate-geo-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Eroare la generarea elementelor');
      }

      setGameState(prev => ({
        ...prev,
        items: data.items,
        currentItem: data.items[0],
        totalItems: data.items.length,
        score: 0,
        isLoading: false,
        gameStarted: true,
        feedback: { 
          message: `${data.items.length} elemente generate cu succes!`, 
          type: 'success' 
        }
      }));

      // Șterge mesajul de succes după 3 secunde
      setTimeout(() => {
        setGameState(prev => ({ ...prev, feedback: { message: '', type: null } }));
      }, 3000);

    } catch (error) {
      console.error('Eroare la generarea elementelor:', error);
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        feedback: { 
          message: error instanceof Error ? error.message : 'Eroare necunoscută', 
          type: 'error' 
        }
      }));
    }
  };

  const handleCountryClick = (countryCode: string) => {
    if (!gameState.currentItem) return;

    const isCorrect = countryCode.toUpperCase() === gameState.currentItem.country_iso2.toUpperCase();
    
    if (isCorrect) {
      // Răspuns corect
      const newScore = gameState.score + 1;
      const remainingItems = gameState.items.slice(1);
      
      setGameState(prev => ({
        ...prev,
        score: newScore,
        items: remainingItems,
        currentItem: remainingItems[0] || null,
        feedback: { 
          message: `✅ Corect! ${gameState.currentItem?.explanation}`, 
          type: 'success' 
        }
      }));

      // Verifică dacă jocul s-a terminat
      if (remainingItems.length === 0) {
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            feedback: { 
              message: `🎉 Felicitări! Ai terminat jocul cu scorul ${newScore}/${gameState.totalItems}!`, 
              type: 'success' 
            },
            gameStarted: false
          }));
        }, 2000);
      }

    } else {
      // Răspuns greșit
      setGameState(prev => ({
        ...prev,
        feedback: { 
          message: `❌ Greșit! ${gameState.currentItem?.explanation}`, 
          type: 'error' 
        }
      }));
    }

    // Șterge feedbackul după 4 secunde
    setTimeout(() => {
      setGameState(prev => ({ ...prev, feedback: { message: '', type: null } }));
    }, 4000);
  };

  const resetGame = () => {
    setGameState({
      items: [],
      currentItem: null,
      score: 0,
      totalItems: 0,
      feedback: { message: '', type: null },
      isLoading: false,
      gameStarted: false
    });
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        
        {/* Panoul de control și status */}
        <div className="lg:col-span-1 space-y-3 overflow-y-auto">
          <GameStatus 
            gameState={gameState}
            onGenerateItems={generateItems}
            onResetGame={resetGame}
          />
          
          {gameState.currentItem && (
            <GameItems currentItem={gameState.currentItem} />
          )}
        </div>

        {/* Harta Europei */}
        <div className="lg:col-span-2 overflow-hidden">
          <EuropeMap 
            onCountryClick={handleCountryClick}
            gameStarted={gameState.gameStarted}
          />
        </div>
      </div>

      {/* Feedback - fix la bottom */}
      {gameState.feedback.message && (
        <div className={`mt-2 p-3 rounded-lg text-center text-sm ${
          gameState.feedback.type === 'success' ? 'bg-green-100 text-green-800' :
          gameState.feedback.type === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {gameState.feedback.message}
        </div>
      )}
    </div>
  );
} 