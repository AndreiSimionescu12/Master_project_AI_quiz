"use client";

import { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Tipul pentru proprietățile componentei
type ReliefMapProps = {
  onRegionSelect: (regionId: string, regionName: string) => void;
};

// URL pentru sursa de date GeoJSON pentru regiunile de relief ale României
const RELIEF_REGIONS_GEOJSON_URL = "/data/romania-relief-regions.json";

// Folosim o variabilă de mediu în locul token-ului hardcodat
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoiYW5kcmVpZGV2IiwiYSI6ImNsa2Q0NWM0MDEwZjk0MW16ZHlzOXF1N2gifQ.uoHmCBWH3eX4rSFRrPKJ3Q";
mapboxgl.accessToken = MAPBOX_TOKEN;

// Definim culorile pentru fiecare tip de relief
const reliefColors = {
  mountains: "#A27752", // maro pentru munți
  plateau: "#D4B483",   // bej pentru podișuri
  plain: "#9DC183",     // verde deschis pentru câmpii
  delta: "#B1E4E3"      // albastru-verde deschis pentru deltă
};

export default function ReliefMap({ onRegionSelect }: ReliefMapProps) {
  // Referința către elementul container al hărții
  const mapContainer = useRef<HTMLDivElement>(null);
  
  // Referința către obiectul map
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  
  // State pentru regiunea selectată
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  
  // State pentru regiunea peste care este mouse-ul
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  
  // State pentru loading
  const [loading, setLoading] = useState<boolean>(true);
  
  // State pentru erori
  const [error, setError] = useState<string | null>(null);

  // Inițializăm harta când componenta este montată
  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Creăm harta cu un stil care include date de relief
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v11', // Stil cu informații de relief
        center: [25, 46], // Centru aproximativ al României
        zoom: 6,
        minZoom: 5,
        maxZoom: 9,
        pitch: 40, // Adăugăm înclinare pentru a evidenția relieful 3D
        bearing: 0
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
          
          // Adăugăm stratul pentru relief 3D
          map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
          });
          
          // Adăugăm efectul de relief 3D
          map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
          
          // Încărcăm datele GeoJSON pentru regiunile de relief
          const response = await fetch(RELIEF_REGIONS_GEOJSON_URL);
          if (!response.ok) {
            throw new Error(`Eroare HTTP: ${response.status}`);
          }
          const data = await response.json();

          // Adăugăm sursa de date
          map.addSource('relief-regions', {
            type: 'geojson',
            data: data,
            generateId: true
          });

          // Adăugăm straturile după ce sursele au fost adăugate
          setTimeout(() => {
            try {
              // Adăugăm un strat pentru regiunile de relief cu "buffer" pentru a face click-ul mai ușor
              map.addLayer({
                id: 'relief-regions-click-targets',
                type: 'fill',
                source: 'relief-regions',
                paint: {
                  'fill-color': 'transparent',
                  'fill-opacity': 0
                }
              });

              // Adăugăm stratul de regiuni de relief (fill)
              map.addLayer({
                id: 'relief-regions-fill',
                type: 'fill',
                source: 'relief-regions',
                paint: {
                  'fill-color': [
                    'case',
                    ['==', ['get', 'name'], selectedRegion || ''],
                    '#4287f5', // Culoarea pentru regiunea selectată
                    ['==', ['get', 'name'], hoveredRegion || ''],
                    '#92c3fd', // Culoarea pentru regiunea peste care este mouse-ul
                    [
                      'match',
                      ['get', 'type'],
                      'mountains', reliefColors.mountains,
                      'plateau', reliefColors.plateau,
                      'plain', reliefColors.plain,
                      'delta', reliefColors.delta,
                      '#f1f1f1' // culoare default
                    ]
                  ],
                  'fill-opacity': [
                    'case',
                    ['==', ['get', 'name'], selectedRegion || ''],
                    0.8, // Opacitate mai mare pentru regiunea selectată
                    ['==', ['get', 'name'], hoveredRegion || ''],
                    0.7, // Opacitate pentru hover
                    0.6  // Opacitate implicită
                  ],
                  'fill-outline-color': '#627BC1'
                }
              });

              // Adăugăm stratul de contur pentru regiunile de relief
              map.addLayer({
                id: 'relief-regions-line',
                type: 'line',
                source: 'relief-regions',
                paint: {
                  'line-color': '#627BC1',
                  'line-width': [
                    'case',
                    ['==', ['get', 'name'], selectedRegion || ''],
                    2, // Linie mai groasă pentru regiunea selectată
                    ['==', ['get', 'name'], hoveredRegion || ''],
                    1.5, // Linie pentru hover
                    1  // Linie implicită
                  ]
                }
              });

              // Adăugăm stratul pentru etichetele regiunilor
              map.addLayer({
                id: 'relief-regions-label',
                type: 'symbol',
                source: 'relief-regions',
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

              // Adăugăm steaguri pentru regiunile de relief (simboluri pentru fiecare tip de formă de relief)
              map.addLayer({
                id: 'relief-region-flags',
                type: 'symbol',
                source: 'relief-regions',
                layout: {
                  'icon-image': [
                    'match',
                    ['get', 'type'],
                    'mountains', 'mountain', // Imagine pentru munți
                    'plateau', 'mountain', // Imagine pentru podișuri
                    'plain', 'park', // Imagine pentru câmpii
                    'delta', 'water', // Imagine pentru deltă
                    'marker' // Imagine default
                  ],
                  'icon-size': 0.5,
                  'icon-allow-overlap': false,
                  'icon-anchor': 'bottom'
                }
              });

              // Adăugăm handler pentru evenimente mouse
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
          console.error("Eroare la încărcarea regiunilor:", error);
          setError("Nu am putut încărca harta regiunilor de relief. Verificați conexiunea la internet.");
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
        map.on('click', 'relief-regions-click-targets', (e) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            const regionName = feature.properties?.name;
            const regionId = feature.properties?.id;

            if (regionId && regionName) {
              setSelectedRegion(regionName);
              // Actualizăm stratul de fill pentru a reflecta regiunea selectată
              map.setPaintProperty('relief-regions-fill', 'fill-color', [
                'case',
                ['==', ['get', 'name'], regionName],
                '#4287f5', // Culoarea pentru regiunea selectată
                ['==', ['get', 'name'], hoveredRegion || ''],
                '#92c3fd', // Culoarea pentru regiunea peste care este mouse-ul
                [
                  'match',
                  ['get', 'type'],
                  'mountains', reliefColors.mountains,
                  'plateau', reliefColors.plateau,
                  'plain', reliefColors.plain,
                  'delta', reliefColors.delta,
                  '#f1f1f1' // culoare default
                ]
              ]);
              
              // Actualizăm grosimea liniei pentru regiunea selectată
              map.setPaintProperty('relief-regions-line', 'line-width', [
                'case',
                ['==', ['get', 'name'], regionName],
                2, // Linie mai groasă pentru regiunea selectată
                ['==', ['get', 'name'], hoveredRegion || ''],
                1.5, // Linie pentru hover
                1  // Linie implicită
              ]);
              
              onRegionSelect(regionId, regionName);
            }
          }
        });

        // Adăugăm efecte hover
        map.on('mouseenter', 'relief-regions-click-targets', (e) => {
          if (e.features && e.features.length > 0) {
            map.getCanvas().style.cursor = 'pointer';
            const regionName = e.features[0].properties?.name;
            
            if (regionName && regionName !== selectedRegion) {
              setHoveredRegion(regionName);
              // Actualizăm culoarea pentru hover
              map.setPaintProperty('relief-regions-fill', 'fill-color', [
                'case',
                ['==', ['get', 'name'], selectedRegion || ''],
                '#4287f5', // Culoarea pentru regiunea selectată
                ['==', ['get', 'name'], regionName],
                '#92c3fd', // Culoarea pentru regiunea peste care este mouse-ul
                [
                  'match',
                  ['get', 'type'],
                  'mountains', reliefColors.mountains,
                  'plateau', reliefColors.plateau,
                  'plain', reliefColors.plain,
                  'delta', reliefColors.delta,
                  '#f1f1f1' // culoare default
                ]
              ]);
              
              map.setPaintProperty('relief-regions-line', 'line-width', [
                'case',
                ['==', ['get', 'name'], selectedRegion || ''],
                2, // Linie mai groasă pentru regiunea selectată
                ['==', ['get', 'name'], regionName],
                1.5, // Linie pentru hover
                1  // Linie implicită
              ]);
            }
          }
        });

        map.on('mouseleave', 'relief-regions-click-targets', () => {
          map.getCanvas().style.cursor = '';
          setHoveredRegion(null);
          // Resetăm culoarea hover
          map.setPaintProperty('relief-regions-fill', 'fill-color', [
            'case',
            ['==', ['get', 'name'], selectedRegion || ''],
            '#4287f5', // Culoarea pentru regiunea selectată
            [
              'match',
              ['get', 'type'],
              'mountains', reliefColors.mountains,
              'plateau', reliefColors.plateau,
              'plain', reliefColors.plain,
              'delta', reliefColors.delta,
              '#f1f1f1' // culoare default
            ]
          ]);
          
          map.setPaintProperty('relief-regions-line', 'line-width', [
            'case',
            ['==', ['get', 'name'], selectedRegion || ''],
            2, // Linie mai groasă pentru regiunea selectată
            1  // Linie implicită
          ]);
        });
      };

      // Curățăm după noi când componenta este demontată
      return () => {
        map.remove();
      };
    } catch (err) {
      console.error("Eroare la inițializarea hărții:", err);
      setError("Harta nu a putut fi încărcată. Te rugăm să reîncarci pagina.");
      setLoading(false);
    }
  }, [onRegionSelect]);

  // Ajustăm harta când se schimbă regiunea selectată
  useEffect(() => {
    if (mapInstance.current && selectedRegion) {
      const map = mapInstance.current;
      
      // Actualizăm culoarea pentru regiunea selectată
      map.setPaintProperty('relief-regions-fill', 'fill-color', [
        'case',
        ['==', ['get', 'name'], selectedRegion],
        '#4287f5', // Culoarea pentru regiunea selectată
        ['==', ['get', 'name'], hoveredRegion || ''],
        '#92c3fd', // Culoarea pentru regiunea peste care este mouse-ul
        [
          'match',
          ['get', 'type'],
          'mountains', reliefColors.mountains,
          'plateau', reliefColors.plateau,
          'plain', reliefColors.plain,
          'delta', reliefColors.delta,
          '#f1f1f1' // culoare default
        ]
      ]);
      
      // Actualizăm grosimea liniei
      map.setPaintProperty('relief-regions-line', 'line-width', [
        'case',
        ['==', ['get', 'name'], selectedRegion],
        2, // Linie mai groasă pentru regiunea selectată
        ['==', ['get', 'name'], hoveredRegion || ''],
        1.5, // Linie pentru hover
        1  // Linie implicită
      ]);
    }
  }, [selectedRegion, hoveredRegion]);

  return (
    <div className="relative h-full w-full">
      {/* Container pentru hartă */}
      <div ref={mapContainer} className="w-full h-[60vh] rounded-lg shadow-md" />
      
      {/* Overlay de loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-sm text-slate-700">Se încarcă harta...</p>
          </div>
        </div>
      )}
      
      {/* Mesaj de eroare */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-xs">
            <h3 className="text-red-800 font-medium mb-1">Eroare</h3>
            <p className="text-red-700 text-sm">{error}</p>
            <button 
              className="mt-2 text-xs font-medium text-red-800 hover:text-red-700"
              onClick={() => window.location.reload()}
            >
              Reîncarcă pagina
            </button>
          </div>
        </div>
      )}
      
      {/* Legendă pentru culorile de relief */}
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-md border border-slate-200">
        <h3 className="text-sm font-medium text-slate-700 mb-1">Legendă</h3>
        <div className="grid grid-cols-1 gap-1 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: reliefColors.mountains }}></div>
            <span>Munți</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: reliefColors.plateau }}></div>
            <span>Podișuri</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: reliefColors.plain }}></div>
            <span>Câmpii</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: reliefColors.delta }}></div>
            <span>Delta Dunării</span>
          </div>
        </div>
      </div>
    </div>
  );
} 