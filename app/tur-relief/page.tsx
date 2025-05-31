"use client";

import { useState } from "react";

export default function TurRelief() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [tourStep, setTourStep] = useState<number>(0);

  // Placeholder pentru zonele de relief (exemplu)
  const reliefZones = [
    { id: "carpatii-meridionali", name: "Carpații Meridionali" },
    { id: "carpatii-orientali", name: "Carpații Orientali" },
    { id: "carpatii-occidentali", name: "Carpații Occidentali" },
    { id: "podisul-transilvaniei", name: "Podișul Transilvaniei" },
    { id: "campia-romana", name: "Câmpia Română" },
    { id: "delta-dunarii", name: "Delta Dunării" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          Tur Interactiv al Reliefului României
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 text-center">
          Alege o zonă de relief pentru a începe turul interactiv cu informații esențiale pentru Bacalaureat.
        </p>

        {/* Selectare zonă de relief */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {reliefZones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => { setSelectedZone(zone.id); setTourStep(0); }}
              className={`px-6 py-3 rounded-lg font-medium shadow transition-colors border-2 ${
                selectedZone === zone.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {zone.name}
            </button>
          ))}
        </div>

        {/* Placeholder pentru hartă și tur */}
        <div className="bg-white rounded-xl shadow-lg p-6 min-h-[400px] flex flex-col items-center justify-center">
          {!selectedZone && <span className="text-gray-400">Selectează o zonă de relief pentru a începe turul.</span>}
          {selectedZone && (
            <div className="w-full">
              {/* Aici va fi harta ArcGIS și turul interactiv */}
              <div className="mb-4 text-center font-semibold text-lg text-blue-700">
                Tur pentru: {reliefZones.find(z => z.id === selectedZone)?.name}
              </div>
              <div className="text-gray-600 text-center mb-4">
                (Aici va apărea harta și conținutul interactiv pentru zona selectată)
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setTourStep((s) => Math.max(0, s - 1))}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50"
                  disabled={tourStep === 0}
                >
                  Înapoi
                </button>
                <button
                  onClick={() => setTourStep((s) => s + 1)}
                  className="px-4 py-2 rounded bg-blue-600 text-white font-medium"
                >
                  Următorul
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 