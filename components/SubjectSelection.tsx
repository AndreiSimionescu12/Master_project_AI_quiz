"use client";

import { useState, useEffect } from "react";
import { useQuiz } from "@/context/QuizContext";
import { useRouter } from "next/navigation";

// Pentru acest proiect vom folosi un dialog simplu, dar putem instala și shadcn/ui ulterior
interface SubjectSelectionProps {
  region: {
    id: string;
    name: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

// Definim interfața pentru datele despre regiune
interface RegionInfo {
  title: string;
  description: string;
  elevation?: string;
  climate?: string;
  soils?: string;
  historical?: string;
}

export default function SubjectSelection({
  region,
  isOpen,
  onClose,
}: SubjectSelectionProps) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [regionInfo, setRegionInfo] = useState<RegionInfo | null>(null);
  const { generateQuiz, loading, error } = useQuiz();
  const [showError, setShowError] = useState<boolean>(false);
  const router = useRouter();

  // Generăm informații despre regiune
  useEffect(() => {
    if (region) {
      // Aici vom genera informații despre regiunea selectată
      // În viitor, acestea ar putea veni de la un API sau o bază de date
      const generateRegionInfo = () => {
        const info: RegionInfo = {
          title: region.name,
          description: ""
        };

        switch (region.id) {
          case "eastern-carpathians":
            info.description = "Carpații Orientali reprezintă partea de est a lanțului muntos al Carpaților. Altitudinea maximă este de 2303m la vârful Pietrosul Rodnei.";
            info.elevation = "2303m";
            info.climate = "Climat montan, temperaturi scăzute, precipitații abundente.";
            info.soils = "Soluri brune de pădure, podzoluri.";
            info.historical = "Pasurile din Carpații Orientali au fost rute comerciale importante încă din antichitate.";
            break;
          case "southern-carpathians":
            info.description = "Carpații Meridionali, cunoscuți și ca Alpii Transilvaniei, găzduiesc cele mai înalte vârfuri montane din România.";
            info.elevation = "2544m (Vârful Moldoveanu)";
            info.climate = "Climat alpin la altitudini mari, cu ierni lungi și veri scurte.";
            info.soils = "Soluri subțiri pe versanți, soluri humicoase în văi.";
            info.historical = "Au fost o barieră naturală între Țara Românească și Transilvania.";
            break;
          case "western-carpathians":
            info.description = "Carpații Occidentali sau Munții Apuseni sunt cunoscuți pentru peisajele carstice și peșterile impresionante.";
            info.elevation = "1849m (Vârful Curcubăta Mare)";
            info.climate = "Climat moderat, influențat de masele de aer din vest.";
            info.soils = "Soluri brune și rendzine.";
            info.historical = "Regiune cu importante resurse miniere exploatate încă din antichitate.";
            break;
          case "transylvanian-plateau":
            info.description = "Podișul Transilvaniei este înconjurat de Carpați, formând o regiune cu dealuri și văi largi.";
            info.elevation = "500-700m";
            info.climate = "Climat temperat-continental, cu inversiuni termice frecvente.";
            info.soils = "Soluri fertile, propice agriculturii.";
            info.historical = "Centru cultural și istoric important, cu numeroase cetăți medievale.";
            break;
          case "moldavian-plateau":
            info.description = "Podișul Moldovei se întinde între Carpații Orientali și râul Prut, fiind fragmentat de văi adânci.";
            info.elevation = "400-500m";
            info.climate = "Climat temperat-continental cu influențe estice.";
            info.soils = "Cernoziomuri și soluri cenușii.";
            info.historical = "Regiune cu importante mănăstiri și situri istorice medievale.";
            break;
          case "romanian-plain":
            info.description = "Câmpia Română ocupă sudul României, fiind o regiune joasă, fertilă, traversată de râuri.";
            info.elevation = "50-150m";
            info.climate = "Climat temperat-continental cu veri calde și ierni reci.";
            info.soils = "Cernoziomuri foarte fertile.";
            info.historical = "Zonă agricolă importantă încă din perioada romană.";
            break;
          case "western-plain":
            info.description = "Câmpia de Vest este situată în partea vestică a României, la granița cu Ungaria și Serbia.";
            info.elevation = "80-150m";
            info.climate = "Climat temperat cu influențe oceanice.";
            info.soils = "Soluri fertile, propice agriculturii intensive.";
            info.historical = "Zonă de intersecție a culturilor central-europene.";
            break;
          case "danube-delta":
            info.description = "Delta Dunării este una dintre cele mai mari zone umede din Europa, fiind inclusă în patrimoniul UNESCO.";
            info.elevation = "0-5m";
            info.climate = "Climat temperat-continental cu influențe pontice.";
            info.soils = "Soluri aluviale, nisipoase.";
            info.historical = "Zonă de pescuit tradițional și ecoturism.";
            break;
          case "dobrogea":
            info.description = "Dobrogea este o regiune istorică între Dunăre și Marea Neagră, cu un relief predominant deluros.";
            info.elevation = "200-300m";
            info.climate = "Climat temperat-continental cu influențe pontice, fiind cea mai aridă regiune din România.";
            info.soils = "Soluri de tip cernoziom, brun-roșcate.";
            info.historical = "Regiune cu vestigii antice grecești și romane.";
            break;
          default:
            info.description = "Selectează o regiune pentru a afla mai multe informații.";
        }
        return info;
      };

      setRegionInfo(generateRegionInfo());
    } else {
      setRegionInfo(null);
    }
  }, [region]);

  // Afișăm eroarea doar când se schimbă și e non-null
  useEffect(() => {
    if (error) {
      setShowError(true);
      // Ascundem eroarea după 5 secunde
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubjectSelect = (subject: string) => {
    console.log("Subiect selectat:", subject);
    setSelectedSubject(subject);
    setShowError(false);
  };

  const handleStartQuiz = async () => {
    if (!region || !selectedSubject) {
      console.error("Nu există regiune sau subiect selectat");
      return;
    }

    try {
      console.log("Începe generarea quiz-ului pentru:", region.name, selectedSubject);
      await generateQuiz(region.name, selectedSubject);
      console.log("Quiz generat cu succes");
      onClose();
      router.push("/quiz");
    } catch (error) {
      console.error("Eroare la generarea quizului:", error);
      setShowError(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 transform transition-all border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-semibold text-slate-800">
            {regionInfo?.title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Fișă informativă despre regiune */}
        {regionInfo && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-blue-800 mb-2">{regionInfo.title}</h3>
            <p className="text-sm text-blue-700 mb-3">{regionInfo.description}</p>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              {regionInfo.elevation && (
                <div>
                  <span className="font-medium text-blue-700">Altitudine: </span>
                  <span className="text-blue-600">{regionInfo.elevation}</span>
                </div>
              )}
              {regionInfo.climate && (
                <div>
                  <span className="font-medium text-blue-700">Climă: </span>
                  <span className="text-blue-600">{regionInfo.climate}</span>
                </div>
              )}
              {regionInfo.soils && (
                <div>
                  <span className="font-medium text-blue-700">Soluri: </span>
                  <span className="text-blue-600">{regionInfo.soils}</span>
                </div>
              )}
              {regionInfo.historical && (
                <div>
                  <span className="font-medium text-blue-700">Context istoric: </span>
                  <span className="text-blue-600">{regionInfo.historical}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <h3 className="font-medium text-slate-700 mb-3">
          Ce doriți să exersați astăzi?
        </h3>

        <div className="grid grid-cols-1 gap-3 mb-6">
          <button
            onClick={() => handleSubjectSelect("Geografie fizică")}
            className={`p-4 rounded-lg border text-left ${
              selectedSubject === "Geografie fizică"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-slate-200 hover:border-slate-300 text-slate-700"
            }`}
          >
            <div className="flex items-center">
              <span
                className={`mr-3 flex-shrink-0 rounded-full p-1 ${
                  selectedSubject === "Geografie fizică"
                    ? "bg-blue-500"
                    : "bg-slate-200"
                }`}
              >
                <svg
                  className={`h-5 w-5 ${
                    selectedSubject === "Geografie fizică"
                      ? "text-white"
                      : "text-slate-500"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </span>
              <div>
                <div className="font-medium">Geografie fizică</div>
                <div className="text-sm text-slate-500">
                  Relief, climă, hidrografie, vegetație
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleSubjectSelect("Istorie")}
            className={`p-4 rounded-lg border text-left ${
              selectedSubject === "Istorie"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-slate-200 hover:border-slate-300 text-slate-700"
            }`}
          >
            <div className="flex items-center">
              <span
                className={`mr-3 flex-shrink-0 rounded-full p-1 ${
                  selectedSubject === "Istorie"
                    ? "bg-blue-500"
                    : "bg-slate-200"
                }`}
              >
                <svg
                  className={`h-5 w-5 ${
                selectedSubject === "Istorie"
                      ? "text-white"
                      : "text-slate-500"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <div>
                <div className="font-medium">Istorie</div>
                <div className="text-sm text-slate-500">
                  Evenimente istorice și personalități
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Afișăm mesajul de eroare dacă există */}
        {(error || showError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
            <p className="text-red-600 text-xs mt-1">
              Vă rugăm încercați din nou sau selectați altă regiune/subiect.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg"
          >
            Anulează
          </button>
          <button
            onClick={handleStartQuiz}
            disabled={!selectedSubject || loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg ${
              !selectedSubject || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Se încarcă...
              </span>
            ) : (
              "Începe quiz"
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 