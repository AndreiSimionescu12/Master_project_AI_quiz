"use client";

import { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Tipul pentru proprietățile componentei
type RomaniaMapProps = {
  onCountySelect: (countyId: string, countyName: string) => void;
};

// URL pentru sursa de date GeoJSON pentru județele României
// Folosim fișierul complet cu toate județele României
const COUNTIES_GEOJSON_URL = "/data/romania-counties-full.json";

// Folosim o variabilă de mediu în locul token-ului hardcodat
// În lipsă, folosim valoarea implicită dar pentru producție este necesar un token valid
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoiYW5kcmVpZGV2IiwiYSI6ImNsa2Q0NWM0MDEwZjk0MW16ZHlzOXF1N2gifQ.uoHmCBWH3eX4rSFRrPKJ3Q";
mapboxgl.accessToken = MAPBOX_TOKEN;

export default function RomaniaMap({ onCountySelect }: RomaniaMapProps) {
  // Referința către elementul container al hărții
  const mapContainer = useRef<HTMLDivElement>(null);
  
  // Referința către obiectul map
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  
  // State pentru județul selectat
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  
  // State pentru județul peste care este mouse-ul
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);
  
  // State pentru loading
  const [loading, setLoading] = useState<boolean>(true);
  
  // State pentru erori
  const [error, setError] = useState<string | null>(null);

  // Inițializăm harta când componenta este montată
  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Creăm harta cu un stil complet
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11', // Folosim direct stilul predefinit
        center: [25, 46], // Centru aproximativ al României
        zoom: 6,
        minZoom: 5,
        maxZoom: 10
      });

      // Adăugăm controale de navigare
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Salvăm referința către hartă
      mapInstance.current = map;

      // Când stilul s-a încărcat complet
      map.on('style.load', () => {
        console.log("Stil încărcat");
        
        // Verificăm dacă harta are proprietatea glyphs setată
        const style = map.getStyle();
        if (!style.glyphs) {
          console.log("Setăm proprietatea glyphs");
          map.setStyle({
            ...style,
            glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}'
          });
        }
      });

      // Încărcăm datele GeoJSON când harta este complet inițializată
      map.once('load', async () => {
        try {
          console.log("Harta încărcată complet");
          setLoading(true);
          
          // Încărcăm datele GeoJSON pentru județe
          const response = await fetch(COUNTIES_GEOJSON_URL);
          if (!response.ok) {
            throw new Error(`Eroare HTTP: ${response.status}`);
          }
          const data = await response.json();

          // Adăugăm sursa de date dacă nu există deja
          if (!map.getSource('counties')) {
            map.addSource('counties', {
              type: 'geojson',
              data: data,
              generateId: true
            });
          }

          // Adăugăm straturile după ce sursele au fost adăugate
          setTimeout(() => {
            try {
              // Adăugăm un strat pentru județe cu "buffer" pentru a face click-ul mai ușor
              if (!map.getLayer('counties-click-targets')) {
                map.addLayer({
                  id: 'counties-click-targets',
                  type: 'fill',
                  source: 'counties',
                  paint: {
                    'fill-color': 'transparent',
                    'fill-opacity': 0
                  }
                });
              }

              // Adăugăm stratul de județe (fill)
              if (!map.getLayer('counties-fill')) {
                map.addLayer({
                  id: 'counties-fill',
                  type: 'fill',
                  source: 'counties',
                  paint: {
                    'fill-color': [
                      'case',
                      ['==', ['get', 'name'], selectedCounty || ''],
                      '#4287f5', // Culoarea pentru județul selectat
                      ['==', ['get', 'name'], hoveredCounty || ''],
                      '#92c3fd', // Culoarea pentru județul peste care este mouse-ul
                      '#f1f1f1'  // Culoarea implicită
                    ],
                    'fill-opacity': [
                      'case',
                      ['==', ['get', 'name'], selectedCounty || ''],
                      0.8, // Opacitate mai mare pentru județul selectat
                      ['==', ['get', 'name'], hoveredCounty || ''],
                      0.7, // Opacitate pentru hover
                      0.6  // Opacitate implicită
                    ],
                    'fill-outline-color': '#627BC1'
                  }
                });
              }

              // Adăugăm stratul de contur pentru județe
              if (!map.getLayer('counties-line')) {
                map.addLayer({
                  id: 'counties-line',
                  type: 'line',
                  source: 'counties',
                  paint: {
                    'line-color': '#627BC1',
                    'line-width': [
                      'case',
                      ['==', ['get', 'name'], selectedCounty || ''],
                      2, // Linie mai groasă pentru județul selectat
                      ['==', ['get', 'name'], hoveredCounty || ''],
                      1.5, // Linie pentru hover
                      1  // Linie implicită
                    ]
                  }
                });
              }

              // Adăugăm stratul pentru etichetele județelor
              if (!map.getLayer('counties-label')) {
                map.addLayer({
                  id: 'counties-label',
                  type: 'symbol',
                  source: 'counties',
                  layout: {
                    'text-field': ['get', 'name'],
                    'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
                    'text-size': 10,
                    'text-transform': 'uppercase',
                    'text-letter-spacing': 0.05,
                    'text-allow-overlap': false
                  },
                  paint: {
                    'text-color': '#48484a',
                    'text-halo-color': '#fff',
                    'text-halo-width': 1.5
                  }
                });
              }

              // Adăugăm handler pentru evenimente mouse după ce straturile sunt încărcate
              setupEventHandlers(map);
              
              // Acum că totul e încărcat, dezactivăm loading state
              setLoading(false);
              setError(null);
            } catch (layerError) {
              console.error("Eroare la adăugarea straturilor:", layerError);
              setError("Eroare la configurarea hărții. Încearcă să reîncarci pagina.");
              setLoading(false);
            }
          }, 100); // Mic delay pentru a ne asigura că sursa e complet încărcată
          
        } catch (error) {
          console.error("Eroare la încărcarea județelor:", error);
          setError("Nu am putut încărca harta județelor. Verificați conexiunea la internet.");
          setLoading(false);
        }
      });

      // Tratăm erorile de încărcare a hărții
      map.on('error', (e) => {
        console.error('Eroare Mapbox:', e.error);
        setError(`Eroare la încărcarea hărții: ${e.error?.message || 'Eroare necunoscută'}`);
        setLoading(false);
      });

      // Funcție pentru configurarea event handler-urilor
      const setupEventHandlers = (map: mapboxgl.Map) => {
        // Adăugăm handler pentru click pe zona extinsă pentru a face selectarea mai ușoară
        map.on('click', 'counties-click-targets', (e) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            const countyName = feature.properties?.name;
            const countyId = feature.properties?.code || feature.properties?.id;

            if (countyId && countyName) {
              setSelectedCounty(countyName);
              // Actualizăm stratul de fill pentru a reflecta județul selectat
              map.setPaintProperty('counties-fill', 'fill-color', [
                'case',
                ['==', ['get', 'name'], countyName],
                '#4287f5', // Culoarea pentru județul selectat
                ['==', ['get', 'name'], hoveredCounty || ''],
                '#92c3fd', // Culoarea pentru județul peste care este mouse-ul
                '#f1f1f1'  // Culoarea implicită
              ]);
              
              // Actualizăm grosimea liniei pentru județul selectat
              map.setPaintProperty('counties-line', 'line-width', [
                'case',
                ['==', ['get', 'name'], countyName],
                2, // Linie mai groasă pentru județul selectat
                ['==', ['get', 'name'], hoveredCounty || ''],
                1.5, // Linie pentru hover
                1  // Linie implicită
              ]);
              
              onCountySelect(countyId, countyName);
            }
          }
        });

        // Adăugăm efecte hover
        map.on('mouseenter', 'counties-click-targets', (e) => {
          if (e.features && e.features.length > 0) {
            map.getCanvas().style.cursor = 'pointer';
            
            const feature = e.features[0];
            const countyName = feature.properties?.name;
            
            if (countyName && countyName !== selectedCounty) {
              setHoveredCounty(countyName);
              
              // Actualizăm culoarea și opacitatea pentru hover
              map.setPaintProperty('counties-fill', 'fill-color', [
                'case',
                ['==', ['get', 'name'], selectedCounty || ''],
                '#4287f5', // Culoarea pentru județul selectat
                ['==', ['get', 'name'], countyName],
                '#92c3fd', // Culoarea pentru județul peste care este mouse-ul
                '#f1f1f1'  // Culoarea implicită
              ]);
              
              // Actualizăm grosimea liniei pentru hover
              map.setPaintProperty('counties-line', 'line-width', [
                'case',
                ['==', ['get', 'name'], selectedCounty || ''],
                2, // Linie mai groasă pentru județul selectat
                ['==', ['get', 'name'], countyName],
                1.5, // Linie pentru hover
                1  // Linie implicită
              ]);
            }
          }
        });
        
        map.on('mouseleave', 'counties-click-targets', () => {
          map.getCanvas().style.cursor = '';
          setHoveredCounty(null);
          
          // Resetăm culoarea și opacitatea
          map.setPaintProperty('counties-fill', 'fill-color', [
            'case',
            ['==', ['get', 'name'], selectedCounty || ''],
            '#4287f5', // Culoarea pentru județul selectat
            '#f1f1f1'  // Culoarea implicită
          ]);
          
          // Resetăm grosimea liniei
          map.setPaintProperty('counties-line', 'line-width', [
            'case',
            ['==', ['get', 'name'], selectedCounty || ''],
            2, // Linie mai groasă pentru județul selectat
            1  // Linie implicită
          ]);
        });
      };

      // Curățăm la demontarea componentei
      return () => {
        map.remove();
      };
      
    } catch (err: any) {
      console.error("Eroare la inițializarea hărții:", err);
      setError(`Eroare la inițializarea hărții: ${err.message}`);
      setLoading(false);
    }
  }, [onCountySelect, selectedCounty]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      {/* Indicator de încărcare */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      )}

      {/* Mesaj de eroare */}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-90">
          <div className="bg-red-50 p-4 rounded-md text-red-700 max-w-md text-center">
            <p className="font-medium mb-2">Eroare la încărcarea hărții</p>
            <p className="text-sm">{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              Reîncarcă
            </button>
          </div>
        </div>
      )}

      {/* Container pentru hartă */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Legendă */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 z-10 border border-slate-100">
        <h3 className="text-sm font-medium mb-1">GeoBacAI</h3>
        <p className="text-xs text-gray-600">Selectează un județ pentru a începe</p>
        {selectedCounty && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs font-medium">Județul selectat:</p>
            <p className="text-sm text-[#002B7F] font-medium">{selectedCounty}</p>
          </div>
        )}
      </div>
      
      {/* Instrucțiuni */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 z-10 max-w-xs border border-slate-100">
        <p className="text-xs text-gray-600">
          <span className="font-medium">Sfat:</span> Folosește controalele de zoom pentru a mări harta și a selecta mai ușor un județ
        </p>
      </div>
    </div>
  );
} 