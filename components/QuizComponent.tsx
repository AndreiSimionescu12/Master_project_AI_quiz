"use client";

import { useQuiz } from "@/context/QuizContext";
import { useEffect } from "react";
import VirtualAssistant from "./VirtualAssistant";

export default function QuizComponent() {
  const {
    quiz,
    loading,
    error,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    resetQuiz,
    getScore,
    completeQuiz,
  } = useQuiz();

  // Mutăm useEffect în afara blocurilor condiționale
  // Acest hook trebuie să fie întotdeauna apelat, indiferent de starea aplicației
  useEffect(() => {
    // Folosim o variabilă de referință pentru a verifica dacă am apelat deja completeQuiz
    // Completăm quiz-ul pentru salvare în istoric doar dacă toate întrebările au primit răspuns
    // și doar dacă acest quiz nu a fost deja completat (pentru a evita bucla infinită)
    if (quiz && 
        quiz.questions && 
        quiz.userAnswers.every((answer) => answer !== null) && 
        // Verificăm că nu există deja în istoric un quiz cu exact același id
        !localStorage.getItem('quizCompleted_' + quiz.region + '_' + quiz.subject)) {
      // Marcăm acest quiz ca fiind completat
      localStorage.setItem('quizCompleted_' + quiz.region + '_' + quiz.subject, 'true');
      completeQuiz();
    }
  }, [quiz, completeQuiz]);

  // Afișare loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-xl shadow-lg p-8 border border-slate-100">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-[#002B7F] rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-slate-600 font-medium">Se generează întrebările pentru quiz...</p>
        <p className="text-sm text-slate-400 mt-2">Acest proces poate dura până la 15 secunde</p>
      </div>
    );
  }

  // Afișare eroare
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto border border-slate-100">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg mb-6 border border-red-100">
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h3 className="font-semibold text-lg">A apărut o eroare</h3>
          </div>
          <p className="ml-8">{error}</p>
        </div>
        <button
          onClick={resetQuiz}
          className="w-full py-3 bg-[#002B7F] hover:bg-[#001B50] text-white rounded-lg transition-colors font-medium"
        >
          Încearcă din nou
        </button>
      </div>
    );
  }

  // Dacă nu avem un quiz, nu afișăm nimic
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return null;
  }

  const isCompleted = quiz.userAnswers.every((answer) => answer !== null);
  const currentQuizQuestion = quiz.questions[quiz.currentQuestion];
  const currentUserAnswer = quiz.userAnswers[quiz.currentQuestion];
  const progress = ((quiz.currentQuestion + 1) / quiz.questions.length) * 100;

  // Afișare rezultate dacă toate întrebările au primit răspuns
  if (isCompleted) {
    const score = getScore();
    const percentage = (score / quiz.questions.length) * 100;
    
    return (
      <div className="bg-white rounded-xl shadow-lg max-w-2xl mx-auto border border-slate-100">
        <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-t-xl border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-800">Rezultate Quiz</h2>
            <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-slate-700 shadow-sm border border-slate-200">
              {quiz.subject} - {quiz.region}
            </div>
          </div>
          
          {/* Scor cu progress bar circular */}
          <div className="flex flex-col items-center justify-center mb-6 mt-8">
            <div className="relative">
              <svg className="w-32 h-32" viewBox="0 0 36 36">
                <path
                  className="stroke-current text-blue-100"
                  fill="none"
                  strokeWidth="3"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stroke-current text-[#002B7F]"
                  fill="none"
                  strokeWidth="3"
                  strokeDasharray={`${percentage}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20" textAnchor="middle" className="text-2xl font-bold fill-[#002B7F]">
                  {score}/{quiz.questions.length}
                </text>
              </svg>
            </div>
            <p className="text-xl font-semibold mt-4 text-slate-700">
              {percentage < 50 ? "Mai încearcă!" : percentage < 70 ? "Bine!" : percentage < 90 ? "Foarte bine!" : "Excelent!"}
            </p>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Rezumatul răspunsurilor tale:</h3>
          <div className="space-y-6">
            {quiz.questions.map((question, index) => {
              const isCorrect = quiz.userAnswers[index] === question.correctAnswer;

              return (
                <div
                  key={index}
                  className={`p-5 rounded-lg border ${
                    isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-medium mr-3 mt-0.5 ${isCorrect ? "bg-green-500" : "bg-red-500"}`}>
                      {isCorrect ? "✓" : "✗"}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 mb-3">
                        {question.question}
                      </p>

                      <div className="grid gap-2 mb-3">
                        {["A", "B", "C", "D"].map((option, optIdx) => (
                          <div
                            key={option}
                            className={`px-4 py-2 rounded-md flex items-center ${
                              option === question.correctAnswer
                                ? "bg-green-100 border border-green-200"
                                : option === quiz.userAnswers[index] && !isCorrect
                                ? "bg-red-100 border border-red-200"
                                : "bg-white border border-slate-200"
                            }`}
                          >
                            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 font-medium ${
                              option === question.correctAnswer
                                ? "bg-green-500 text-white"
                                : option === quiz.userAnswers[index] && !isCorrect
                                ? "bg-red-500 text-white"
                                : "bg-slate-200 text-slate-700"
                            }`}>{option}</span>
                            <span className="text-slate-700">{question.options[optIdx]}</span>
                          </div>
                        ))}
                      </div>

                      {!isCorrect && (
                        <div className="mt-4 text-sm bg-white p-4 rounded-md border border-slate-200">
                          <p className="font-medium text-slate-700 mb-1">Explicație:</p>
                          <p className="text-slate-600">{question.explanation}</p>
                        </div>
                      )}
                      
                      {/* Asistent virtual pentru fiecare întrebare */}
                      <VirtualAssistant 
                        question={question.question}
                        correctAnswer={question.correctAnswer}
                        explanation={question.explanation}
                        region={quiz.region}
                        subject={quiz.subject}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-slate-200">
          <button
            onClick={resetQuiz}
            className="w-full py-3 bg-[#002B7F] hover:bg-[#001B50] text-white rounded-lg transition-colors flex items-center justify-center font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Încheie și alege alt județ
          </button>
        </div>
      </div>
    );
  }

  // Afișare întrebare curentă
  return (
    <div className="bg-white rounded-xl shadow-lg max-w-2xl mx-auto border border-slate-100">
      <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-t-xl border-b border-slate-100">
        <div className="flex justify-between items-center">
          <div>
            <div className="bg-white text-[#002B7F] rounded-full px-3 py-1 text-sm font-medium inline-flex shadow-sm border border-blue-100">
              Întrebarea {quiz.currentQuestion + 1}/{quiz.questions.length}
            </div>
            <h2 className="text-xl font-bold mt-3 text-slate-800">
              {quiz.subject} - {quiz.region}
            </h2>
          </div>
          <button
            onClick={resetQuiz}
            className="px-4 py-2 bg-white hover:bg-slate-100 rounded-lg text-sm transition-colors border border-slate-200 font-medium text-slate-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Anulează
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-2 w-full bg-blue-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#002B7F] transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="p-8">
        <p className="text-xl font-medium mb-8 text-slate-800">
          {currentQuizQuestion?.question || "Încărcăm întrebarea..."}
        </p>

        <div className="grid gap-3 mb-6">
          {["A", "B", "C", "D"].map((option, index) => (
            <button
              key={option}
              className={`text-left py-4 px-5 rounded-lg border transition-all ${
                currentUserAnswer === option
                  ? "bg-[#002B7F] text-white border-[#002B7F] shadow-md transform-gpu -translate-y-0.5"
                  : "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
              onClick={() => selectAnswer(quiz.currentQuestion, option)}
            >
              <div className="flex items-center">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3 font-medium ${
                  currentUserAnswer === option
                    ? "bg-white text-[#002B7F]"
                    : "bg-slate-100 text-slate-600"
                }`}>{option}</span>
                <span>{currentQuizQuestion?.options?.[index] || ""}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-slate-200 flex justify-between">
        <button
          className="px-5 py-3 bg-white hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium text-slate-700"
          onClick={previousQuestion}
          disabled={quiz.currentQuestion === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Înapoi
        </button>

        <button
          className="px-5 py-3 bg-[#002B7F] hover:bg-[#001B50] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium"
          onClick={nextQuestion}
          disabled={
            quiz.currentQuestion === quiz.questions.length - 1 || 
            currentUserAnswer === null
          }
        >
          {quiz.currentQuestion === quiz.questions.length - 1
            ? "Finalizează"
            : "Următoarea"}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
} 