"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { regions3DData, Region3DData } from "@/lib/regions3DData";

// Setează token-ul Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface InteractiveMap3DProps {
  mode: "explore" | "quiz" | "story";
}

export default function InteractiveMap3D({ mode }: InteractiveMap3DProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [25.0, 45.8], // Centrul României
      zoom: 6,
      pitch: 60, // Unghi pentru efect 3D
      bearing: 0,
    });

    map.current.on("load", () => {
      // Adaugă layer-ul pentru relief
      map.current?.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });

      map.current?.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      // Adaugă markeri pentru regiuni
      regions3DData.forEach((region: Region3DData) => {
        const el = document.createElement("div");
        el.className = "region-marker";
        el.style.width = "20px";
        el.style.height = "20px";
        el.style.borderRadius = "50%";
        el.style.backgroundColor = "#FF4B4B";
        el.style.border = "2px solid white";
        el.style.cursor = "pointer";
        el.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";

        new mapboxgl.Marker(el)
          .setLngLat(region.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <h3 class="font-bold text-lg mb-2">${region.name}</h3>
              <p class="text-sm">${region.description}</p>
            `)
          )
          .addTo(map.current!);

        el.addEventListener("click", () => {
          setSelectedRegion(region.id);
          if (mode === "story") {
            // Aici vom adăuga logica pentru modul poveste
            console.log("Poveste pentru:", region.name);
          } else if (mode === "quiz") {
            // Aici vom adăuga logica pentru modul quiz
            console.log("Quiz pentru:", region.name);
          }
        });

        el.addEventListener("mouseenter", () => {
          setHoveredRegion(region.id);
          el.style.transform = "scale(1.2)";
          el.style.transition = "transform 0.2s ease";
        });

        el.addEventListener("mouseleave", () => {
          setHoveredRegion(null);
          el.style.transform = "scale(1)";
        });
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [mode]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Overlay pentru informații */}
      {selectedRegion && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md">
          <h3 className="text-xl font-bold mb-2">
            {regions3DData.find((r: Region3DData) => r.id === selectedRegion)?.name}
          </h3>
          <p className="text-gray-600">
            {regions3DData.find((r: Region3DData) => r.id === selectedRegion)?.description}
          </p>
        </div>
      )}

      {/* Overlay pentru modul curent */}
      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-2">
          {mode === "explore" && "Mod Explorare"}
          {mode === "quiz" && "Mod Quiz"}
          {mode === "story" && "Mod Poveste"}
        </h3>
        <p className="text-sm text-gray-600">
          {mode === "explore" && "Explorează regiunile României"}
          {mode === "quiz" && "Testează-ți cunoștințele"}
          {mode === "story" && "Descoperă poveștile regiunilor"}
        </p>
      </div>
    </div>
  );
} 