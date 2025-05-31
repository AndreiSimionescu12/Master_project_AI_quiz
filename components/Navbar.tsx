"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuiz } from "@/context/QuizContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { resetQuiz } = useQuiz();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/"
              className="flex-shrink-0 flex items-center"
              onClick={resetQuiz}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex items-center justify-center bg-gradient-to-r from-[#002B7F] via-[#FCD116] to-[#CE1126]">
                <span className="text-white font-bold text-lg drop-shadow-sm">RQ</span>
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">România Quiz AI</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="border-blue-600 text-slate-800 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                onClick={resetQuiz}
              >
                Acasă
              </Link>
              <Link
                href="/comparator"
                className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Comparator Regiuni
              </Link>
              <Link
                href="/explorare-interactiva"
                className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Explorare Interactivă
              </Link>
              <Link
                href="/tur-relief"
                className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Tur Interactiv Relief
              </Link>
              <Link
                href="#"
                className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                onClick={(e) => e.preventDefault()}
              >
                Despre Proiect
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="bg-gradient-to-r from-[#002B7F] via-[#FCD116] to-[#CE1126] text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
              Pregătire BAC
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Deschide meniul principal</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="bg-blue-50 border-l-4 border-blue-600 text-blue-700 block pl-3 pr-4 py-2 text-base font-medium"
              onClick={() => { resetQuiz(); setIsMenuOpen(false); }}
            >
              Acasă
            </Link>
            <Link
              href="/comparator"
              className="border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Comparator Regiuni
            </Link>
            <Link
              href="/explorare-interactiva"
              className="border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Explorare Interactivă
            </Link>
            <Link
              href="/tur-relief"
              className="border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Tur Interactiv Relief
            </Link>
            <Link
              href="#"
              className="border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); }}
            >
              Despre Proiect
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-slate-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-r from-[#002B7F] via-[#FCD116] to-[#CE1126] text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                  Pregătire BAC
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banda decorativă cu culorile României */}
      <div className="h-1 w-full flex">
        <div className="w-1/3 bg-[#002B7F]"></div>
        <div className="w-1/3 bg-[#FCD116]"></div>
        <div className="w-1/3 bg-[#CE1126]"></div>
      </div>
    </nav>
  );
} 