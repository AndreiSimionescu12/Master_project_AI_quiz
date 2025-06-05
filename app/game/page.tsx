"use client";

import { useState, useEffect } from 'react';
import EuropeMapGame from '../../components/EuropeMapGame';

export default function GamePage() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header compact */}
      <div className="text-center py-3 px-4 border-b bg-white/80 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          🗺️ Jocul Geografiei Europene
        </h1>
        <p className="text-sm text-gray-600">
          Asociază capitalele, râurile, relieful și faptele UE cu țările corespunzătoare!
        </p>
      </div>
      
      {/* Jocul - ocupă restul ecranului */}
      <div className="flex-1 overflow-hidden px-4 py-3">
        <EuropeMapGame />
      </div>
    </div>
  );
} 