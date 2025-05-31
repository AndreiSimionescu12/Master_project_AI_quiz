"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Question = {
  id: string;
  text: string;
  image?: string;
  options?: { id: string; text: string }[];
  type: "multiple_choice" | "text_input" | "essay";
  category: "relief" | "hidrografie" | "climat" | "economie" | "populație";
  points: number;
};

type UserAnswer = {
  questionId: string;
  answerId?: string;
  textAnswer?: string;
};

type TestResult = {
  score: number;
  maxScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  questionAnalysis: {
    questionId: string;
    category: string;
    correct: boolean;
    points: number;
  }[];
};

interface TimedTestProps {
  testId: string;
  testName: string;
  timeLimit: number; // în minute
  questions: Question[];
}

export default function TimedTest({ testId, testName, timeLimit, questions }: TimedTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [remainingTime, setRemainingTime] = useState(timeLimit * 60); // în secunde
  const [isTestActive, setIsTestActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  
  // Inițializare răspunsuri goale
  useEffect(() => {
    if (questions && questions.length > 0 && userAnswers.length === 0) {
      setUserAnswers(
        questions.map((q) => ({
          questionId: q.id,
          answerId: undefined,
          textAnswer: undefined,
        }))
      );
    }
  }, [questions]);

  // Funcție pentru pornirea testului
  const startTest = () => {
    setIsTestActive(true);
  };

  // Efect pentru cronometru
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isTestActive && !isFinished && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = prevTime - 1;
          
          // Verificare terminare timp
          if (newTime <= 0) {
            clearInterval(timer);
            handleTestSubmit();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTestActive, isFinished, remainingTime]);

  // Formatare timp rămas
  const formatRemainingTime = () => {
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Funcție pentru actualizarea răspunsurilor
  const handleAnswerChange = (answerId?: string, textAnswer?: string) => {
    setUserAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      const currentQuestion = questions[currentQuestionIndex];
      
      const answerIndex = newAnswers.findIndex(
        (a) => a.questionId === currentQuestion.id
      );

      if (answerIndex >= 0) {
        if (answerId !== undefined) {
          newAnswers[answerIndex].answerId = answerId;
        }
        
        if (textAnswer !== undefined) {
          newAnswers[answerIndex].textAnswer = textAnswer;
        }
      }

      return newAnswers;
    });
  };

  // Navigare între întrebări
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  // Verificare dacă întrebarea are răspuns
  const isQuestionAnswered = (questionIndex: number) => {
    const answer = userAnswers.find(
      (a) => a.questionId === questions[questionIndex].id
    );
    
    if (answer) {
      if (questions[questionIndex].type === "multiple_choice") {
        return !!answer.answerId;
      } else {
        return !!answer.textAnswer && answer.textAnswer.trim() !== "";
      }
    }
    
    return false;
  };

  // Calcul răspunsuri completate
  const getAnsweredQuestionsCount = () => {
    return userAnswers.filter((answer, index) => {
      const question = questions.find(q => q.id === answer.questionId);
      
      if (!question) return false;
      
      if (question.type === "multiple_choice") {
        return !!answer.answerId;
      } else {
        return !!answer.textAnswer && answer.textAnswer.trim() !== "";
      }
    }).length;
  };

  // Evaluare test
  const evaluateTest = async (): Promise<TestResult> => {
    try {
      // În mod ideal, acest cod ar trimite răspunsurile la un API pentru evaluare
      // Pentru demonstrație, vom simula evaluarea locală
      
      // Simulare evaluare pentru întrebări cu răspuns multiplu
      const questionAnalysis = questions.map((question, index) => {
        const userAnswer = userAnswers.find(a => a.questionId === question.id);
        let isCorrect = false;
        
        if (question.type === "multiple_choice" && userAnswer?.answerId) {
          // În realitate, aici ar trebui să verificați cu răspunsurile corecte
          // Pentru demonstrație, simulăm un răspuns corect cu probabilitate de 70%
          isCorrect = Math.random() < 0.7;
        } else if (question.type === "text_input" && userAnswer?.textAnswer) {
          // Simulăm evaluarea textului
          isCorrect = Math.random() < 0.6;
        } else if (question.type === "essay" && userAnswer?.textAnswer) {
          // Eseurile necesită evaluare manuală, dar putem face verificări de bază
          // cum ar fi prezența cuvintelor cheie sau lungimea minimă
          const wordCount = userAnswer.textAnswer.split(/\s+/).length;
          isCorrect = wordCount > 50;
        }
        
        return {
          questionId: question.id,
          category: question.category,
          correct: isCorrect,
          points: isCorrect ? question.points : 0
        };
      });
      
      // Calculăm scorul
      const score = questionAnalysis.reduce((total, q) => total + q.points, 0);
      const maxScore = questions.reduce((total, q) => total + q.points, 0);
      
      // Identificăm punctele forte și slabe
      const categoryCounts: Record<string, {total: number, correct: number}> = {};
      
      questionAnalysis.forEach(q => {
        if (!categoryCounts[q.category]) {
          categoryCounts[q.category] = {total: 0, correct: 0};
        }
        
        categoryCounts[q.category].total += 1;
        if (q.correct) {
          categoryCounts[q.category].correct += 1;
        }
      });
      
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      
      Object.entries(categoryCounts).forEach(([category, counts]) => {
        const percentage = (counts.correct / counts.total) * 100;
        
        if (percentage >= 70) {
          strengths.push(getDisplayCategory(category));
        } else if (percentage <= 40) {
          weaknesses.push(getDisplayCategory(category));
        }
      });
      
      // Generăm recomandări
      const recommendations: string[] = [];
      
      if (weaknesses.length > 0) {
        recommendations.push(`Concentrează-te pe îmbunătățirea cunoștințelor despre: ${weaknesses.join(", ")}.`);
      }
      
      if (score < maxScore * 0.6) {
        recommendations.push("Recapitulează conceptele de bază din manual și conspectele de curs.");
      }
      
      if (remainingTime === 0) {
        recommendations.push("Lucrează la gestionarea timpului pentru a putea termina toate subiectele.");
      }
      
      return {
        score,
        maxScore,
        strengths,
        weaknesses,
        recommendations,
        questionAnalysis
      };
      
    } catch (error) {
      console.error("Eroare la evaluarea testului:", error);
      
      // Rezultat de eroare
      return {
        score: 0,
        maxScore: questions.reduce((total, q) => total + q.points, 0),
        strengths: [],
        weaknesses: ["Nu am putut evalua testul corect"],
        recommendations: ["Încearcă din nou sau contactează administratorul"],
        questionAnalysis: []
      };
    }
  };

  // Helper pentru afișarea categoriilor în limba română
  const getDisplayCategory = (category: string): string => {
    const categoryMap: Record<string, string> = {
      "relief": "Relief",
      "hidrografie": "Hidrografie",
      "climat": "Climă",
      "economie": "Economie",
      "populație": "Populație"
    };
    
    return categoryMap[category] || category;
  };

  // Trimite testul pentru evaluare
  const handleTestSubmit = async () => {
    setIsFinished(true);
    setIsTestActive(false);
    
    const result = await evaluateTest();
    setTestResult(result);
    
    // Aici s-ar putea salva rezultatul în server
  };

  // Dacă testul nu a început încă
  if (!isTestActive && !isFinished) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{testName}</h2>
        
        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">Instrucțiuni:</h3>
            <ul className="list-disc pl-5 text-blue-700 space-y-1">
              <li>Testul conține {questions.length} întrebări</li>
              <li>Timp alocat: {timeLimit} minute</li>
              <li>Punctaj maxim: {questions.reduce((total, q) => total + q.points, 0)} puncte</li>
              <li>Nu părăsi pagina în timpul testului</li>
              <li>Cronometrul începe automat după ce apeși butonul Start</li>
            </ul>
          </div>
          
          <button
            onClick={startTest}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Începe testul
          </button>
        </div>
        
        <Link
          href="/simulare-bac"
          className="block text-center text-blue-600 hover:text-blue-800"
        >
          Înapoi la lista de teste
        </Link>
      </div>
    );
  }

  // Dacă testul s-a terminat și avem rezultate
  if (isFinished && testResult) {
    const percentage = Math.round((testResult.score / testResult.maxScore) * 100);
    let resultColor = "text-red-600";
    
    if (percentage >= 70) {
      resultColor = "text-green-600";
    } else if (percentage >= 50) {
      resultColor = "text-amber-600";
    }
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Rezultate Test: {testName}</h2>
        
        <div className="mb-6 flex flex-col items-center">
          <div className={`text-5xl font-bold ${resultColor} mb-2`}>
            {testResult.score} / {testResult.maxScore}
          </div>
          <div className={`text-xl font-semibold ${resultColor}`}>
            {percentage}%
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">Puncte Forte:</h3>
            {testResult.strengths.length > 0 ? (
              <ul className="list-disc pl-5 text-green-700">
                {testResult.strengths.map((strength, idx) => (
                  <li key={idx}>{strength}</li>
                ))}
              </ul>
            ) : (
              <p className="text-green-700">Nu au fost identificate puncte forte specifice.</p>
            )}
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h3 className="font-semibold text-red-800 mb-2">De Îmbunătățit:</h3>
            {testResult.weaknesses.length > 0 ? (
              <ul className="list-disc pl-5 text-red-700">
                {testResult.weaknesses.map((weakness, idx) => (
                  <li key={idx}>{weakness}</li>
                ))}
              </ul>
            ) : (
              <p className="text-red-700">Nu au fost identificate zone problematice.</p>
            )}
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="font-semibold text-slate-800 mb-2">Recomandări pentru îmbunătățire:</h3>
          <ul className="list-disc pl-5 text-slate-700 space-y-1">
            {testResult.recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
        
        <div className="flex justify-between">
          <Link
            href="/simulare-bac"
            className="py-2 px-4 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Înapoi la liste teste
          </Link>
          
          <Link
            href={`/simulare-bac/${testId}`}
            className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Încearcă din nou
          </Link>
        </div>
      </div>
    );
  }

  // Afișăm testul activ
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header cu timer și progres */}
      <div className="flex justify-between items-center mb-6 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div className="text-slate-800 font-medium">
          Întrebarea {currentQuestionIndex + 1} din {questions.length}
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-slate-700">{getAnsweredQuestionsCount()} din {questions.length} completate</span>
          </div>
          
          <div className={`font-mono ${remainingTime < 300 ? 'text-red-600 font-bold animate-pulse' : 'text-slate-700'}`}>
            {formatRemainingTime()}
          </div>
        </div>
      </div>
      
      {/* Conținutul întrebării */}
      <div className="mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
          <p className="text-slate-800 font-medium">{questions[currentQuestionIndex]?.text}</p>
          
          {questions[currentQuestionIndex]?.image && (
            <div className="mt-3">
              <img 
                src={questions[currentQuestionIndex].image} 
                alt="Imagine întrebare" 
                className="max-w-full rounded-lg border border-slate-300"
              />
            </div>
          )}
          
          <div className="mt-2 text-sm text-blue-700">
            <span className="font-medium">Categorie:</span> {getDisplayCategory(questions[currentQuestionIndex]?.category)}
            <span className="ml-4 font-medium">Puncte:</span> {questions[currentQuestionIndex]?.points}
          </div>
        </div>
        
        {/* Opțiuni răspuns */}
        <div>
          {questions[currentQuestionIndex]?.type === "multiple_choice" && (
            <div className="space-y-2">
              {questions[currentQuestionIndex]?.options?.map((option) => {
                const userAnswer = userAnswers.find(
                  (a) => a.questionId === questions[currentQuestionIndex].id
                );
                
                const isSelected = userAnswer?.answerId === option.id;
                
                return (
                  <div
                    key={option.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-100 border-blue-300"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                    onClick={() => handleAnswerChange(option.id)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                          isSelected
                            ? "border-blue-500 bg-blue-500"
                            : "border-slate-300"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span>{option.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {questions[currentQuestionIndex]?.type === "text_input" && (
            <div>
              <input
                type="text"
                value={
                  userAnswers.find(
                    (a) => a.questionId === questions[currentQuestionIndex].id
                  )?.textAnswer || ""
                }
                onChange={(e) => handleAnswerChange(undefined, e.target.value)}
                placeholder="Introdu răspunsul tău aici..."
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          
          {questions[currentQuestionIndex]?.type === "essay" && (
            <div>
              <textarea
                value={
                  userAnswers.find(
                    (a) => a.questionId === questions[currentQuestionIndex].id
                  )?.textAnswer || ""
                }
                onChange={(e) => handleAnswerChange(undefined, e.target.value)}
                placeholder="Compune răspunsul tău aici..."
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Navigare prin întrebări */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToQuestion(index)}
              className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                index === currentQuestionIndex
                  ? "bg-blue-600 text-white"
                  : isQuestionAnswered(index)
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="py-2 px-4 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Înapoi
          </button>
          
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={goToNextQuestion}
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Următoarea întrebare
            </button>
          ) : (
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Finalizează testul
            </button>
          )}
        </div>
      </div>
      
      {/* Dialog confirmare trimitere */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Ești sigur că dorești să finalizezi testul?</h3>
            
            <p className="text-slate-600 mb-6">
              Ai răspuns la <span className="font-semibold">{getAnsweredQuestionsCount()} din {questions.length}</span> întrebări.
              {getAnsweredQuestionsCount() < questions.length && " Întrebările fără răspuns vor fi considerate greșite."}
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="py-2 px-4 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Continuă testul
              </button>
              
              <button
                onClick={handleTestSubmit}
                className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Finalizează
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 