"use client";

import { useState, useEffect } from 'react';

interface EuropeMapProps {
  onCountryClick: (countryCode: string) => void;
  gameStarted: boolean;
}

// Codurile țărilor europene cu numele lor
const europeanCountries = {
  'AL': 'Albania', 'AD': 'Andorra', 'AT': 'Austria', 'BY': 'Belarus', 'BE': 'Belgia',
  'BA': 'Bosnia și Herțegovina', 'BG': 'Bulgaria', 'HR': 'Croația', 'CY': 'Cipru',
  'CZ': 'Cehia', 'DK': 'Danemarca', 'EE': 'Estonia', 'FI': 'Finlanda', 'FR': 'Franța',
  'GE': 'Georgia', 'DE': 'Germania', 'GR': 'Grecia', 'HU': 'Ungaria', 'IS': 'Islanda',
  'IE': 'Irlanda', 'IT': 'Italia', 'XK': 'Kosovo', 'LV': 'Letonia', 'LI': 'Liechtenstein',
  'LT': 'Lituania', 'LU': 'Luxemburg', 'MT': 'Malta', 'MD': 'Moldova', 'MC': 'Monaco',
  'ME': 'Muntenegru', 'NL': 'Olanda', 'MK': 'Macedonia de Nord', 'NO': 'Norvegia',
  'PL': 'Polonia', 'PT': 'Portugalia', 'RO': 'România', 'RU': 'Rusia', 'SM': 'San Marino',
  'RS': 'Serbia', 'SK': 'Slovacia', 'SI': 'Slovenia', 'ES': 'Spania', 'SE': 'Suedia',
  'CH': 'Elveția', 'TR': 'Turcia', 'UA': 'Ucraina', 'GB': 'Marea Britanie', 'VA': 'Vatican'
};

export default function EuropeMap({ onCountryClick, gameStarted }: EuropeMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-lg shadow-lg p-3 h-full flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-2 text-center">
        🗺️ Harta Europei
      </h2>
      
      {!gameStarted && (
        <div className="flex-1 flex items-center justify-center text-center text-gray-500">
          <div>
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-sm">Generează elemente de joc pentru a începe!</p>
          </div>
        </div>
      )}

      {gameStarted && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header compact */}
          <div className="text-center text-gray-600 mb-2">
            <p className="text-sm font-semibold">Harta Interactivă a Europei</p>
            <p className="text-xs">Fă click pe o țară pentru a o selecta</p>
          </div>

          {/* Grid cu țările - scrollable */}
          <div className="flex-1 overflow-y-auto bg-blue-50 rounded-lg p-2">
            <div className="grid grid-cols-6 gap-1 max-w-2xl mx-auto">
              {Object.entries(europeanCountries).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => onCountryClick(code)}
                  onMouseEnter={() => setHoveredCountry(code)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  className={`
                    p-1 text-xs rounded border transition-all duration-200 font-medium
                    ${hoveredCountry === code
                      ? 'bg-blue-200 border-blue-400 text-blue-800 shadow-sm'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-blue-100 hover:border-blue-300'
                    }
                  `}
                  title={name}
                >
                  {code}
                </button>
              ))}
            </div>

            {/* Informații despre țara hover */}
            {hoveredCountry && (
              <div className="mt-2 text-center">
                <div className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {europeanCountries[hoveredCountry as keyof typeof europeanCountries]}
                </div>
              </div>
            )}
          </div>

          {/* Legenda compactă */}
          <div className="mt-2 flex justify-center space-x-3 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-200 border border-blue-400 rounded mr-1"></div>
              <span>Hover</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded mr-1"></div>
              <span>Disponibil</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 