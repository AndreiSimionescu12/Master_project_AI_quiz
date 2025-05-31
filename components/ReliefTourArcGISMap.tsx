"use client";

import { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

interface ReliefTourArcGISMapProps {
  selectedZone: string | null;
  onZoneClick?: (zoneId: string, zoneName: string) => void;
}

const ZONE_COORDINATES: Record<string, [number, number, number]> = {
  "carpatii-meridionali": [24.7, 45.4, 7],
  "carpatii-orientali": [25.8, 46.5, 7],
  "carpatii-occidentali": [22.5, 46.3, 7],
  "podisul-transilvaniei": [24.2, 46.8, 7],
  "campia-romana": [26.2, 44.3, 7],
  "delta-dunarii": [29.2, 45.1, 8],
};

export default function ReliefTourArcGISMap({ 
  selectedZone,
  onZoneClick 
}: ReliefTourArcGISMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    loadModules([
      "esri/Map",
      "esri/views/SceneView",
      "esri/layers/FeatureLayer",
      "esri/widgets/BasemapGallery",
      "esri/widgets/LayerList"
    ]).then(([Map, SceneView, FeatureLayer, BasemapGallery, LayerList]) => {
      const map = new Map({
        basemap: "satellite",
        ground: "world-elevation"
      });

      const view = new SceneView({
        container: mapRef.current,
        map: map,
        camera: {
          position: {
            longitude: 25,
            latitude: 46,
            z: 1000000
          },
          heading: 0,
          tilt: 45
        }
      });

      viewRef.current = view;

      // Adăugăm layer pentru zonele de relief
      const reliefLayer = new FeatureLayer({
        url: "URL_CATRE_FEATURE_LAYER_RELIEF",
        outFields: ["*"],
        popupEnabled: true
      });

      map.add(reliefLayer);

      // Gestionăm click events
      view.on("click", (event) => {
        view.hitTest(event).then((response: any) => {
          if (response.results.length) {
            const feature = response.results[0].graphic;
            const zoneId = feature.attributes.ZONE_ID;
            const zoneName = feature.attributes.ZONE_NAME;
            if (onZoneClick && zoneId && zoneName) {
              onZoneClick(zoneId, zoneName);
            }
          }
        });
      });

      // Actualizăm camera când se schimbă zona selectată
      if (selectedZone && ZONE_COORDINATES[selectedZone]) {
        const [longitude, latitude, zoom] = ZONE_COORDINATES[selectedZone];
        view.goTo({
          position: {
            longitude,
            latitude,
            z: 100000 / zoom
          },
          tilt: 65,
          heading: 0
        }, { duration: 1000 });
      }
    }).catch((err) => {
      console.error("Eroare la încărcarea modulelor ArcGIS:", err);
    });

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
      }
    };
  }, [selectedZone, onZoneClick]);

  return (
    <div className="w-full h-[600px] relative">
      <div ref={mapRef} className="absolute inset-0" />
    </div>
  );
} 