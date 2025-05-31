"use client";

import { useState, useEffect } from "react";

type RegionData = {
  name: string;
  relief: string;
  rivers: string;
  population: string;
  resources: string;
  climate: string;
  economy: string;
  userNotes: string;
};

type FeedbackData = {
  isCorrect: boolean;
  message: string;
  feedback?: string; // Feedback text detaliat de la Gemini
  corrections: {
    field: string;
    correction: string;
  }[];
};

export default function RegionComparator() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["", ""]);
  const [regionData, setRegionData] = useState<RegionData[]>([
    {
      name: "",
      relief: "",
      rivers: "",
      population: "",
      resources: "",
      climate: "",
      economy: "",
      userNotes: ""
    },
    {
      name: "",
      relief: "",
      rivers: "",
      population: "",
      resources: "",
      climate: "",
      economy: "",
      userNotes: ""
    }
  ]);
  
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Efect pentru a prelua datele regiunii când se schimbă selecția
  useEffect(() => {
    const fetchRegionData = async (regionName: string, index: number) => {
      if (!regionName) return;
      
      // Aici ar trebui să apelez un API pentru a obține date reale
      // Pentru demonstrație, folosim date simulată
      const mockData: RegionData = {
        name: regionName,
        relief: getDemoReliefData(regionName),
        rivers: getDemoRiversData(regionName),
        population: getDemoPopulationData(regionName),
        resources: getDemoResourcesData(regionName),
        climate: getDemoClimateData(regionName),
        economy: getDemoEconomyData(regionName),
        userNotes: ""
      };
      
      // Actualizăm datele regiunii
      setRegionData(prevData => {
        const newData = [...prevData];
        newData[index] = mockData;
        return newData;
      });
    };

    // Preluăm datele pentru ambele regiuni selectate
    if (selectedRegions[0]) {
      fetchRegionData(selectedRegions[0], 0);
    }
    
    if (selectedRegions[1]) {
      fetchRegionData(selectedRegions[1], 1);
    }
  }, [selectedRegions]);

  // Funcție helper pentru date demo despre relief
  const getDemoReliefData = (regionName: string) => {
    const reliefMap: Record<string, string> = {
      "Muntenia": "Câmpie în sud, dealuri în centru și munți în nord (Carpații Meridionali).",
      "Moldova": "Câmpii și podișuri în est, dealuri subcarpatice și munți (Carpații Orientali) în vest.",
      "Transilvania": "Podiș depresionar înconjurat de lanțurile Carpaților.",
      "Dobrogea": "Podiș, câmpie și Delta Dunării.",
      "Banat": "Câmpie în vest, dealuri și munți în est (Carpații Occidentali).",
      "Maramureș": "Relief predominant montan cu depresiuni intramontane.",
      "Crișana": "Câmpie în vest și dealuri în est."
    };
    
    return reliefMap[regionName] || "Informații despre relief nedisponibile.";
  };
  
  // Funcție helper pentru date demo despre râuri
  const getDemoRiversData = (regionName: string) => {
    const riversMap: Record<string, string> = {
      "Muntenia": "Dunărea, Olt, Argeș, Ialomița, Dâmbovița.",
      "Moldova": "Siret, Prut, Moldova, Bistrița, Trotuș.",
      "Transilvania": "Mureș, Someș, Olt, Târnave, Crișuri.",
      "Dobrogea": "Dunărea și canalele din Delta Dunării.",
      "Banat": "Timiș, Bega, Caraș, Nera, Cerna.",
      "Maramureș": "Tisa, Vișeu, Iza, Someș.",
      "Crișana": "Crișul Alb, Crișul Negru, Crișul Repede, Barcău."
    };
    
    return riversMap[regionName] || "Informații despre râuri nedisponibile.";
  };

  // Funcție helper pentru date demo despre populație
  const getDemoPopulationData = (regionName: string) => {
    const populationMap: Record<string, string> = {
      "Muntenia": "Cea mai populată regiune a României, cu densitate mare în sud și în marile orașe (București).",
      "Moldova": "Densitate medie a populației, cu concentrări urbane în Iași, Bacău, Suceava.",
      "Transilvania": "Densitate moderată, cu diversitate etnică și concentrări în Cluj-Napoca, Brașov, Sibiu.",
      "Dobrogea": "Densitate relativ scăzută, cu multe localități rurale și concentrări în Constanța și Tulcea.",
      "Banat": "Densitate medie, cu diversitate etnică și concentrare urbană în Timișoara.",
      "Maramureș": "Densitate moderată, cu așezări tradiționale și rurale bine păstrate.",
      "Crișana": "Densitate moderată, cu așezări urbane concentrate în Oradea și Arad."
    };
    
    return populationMap[regionName] || "Informații despre populație nedisponibile.";
  };

  // Funcție helper pentru date demo despre resurse naturale
  const getDemoResourcesData = (regionName: string) => {
    const resourcesMap: Record<string, string> = {
      "Muntenia": "Petrol și gaze naturale (zona Ploiești), cărbune, materiale de construcții și terenuri agricole fertile.",
      "Moldova": "Sare, petrol (zona Bacău), păduri, terenuri agricole.",
      "Transilvania": "Gaze naturale, aur, argint, sare, lemn, resurse geotermale.",
      "Dobrogea": "Resurse marine, granit, calcar, minereu de fier, terenuri agricole.",
      "Banat": "Cărbune, minereuri neferoase, petrol, marmură, păduri.",
      "Maramureș": "Aur, argint, cupru, lemn, sare.",
      "Crișana": "Petrol, gaze naturale, bauxită, terenuri agricole fertile."
    };
    
    return resourcesMap[regionName] || "Informații despre resurse nedisponibile.";
  };

  // Funcție helper pentru date demo despre climă
  const getDemoClimateData = (regionName: string) => {
    const climateMap: Record<string, string> = {
      "Muntenia": "Climat temperat-continental, cu veri calde și ierni moderate în sud, și influențe montane în nord.",
      "Moldova": "Climat temperat-continental cu influențe estice, veri călduroase și ierni reci.",
      "Transilvania": "Climat temperat-continental moderat, cu influențe oceanice, adăpostit de lanțurile montane.",
      "Dobrogea": "Climat temperat-continental cu influențe pontice, cel mai arid din România.",
      "Banat": "Climat temperat-continental cu influențe mediteraneene, cel mai blând din România.",
      "Maramureș": "Climat temperat-continental cu influențe nordice, ierni lungi și reci.",
      "Crișana": "Climat temperat-continental moderat, cu influențe oceanice și submediteraneene."
    };
    
    return climateMap[regionName] || "Informații despre climă nedisponibile.";
  };

  // Funcție helper pentru date demo despre economie
  const getDemoEconomyData = (regionName: string) => {
    const economyMap: Record<string, string> = {
      "Muntenia": "Diversificată, cu industrie petrolieră, agricultură intensivă, servicii concentrate în București.",
      "Moldova": "Predominant agricolă, cu industrie alimentară, textilă și IT în dezvoltare în Iași.",
      "Transilvania": "Diversificată, cu industrie prelucrătoare, IT, turism și agricultură mixtă.",
      "Dobrogea": "Turism sezonier, agricultură, pescuit, transport naval prin portul Constanța.",
      "Banat": "Industrie diversificată, agricultură performantă, servicii IT concentrate în Timișoara.",
      "Maramureș": "Industria lemnului, minerit în declin, turism rural și agroturism.",
      "Crișana": "Agricultură, industrie alimentară, industrie de componente auto."
    };
    
    return economyMap[regionName] || "Informații despre economie nedisponibile.";
  };

  // Funcție pentru gestionarea modificărilor notelor utilizatorului
  const handleUserNotesChange = (index: number, value: string) => {
    setRegionData(prevData => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], userNotes: value };
      return newData;
    });
  };

  // Funcție pentru verificarea informațiilor introduse de utilizator folosind API-ul
  const checkUserNotes = async () => {
    if (!regionData[0].userNotes || !regionData[1].userNotes) {
      alert("Te rugăm să introduci observații pentru ambele regiuni!");
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      // Apelăm API-ul de evaluare
      const response = await fetch("/api/evaluate-comparison", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region1: selectedRegions[0],
          region1Data: {
            relief: regionData[0].relief,
            rivers: regionData[0].rivers,
            population: regionData[0].population,
            resources: regionData[0].resources,
            climate: regionData[0].climate,
            economy: regionData[0].economy
          },
          region1Notes: regionData[0].userNotes,
          
          region2: selectedRegions[1],
          region2Data: {
            relief: regionData[1].relief,
            rivers: regionData[1].rivers,
            population: regionData[1].population,
            resources: regionData[1].resources,
            climate: regionData[1].climate,
            economy: regionData[1].economy
          },
          region2Notes: regionData[1].userNotes
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Eroare API: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Verificăm dacă există o eroare în răspuns
      if (data.error) {
        console.warn("Avertisment de la API:", data.error);
        throw new Error(data.error);
      }
      
      // Adăugăm feedback-ul de la Gemini
      setFeedback(data);
      
    } catch (error) {
      console.error("Eroare la evaluarea comparației:", error);
      
      // Folosim metoda de evaluare locală simplă ca backup în caz de eroare API
      const fallbackEvaluation = evaluateLocally();
      setFeedback(fallbackEvaluation);
      
    } finally {
      setIsLoading(false);
    }
  };
  
  // Funcție pentru evaluare locală simplă (backup în caz de eroare API)
  const evaluateLocally = (): FeedbackData => {
    const region1 = selectedRegions[0];
    const region2 = selectedRegions[1];
    const userNotes1 = regionData[0].userNotes.toLowerCase();
    const userNotes2 = regionData[1].userNotes.toLowerCase();
    
    let isCorrect = true;
    const corrections: Array<{ field: string; correction: string }> = [];
    let feedbackMessage = "Informațiile tale sunt corecte! Excelent!";
    
    // Verificăm dacă răspunsurile sunt prea scurte (mai puțin de 20 caractere)
    if (userNotes1.length < 20) {
      isCorrect = false;
      corrections.push({
        field: "region1",
        correction: `Descrierea pentru ${region1} este prea scurtă. Te rugăm să oferi informații mai detaliate despre relief, râuri și alte caracteristici geografice.`
      });
    }
    
    if (userNotes2.length < 20) {
      isCorrect = false;
      corrections.push({
        field: "region2",
        correction: `Descrierea pentru ${region2} este prea scurtă. Te rugăm să oferi informații mai detaliate despre relief, râuri și alte caracteristici geografice.`
      });
    }
    
    // Verifică dacă a fost introdus conținut aleatoriu fără sens
    const textRelevant1 = /râuri|relief|munți|dealuri|podișuri|câmpii|dunărea|delta|clima|populație|resurse/i.test(userNotes1);
    const textRelevant2 = /râuri|relief|munți|dealuri|podișuri|câmpii|dunărea|delta|clima|populație|resurse/i.test(userNotes2);
    
    if (userNotes1.length > 20 && !textRelevant1) {
      isCorrect = false;
      corrections.push({
        field: "region1",
        correction: `Descrierea pentru ${region1} nu pare să conțină informații geografice relevante. Te rugăm să incluzi aspecte despre relief, râuri, climă sau alte elemente geografice.`
      });
    }
    
    if (userNotes2.length > 20 && !textRelevant2) {
      isCorrect = false;
      corrections.push({
        field: "region2",
        correction: `Descrierea pentru ${region2} nu pare să conțină informații geografice relevante. Te rugăm să incluzi aspecte despre relief, râuri, climă sau alte elemente geografice.`
      });
    }
    
    // Verificări specifice pentru fiecare regiune
    if (region1 === "Moldova" && userNotes1.includes("mare") && !userNotes1.includes("siret")) {
      isCorrect = false;
      corrections.push({
        field: "region1",
        correction: "Cel mai important râu din Moldova este Siretul, nu ai menționat acest râu important."
      });
    }
    
    if (region1 === "Dobrogea" && !userNotes1.includes("delta") && !userNotes1.includes("dunării") && !userNotes1.includes("dunarii")) {
      isCorrect = false;
      corrections.push({
        field: "region1",
        correction: "Nu ai menționat Delta Dunării, care este un element geografic definitoriu pentru Dobrogea."
      });
    }
    
    if (region1 === "Muntenia" && !userNotes1.includes("câmpie") && !userNotes1.includes("campie") && !userNotes1.includes("câmpia") && !userNotes1.includes("campia")) {
      isCorrect = false;
      corrections.push({
        field: "region1",
        correction: "Nu ai menționat câmpia, care ocupă o mare parte din sudul Munteniei (Câmpia Română)."
      });
    }
    
    if (region2 === "Transilvania" && !userNotes2.includes("podiș") && !userNotes2.includes("podis")) {
      isCorrect = false;
      corrections.push({
        field: "region2",
        correction: "Transilvania are un relief predominant de podiș depresionar, acest aspect este important de menționat."
      });
    }
    
    if (region2 === "Banat" && !userNotes2.includes("timiș") && !userNotes2.includes("timis") && !userNotes2.includes("bega")) {
      isCorrect = false;
      corrections.push({
        field: "region2",
        correction: "Nu ai menționat râurile importante din Banat, precum Timiș și Bega."
      });
    }
    
    if (!isCorrect) {
      feedbackMessage = "Am găsit câteva inexactități sau lipsuri în descrierea ta. Iată corectările:";
    }
    
    return {
      isCorrect,
      message: feedbackMessage,
      corrections
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Comparator de Regiuni Geografice</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Selectori de regiuni */}
        {[0, 1].map((index) => (
          <div key={index} className="bg-slate-50 p-5 rounded-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Regiunea {index + 1}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Selectează regiunea:
              </label>
              <select
                value={selectedRegions[index]}
                onChange={(e) => {
                  const newRegions = [...selectedRegions];
                  newRegions[index] = e.target.value;
                  setSelectedRegions(newRegions);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selectează o regiune...</option>
                {["Muntenia", "Moldova", "Transilvania", "Dobrogea", "Banat", "Maramureș", "Crișana"].map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedRegions[index] && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-700 mb-1">Relief:</h4>
                  <p className="text-slate-600 bg-white p-2 rounded border border-slate-200 text-sm">
                    {regionData[index].relief}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-700 mb-1">Râuri:</h4>
                  <p className="text-slate-600 bg-white p-2 rounded border border-slate-200 text-sm">
                    {regionData[index].rivers}
                  </p>
                </div>
                
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      const section = document.getElementById(`details-${index}`);
                      if (section) {
                        section.classList.toggle('hidden');
                      }
                    }}
                    className="w-full flex justify-between items-center bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm transition-colors border border-blue-200 mb-2"
                  >
                    <span>Vezi mai multe detalii</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div id={`details-${index}`} className="hidden space-y-3 mb-4">
                    <div>
                      <h4 className="font-medium text-slate-700 mb-1">Populație:</h4>
                      <p className="text-slate-600 bg-white p-2 rounded border border-slate-200 text-sm">
                        {regionData[index].population}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-700 mb-1">Resurse:</h4>
                      <p className="text-slate-600 bg-white p-2 rounded border border-slate-200 text-sm">
                        {regionData[index].resources}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-700 mb-1">Climă:</h4>
                      <p className="text-slate-600 bg-white p-2 rounded border border-slate-200 text-sm">
                        {regionData[index].climate}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-700 mb-1">Economie:</h4>
                      <p className="text-slate-600 bg-white p-2 rounded border border-slate-200 text-sm">
                        {regionData[index].economy}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Observațiile tale despre această regiune:
                  </label>
                  <textarea
                    value={regionData[index].userNotes}
                    onChange={(e) => handleUserNotesChange(index, e.target.value)}
                    placeholder="Introduce observațiile tale despre relief, râuri, climă și alte caracteristici geografice..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Buton pentru verificare */}
      <div className="flex justify-center mb-6">
        <button
          onClick={checkUserNotes}
          disabled={isLoading || !selectedRegions[0] || !selectedRegions[1]}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Se verifică...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Verifică și primește feedback AI
            </>
          )}
        </button>
      </div>
      
      {/* Feedback AI */}
      {feedback && (
        <div className={`p-5 rounded-lg border ${feedback.isCorrect ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'} mb-6`}>
          <h3 className={`text-lg font-semibold ${feedback.isCorrect ? 'text-green-700' : 'text-amber-700'} mb-3`}>
            Feedback AI
          </h3>
          
          {/* Feedback detaliat de la API Gemini */}
          {feedback.feedback ? (
            <div className="prose prose-sm max-w-none text-slate-700">
              {feedback.feedback.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-3">{paragraph}</p>
              ))}
            </div>
          ) : (
            // Feedback simplu (backup)
            <>
              <p className="mb-4">{feedback.message}</p>
              
              {feedback.corrections.length > 0 && (
                <ul className="space-y-2">
                  {feedback.corrections.map((correction, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>{correction.correction}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      )}
      
      {/* Ghid de utilizare */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-md font-semibold text-blue-700 mb-2">Cum să folosești comparatorul de regiuni:</h3>
        <ol className="list-decimal pl-5 text-sm text-blue-800 space-y-1">
          <li>Selectează două regiuni diferite pentru comparare</li>
          <li>Studiază informațiile prezentate pentru fiecare regiune</li>
          <li>Apasă pe "Vezi mai multe detalii" pentru informații suplimentare</li>
          <li>Adaugă propriile observații despre caracteristicile regiunilor în câmpurile de text</li>
          <li>Apasă butonul "Verifică și primește feedback AI" pentru a primi o evaluare detaliată</li>
          <li>Revizuiește observațiile în funcție de feedback și reîncearcă</li>
        </ol>
      </div>
    </div>
  );
} 