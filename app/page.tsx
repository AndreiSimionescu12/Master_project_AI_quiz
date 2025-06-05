"use client";

import { useState } from "react";
import ArcGISEmbeddedMap from "@/components/ArcGISEmbeddedMap";
import SubjectSelection from "@/components/SubjectSelection";

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRegionSelect = (regionId: string, regionName: string) => {
    setSelectedRegion({ id: regionId, name: regionName });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <main className="flex-1">
      {/* Decorativ header background */}
      <div className="absolute inset-x-0 top-16 h-48 bg-gradient-to-b from-blue-50 to-transparent -z-10"></div>

      {/* Conținut principal */}
      <div className="container mx-auto px-4 pt-8 pb-12">
        <div className="grid gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              GeoBacAI - Geografia României
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Alege una dintre regiunile de relief ale României pentru a genera întrebări
              personalizate pentru Bacalaureat la Geografie.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5 sm:p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Harta Reliefului României
            </h2>
            <p className="text-slate-600 mb-6">
              Click pe o regiune geografică pentru a începe un quiz.
            </p>
            <ArcGISEmbeddedMap onRegionSelect={handleRegionSelect} />
          </div>
        </div>
      </div>

      {/* Dialog de selecție a materiei */}
      <SubjectSelection
        region={selectedRegion}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
      />
    </main>
  );
}
