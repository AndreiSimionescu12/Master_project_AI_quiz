import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { RegionData, getRegionById } from '../lib/regionsData';

interface InteractiveMapProps {
  mode: 'explore' | 'quiz' | 'story';
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ mode }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [currentRegion, setCurrentRegion] = useState<RegionData | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [25.0, 45.7], // Centrul României
      zoom: 6,
      pitch: 60, // Perspectivă 3D
      bearing: 0,
    });

    map.current.on('load', () => {
      // Adăugăm layer-ul pentru relief
      map.current?.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      });

      map.current?.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

      // Adăugăm markeri pentru regiuni
      map.current?.addLayer({
        id: 'regions',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: { id: 'transilvania' },
                geometry: {
                  type: 'Point',
                  coordinates: [24.0, 46.5]
                }
              }
              // Vom adăuga mai multe regiuni aici
            ]
          }
        },
        paint: {
          'circle-radius': 8,
          'circle-color': '#B42222',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });
    });

    // Adăugăm interacțiunea cu markerii
    map.current?.on('click', 'regions', (e) => {
      if (e.features && e.features[0]) {
        const regionId = e.features[0].properties?.id;
        const region = getRegionById(regionId);
        if (region) {
          setCurrentRegion(region);
        }
      }
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md">
        <h2 className="text-xl font-bold mb-2">Mod: {mode}</h2>
        {currentRegion && (
          <div className="mt-2">
            <h3 className="font-semibold text-lg">{currentRegion.name}</h3>
            <p className="mt-2">{currentRegion.description}</p>
            
            <div className="mt-4">
              <h4 className="font-semibold">Fapte interesante:</h4>
              <ul className="list-disc pl-5 mt-1">
                {currentRegion.facts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold">Resurse naturale:</h4>
              <ul className="list-disc pl-5 mt-1">
                {currentRegion.resources.map((resource, index) => (
                  <li key={index}>{resource}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold">Zone protejate:</h4>
              <ul className="list-disc pl-5 mt-1">
                {currentRegion.protectedAreas.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap; 