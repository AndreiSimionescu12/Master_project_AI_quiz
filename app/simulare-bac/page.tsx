"use client";

import { useState } from "react";
import Link from "next/link";

export default function SimulareBacPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-center text-[#002B7F] mb-3">
          Simulare Bacalaureat Geografie
        </h1>
        <p className="text-center text-slate-600 mb-8">
          Testează-ți cunoștințele cu simulări complete de Bacalaureat la geografie.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Simulare Completă</h2>
          <p className="text-slate-600 mb-4">
            Test complet similar cu proba de Bacalaureat la geografie, cu toate tipurile de subiecte și timp limitat.
          </p>
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-slate-700">180 minute</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-slate-700">90 puncte</span>
            </div>
          </div>
          <Link 
            href="/simulare-bac/test-complet"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Începe simularea
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Test Rapid - Harta României</h2>
          <p className="text-slate-600 mb-4">
            Test focalizat pe recunoașterea și analizarea elementelor geografice de pe harta României.
          </p>
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-slate-700">45 minute</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-slate-700">30 puncte</span>
            </div>
          </div>
          <Link 
            href="/simulare-bac/test-harta"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Începe testul rapid
          </Link>
        </div>
      </div>

      <div className="mt-8 max-w-4xl mx-auto">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-800 mb-3">Cum funcționează?</h2>
          <ol className="list-decimal pl-5 space-y-2 text-blue-800">
            <li>Alege tipul de simulare dorit</li>
            <li>Cronometrul va porni automat la începerea testului</li>
            <li>Răspunde la toate întrebările în timpul alocat</li>
            <li>Primește evaluarea detaliată și punctajul imediat după finalizare</li>
            <li>Analizează zonele tale de dificultate și recomandările personalizate</li>
            <li>Consultă istoricul simulărilor pentru a-ți monitoriza progresul</li>
          </ol>
        </div>
      </div>
    </main>
  );
} 