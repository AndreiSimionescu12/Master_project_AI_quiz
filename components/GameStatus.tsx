interface GameState {
  items: any[];
  currentItem: any;
  score: number;
  totalItems: number;
  feedback: {
    message: string;
    type: 'success' | 'error' | 'info' | null;
  };
  isLoading: boolean;
  gameStarted: boolean;
}

interface GameStatusProps {
  gameState: GameState;
  onGenerateItems: (count?: number) => void;
  onResetGame: () => void;
}

export default function GameStatus({ gameState, onGenerateItems, onResetGame }: GameStatusProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-3">
        🎯 Status Joc
      </h2>
      
      {/* Scor compact */}
      <div className="mb-3 p-3 bg-blue-50 rounded-lg">
        <div className="text-xs text-gray-600">Scor</div>
        <div className="text-xl font-bold text-blue-600">
          {gameState.score} / {gameState.totalItems}
        </div>
      </div>

      {/* Progress compact */}
      {gameState.gameStarted && (
        <div className="mb-3">
          <div className="text-xs text-gray-600 mb-1">Progres</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(gameState.score / gameState.totalItems) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Elemente rămase: {gameState.items.length}
          </div>
        </div>
      )}

      {/* Butoane compacte */}
      <div className="space-y-2">
        {!gameState.gameStarted ? (
          <>
            <button
              onClick={() => onGenerateItems(5)}
              disabled={gameState.isLoading}
              className="w-full bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {gameState.isLoading ? '⏳ Se generează...' : '🎲 Elemente Noi (5)'}
            </button>
            
            <button
              onClick={() => onGenerateItems(10)}
              disabled={gameState.isLoading}
              className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {gameState.isLoading ? '⏳ Se generează...' : '🚀 Joc Avansat (10)'}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onGenerateItems(5)}
              disabled={gameState.isLoading}
              className="w-full bg-yellow-600 text-white py-2 px-3 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              🔄 Elemente Noi (5)
            </button>
            
            <button
              onClick={onResetGame}
              className="w-full bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              🏠 Înapoi la Meniu
            </button>
          </>
        )}
      </div>

      {/* Instrucțiuni compacte */}
      {!gameState.gameStarted && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-1 text-sm">Cum să joci:</h3>
          <ul className="text-xs text-gray-600 space-y-0.5">
            <li>• Generează elemente</li>
            <li>• Citește elementul</li>
            <li>• Click pe țara corectă</li>
            <li>• Primești feedback!</li>
          </ul>
        </div>
      )}
    </div>
  );
} 