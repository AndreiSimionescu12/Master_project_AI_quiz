"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";

export default function QuizPage() {
  const { 
    quiz, 
    loading, 
    error,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    completeQuiz
  } = useQuiz();
  const router = useRouter();

  useEffect(() => {
    if (!quiz && !loading) {
      // Dacă nu există quiz și nu se încarcă, redirecționăm înapoi
      router.push("/");
    }
  }, [quiz, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 text-lg font-semibold mb-2">Eroare</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Înapoi la hartă
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Nu există quiz activ
          </h2>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Înapoi la hartă
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quiz: {quiz.subject}
              </h1>
              <p className="text-gray-600">Regiunea: {quiz.region}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Întrebarea {quiz.currentQuestion + 1} din {quiz.questions.length}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl text-blue-900 font-medium mb-4">
                {quiz.questions[quiz.currentQuestion].question}
              </h2>
              <div className="space-y-3">
                {quiz.questions[quiz.currentQuestion].options.map(
                  (option, index) => {
                    const isSelected =
                      quiz.userAnswers[quiz.currentQuestion] === option;
                    return (
                      <button
                        key={index}
                        onClick={() => selectAnswer(quiz.currentQuestion, option)}
                        className={`w-full text-left p-4 rounded-lg transition-colors ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-white hover:bg-blue-50 text-gray-700"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={previousQuestion}
                disabled={quiz.currentQuestion === 0}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Anterior
              </button>
              {quiz.currentQuestion < quiz.questions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Următoarea
                </button>
              ) : (
                <button
                  onClick={() => {
                    completeQuiz();
                    router.push("/results");
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Finalizează
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 