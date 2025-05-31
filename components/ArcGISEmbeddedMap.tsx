"use client";

import { useEffect, useRef, useState } from "react";

type ArcGISEmbeddedMapProps = {
  onRegionSelect: (regionId: string, regionName: string) => void;
};

// Definim principalele regiuni cu coordonatele lor aproximative
const REGION_MARKERS = [
  { id: "eastern-carpathians", name: "Carpații Orientali", lat: 47.0, lng: 25.5, color: "#8B4513" },
  { id: "southern-carpathians", name: "Carpații Meridionali", lat: 45.3, lng: 24.0, color: "#8B4513" },
  { id: "western-carpathians", name: "Carpații Occidentali", lat: 46.5, lng: 22.8, color: "#8B4513" },
  { id: "transylvanian-plateau", name: "Podișul Transilvaniei", lat: 46.3, lng: 24.5, color: "#D4B483" },
  { id: "moldavian-plateau", name: "Podișul Moldovei", lat: 47.0, lng: 27.0, color: "#D4B483" },
  { id: "romanian-plain", name: "Câmpia Română", lat: 44.5, lng: 26.0, color: "#9DC183" },
  { id: "western-plain", name: "Câmpia de Vest", lat: 46.0, lng: 21.5, color: "#9DC183" },
  { id: "danube-delta", name: "Delta Dunării", lat: 45.0, lng: 29.0, color: "#B1E4E3" },
  { id: "dobrogea", name: "Dobrogea", lat: 44.5, lng: 28.2, color: "#D4B483" }
];

