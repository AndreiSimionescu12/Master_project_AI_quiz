interface GeoItem {
  label: string;
  country_iso2: string;
  category: 'CAPITAL' | 'RIVER' | 'RELIEF' | 'EU_FACT';
  explanation: string;
}

interface GameItemsProps {
  currentItem: GeoItem;
}

const categoryLabels = {
  CAPITAL: { name: 'Capitală', icon: '🏛️', color: 'bg-purple-100 text-purple-800' },
  RIVER: { name: 'Râu', icon: '🌊', color: 'bg-blue-100 text-blue-800' },
  RELIEF: { name: 'Relief', icon: '⛰️', color: 'bg-green-100 text-green-800' },
  EU_FACT: { name: 'Fapt UE', icon: '🇪🇺', color: 'bg-yellow-100 text-yellow-800' }
};

export default function GameItems({ currentItem }: GameItemsProps) {
  const categoryInfo = categoryLabels[currentItem.category];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-3">
        🎯 Element Curent
      </h2>
      
      {/* Categoria */}
      <div className="mb-3">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
          <span className="mr-1">{categoryInfo.icon}</span>
          {categoryInfo.name}
        </span>
      </div>

      {/* Elementul de găsit */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-gray-800 mb-1">
          {currentItem.label}
        </div>
        <div className="text-xs text-gray-600">
          Fă click pe țara corespunzătoare pe hartă!
        </div>
      </div>

      {/* Indiciu pentru categoria */}
      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600">
          <strong>Indiciu:</strong> 
          {currentItem.category === 'CAPITAL' && ' Caută țara al cărei oraș principal este acesta.'}
          {currentItem.category === 'RIVER' && ' Caută țara prin care trece acest râu.'}
          {currentItem.category === 'RELIEF' && ' Caută țara în care se află acest element de relief.'}
          {currentItem.category === 'EU_FACT' && ' Caută țara la care se referă acest fapt despre UE.'}
        </div>
      </div>
    </div>
  );
} 