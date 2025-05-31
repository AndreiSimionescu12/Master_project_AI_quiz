"use client";

import { useQuiz } from "@/context/QuizContext";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { useState } from "react";

export default function QuizHistory() {
  const { quizHistory, clearHistory } = useQuiz();
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Funcție pentru formatarea datei
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "d MMMM yyyy, HH:mm", { locale: ro });
    } catch (error) {
      return "Data necunoscută";
    }
  };

  // Funcție pentru obținerea clasei de culoare în funcție de scor
  const getScoreColorClass = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  if (quizHistory.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Nu ai istoricul quizurilor</h2>
          <p className="text-slate-500 mb-6">Completează quiz-uri pentru a vedea istoricul tău aici.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Istoricul quiz-urilor</h2>
        <button
          onClick={() => setShowConfirmation(true)}
          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Șterge istoricul
        </button>
      </div>

      <div className="space-y-4">
        {quizHistory.map((item) => (
          <div key={item.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg text-slate-800">{item.subject} - {item.region}</h3>
                <p className="text-slate-500 text-sm">{formatDate(item.date)}</p>
              </div>
              <div className={`font-bold text-lg ${getScoreColorClass(item.percentageScore)}`}>
                {item.score}/{item.totalQuestions}
                <span className="block text-xs text-right font-normal">
                  {Math.round(item.percentageScore)}%
                </span>
              </div>
            </div>
            
            <div className="mt-3 w-full bg-slate-100 rounded-full h-2">
              <div 
                className={`h-full rounded-full ${
                  item.percentageScore >= 90 ? "bg-green-500" :
                  item.percentageScore >= 70 ? "bg-blue-500" :
                  item.percentageScore >= 50 ? "bg-yellow-500" :
                  "bg-red-500"
                }`}
                style={{ width: `${item.percentageScore}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Dialog de confirmare pentru ștergerea istoricului */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Confirmă ștergerea</h3>
            <p className="text-slate-600 mb-6">
              Ești sigur că dorești să ștergi tot istoricul quizurilor? Această acțiune nu poate fi anulată.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg"
              >
                Anulează
              </button>
              <button 
                onClick={() => {
                  clearHistory();
                  setShowConfirmation(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Șterge istoricul
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 