export default function ArcGISEmbeddedMap({ onRegionSelect }: ArcGISEmbeddedMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<{ id: string, name: string }>({
    id: "eastern-carpathians",
    name: "Carpații Orientali"
  });

  // Selectează regiunea când utilizatorul face click pe hartă sau markeri
  const handleRegionSelect = (regionId: string, regionName: string) => {
    console.log("SELECTARE REGIUNE:", regionName);
    setSelectedRegion({ id: regionId, name: regionName });
    
    // Afișăm un alert pentru a verifica că selecția funcționează
    alert(`Ai selectat regiunea: ${regionName}`);
  };

  // Funcție pentru a genera quiz-ul
  const handleGenerateQuiz = () => {
    console.log(`Generăm quiz pentru ${selectedRegion.name}`);
    
    // Generăm quiz-ul cu regiunea selectată
    onRegionSelect(selectedRegion.id, selectedRegion.name);
    
    // Închidem popup-ul dacă există (folosind o metodă mai sigură)
    try {
      const closeButton = document.querySelector('.esri-popup__button--close') as HTMLElement;
      if (closeButton && typeof closeButton.click === 'function') {
        closeButton.click();
      }
    } catch (error) {
      console.error("Eroare la închiderea popup-ului:", error);
    }
  };

  useEffect(() => {
    console.log("Componenta ArcGISEmbeddedMap se montează");
    
    // Injectează scriptul ArcGIS
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://js.arcgis.com/embeddable-components/4.32/arcgis-embeddable-components.esm.js";
    document.head.appendChild(script);

    // Creează și adaugă componenta după ce scriptul s-a încărcat
    script.onload = () => {
      console.log("Script ArcGIS încărcat");
      
      if (containerRef.current) {
        // Curăță containerul
        containerRef.current.innerHTML = "";
        
        // Creează elementul ArcGIS
        const mapElement = document.createElement("arcgis-embedded-map");
        mapElement.setAttribute("item-id", "9eac5b9a6fc84142b8a22fb97be7a35a");
        mapElement.setAttribute("theme", "light");
        mapElement.setAttribute("portal-url", "https://www.arcgis.com");
        mapElement.style.width = "100%";
        mapElement.style.height = "100%";
        
        // Adaugă la container
        containerRef.current.appendChild(mapElement);
        mapRef.current = mapElement;
        
        // Adaugă evenimente pentru hărta ArcGIS
        mapElement.addEventListener("arcgis-embedded-map-ready", () => {
          console.log("Harta ArcGIS este încărcată și gata");
          // Adăugăm markerii peste hartă
          setTimeout(addRegionMarkers, 1000);
        });
      }
    };

    // Cleanup
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [onRegionSelect]);

  // Funcție pentru adăugarea markerilor pentru regiuni
  const addRegionMarkers = () => {
    if (!containerRef.current) return;
    
    // Creăm un div overlay pentru markeri
    const markersOverlay = document.createElement("div");
    markersOverlay.className = "absolute inset-0 pointer-events-none";
    containerRef.current.appendChild(markersOverlay);
    
    // Adăugăm markeri pentru fiecare regiune
    REGION_MARKERS.forEach(region => {
      // Creăm containerul pentru marker
      const markerContainer = document.createElement("div");
      markerContainer.className = "absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto";
      markerContainer.id = `marker-${region.id}`;
      
      // Calculăm poziția aproximativă pe ecran
      const mapWidth = containerRef.current?.clientWidth || 1;
      const mapHeight = containerRef.current?.clientHeight || 1;
      
      // România este aproximativ între long 20-30 și lat 43-48
      const longRange = 10; // 30 - 20
      const latRange = 5;  // 48 - 43
      
      const x = ((region.lng - 20) / longRange) * mapWidth;
      const y = ((48 - region.lat) / latRange) * mapHeight;
      
      markerContainer.style.left = `${x}px`;
      markerContainer.style.top = `${y}px`;
      
      // Creăm marker-ul steag
      const marker = document.createElement("div");
      marker.className = "flex flex-col items-center cursor-pointer transition-transform z-10";
      marker.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-white border-2 shadow-md flex items-center justify-center" 
             style="border-color: ${region.color}">
          <div class="w-3 h-3 rounded-full" style="background-color: ${region.color}"></div>
        </div>
        <div class="mt-1 bg-white text-xs font-medium px-2 py-1 rounded shadow-md opacity-0 transition-opacity whitespace-nowrap"
             id="label-${region.id}">
          ${region.name}
        </div>
      `;
      
      // Adăugăm event listeners
      marker.addEventListener("mouseenter", () => {
        setHoveredMarker(region.id);
        const label = document.getElementById(`label-${region.id}`);
        if (label) {
          label.classList.remove("opacity-0");
          label.classList.add("opacity-100");
        }
        marker.classList.add("scale-110");
      });
      
      marker.addEventListener("mouseleave", () => {
        setHoveredMarker(null);
        const label = document.getElementById(`label-${region.id}`);
        if (label) {
          label.classList.remove("opacity-100");
          label.classList.add("opacity-0");
        }
        marker.classList.remove("scale-110");
      });
      
      marker.addEventListener("click", () => {
        handleRegionSelect(region.id, region.name);
      });
      
      markerContainer.appendChild(marker);
      markersOverlay.appendChild(markerContainer);
    });
    
    // Adăugăm și un overlay pentru regiuni
    createRegionOverlay();
  };
  
  // Funcție pentru a crea un overlay cu regiunile Relief
  const createRegionOverlay = () => {
    if (!containerRef.current) return;
    
    // Definim regiunile de relief (simplificate)
    const regions = [
      { id: "eastern-carpathians", name: "Carpații Orientali", points: "30%,10% 40%,15% 45%,30% 35%,40% 30%,35% 25%,20%" },
      { id: "southern-carpathians", name: "Carpații Meridionali", points: "30%,40% 50%,30% 55%,45% 25%,55%" },
      { id: "western-carpathians", name: "Carpații Occidentali", points: "20%,30% 30%,35% 30%,55% 15%,60% 10%,40%" },
      { id: "transylvanian-plateau", name: "Podișul Transilvaniei", points: "30%,25% 45%,30% 40%,45% 30%,40% 25%,30%" },
      { id: "moldavian-plateau", name: "Podișul Moldovei", points: "45%,15% 65%,20% 70%,45% 55%,45% 45%,30%" },
      { id: "romanian-plain", name: "Câmpia Română", points: "30%,55% 55%,45% 70%,55% 65%,75% 40%,85% 25%,70%" },
      { id: "western-plain", name: "Câmpia de Vest", points: "10%,40% 20%,35% 25%,55% 15%,70% 5%,60%" },
      { id: "danube-delta", name: "Delta Dunării", points: "70%,55% 85%,50% 90%,60% 80%,70%" },
      { id: "dobrogea", name: "Dobrogea", points: "70%,45% 85%,45% 85%,65% 70%,60%" }
    ];
    
    // Creăm containerul pentru overlay
    const overlayContainer = document.createElement("div");
    overlayContainer.className = "absolute inset-0 pointer-events-none";
    overlayContainer.style.zIndex = "10";
    containerRef.current.appendChild(overlayContainer);
    
    // Creăm un SVG pentru regiuni
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("className", "pointer-events-none");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    overlayContainer.appendChild(svg);
    
    // Adăugăm regiunile ca poligoane
    regions.forEach(region => {
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      polygon.setAttribute("points", region.points);
      polygon.setAttribute("data-id", region.id);
      polygon.setAttribute("data-name", region.name);
      polygon.style.fill = "transparent";
      polygon.style.stroke = "transparent";
      polygon.style.strokeWidth = "1";
      polygon.style.cursor = "pointer";
      polygon.style.pointerEvents = "auto";
      
      // Adăugăm event listeners
      polygon.addEventListener("mouseenter", () => {
        polygon.style.fill = "rgba(59, 130, 246, 0.2)"; // albastru transparent
      });
      
      polygon.addEventListener("mouseleave", () => {
        polygon.style.fill = "transparent";
      });
      
      polygon.addEventListener("click", () => {
        const regionId = polygon.getAttribute("data-id") || "";
        const regionName = polygon.getAttribute("data-name") || "";
        handleRegionSelect(regionId, regionName);
      });
      
      svg.appendChild(polygon);
    });
  };

  return (
    <div className="relative w-full h-full">
      {/* Container pentru harta ArcGIS */}
      <div 
        ref={containerRef} 
        className="w-full h-[60vh] rounded-lg shadow-md overflow-hidden"
      ></div>
      
      {/* Selector explicit de regiuni, ca backup pentru cazul în care detectarea nu funcționează */}
      <div className="mt-4 mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Selectează regiunea pentru quiz:
        </label>
        <select 
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={selectedRegion.id}
          onChange={(e) => {
            const region = REGION_MARKERS.find(r => r.id === e.target.value);
            if (region) {
              setSelectedRegion({ id: region.id, name: region.name });
            }
          }}
        >
          {REGION_MARKERS.map(region => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Buton permanent pentru generarea quiz-ului */}
      <div className="mt-2">
        <button
          onClick={handleGenerateQuiz}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-bold text-lg flex items-center justify-center transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
          Generează Quiz pentru {selectedRegion.name}
        </button>
      </div>
      
      {/* Legendă pentru tipurile de relief */}
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-md border border-slate-200 z-10">
        <h3 className="text-sm font-medium text-slate-700 mb-1">Legendă</h3>
        <div className="grid grid-cols-1 gap-1 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: "#8B4513" }}></div>
            <span>Munți</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: "#D4B483" }}></div>
            <span>Podișuri</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: "#9DC183" }}></div>
            <span>Câmpii</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: "#B1E4E3" }}></div>
            <span>Delta Dunării</span>
          </div>
        </div>
      </div>
      
      {/* Instrucțiuni */}
      <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md border border-slate-200 z-10">
        <p className="text-xs text-slate-700">
          Faceți click pe hartă pentru a selecta o regiune sau folosiți selectorul de mai jos
        </p>
      </div>
    </div>
  );
} 