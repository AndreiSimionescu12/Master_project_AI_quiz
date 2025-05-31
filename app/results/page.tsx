"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";

export default function ResultsPage() {
  const { quiz, getScore, resetQuiz, completeQuiz } = useQuiz();
  const router = useRouter();
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{[key: number]: {role: string, content: string}[]}>({});

  useEffect(() => {
    if (!quiz) {
      router.push("/");
    }
  }, [quiz, router]);

  if (!quiz) {
    return null;
  }

  const score = getScore();
  const totalQuestions = quiz.questions.length;
  const percentageScore = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    if (!quiz) return;
    
    // Actualizăm scorul când se schimbă răspunsurile
    const newScore = getScore();
    if (newScore !== score) {
      completeQuiz(); // Actualizăm istoricul cu noul scor
    }
  }, [quiz, quiz?.userAnswers, getScore, score, completeQuiz]);

  const handleChatSubmit = async (questionIndex: number) => {
    if (!quiz) return;
    
    if (!chatMessage.trim()) return;

    const question = quiz.questions[questionIndex];
    const newMessage = { role: "user", content: chatMessage };
    
    setChatHistory(prev => ({
      ...prev,
      [questionIndex]: [...(prev[questionIndex] || []), newMessage]
    }));
    setChatMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: chatMessage,
          context: {
            question: question.question,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            subject: quiz.subject,
            region: quiz.region
          }
        })
      });

      const data = await response.json();
      
      setChatHistory(prev => ({
        ...prev,
        [questionIndex]: [...(prev[questionIndex] || []), { role: "assistant", content: data.response }]
      }));
    } catch (error) {
      console.error("Eroare la trimiterea mesajului:", error);
    }
  };

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
              <div className={`text-2xl font-bold ${percentageScore >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                {score} / {totalQuestions}
              </div>
              <p className="text-sm text-gray-500">
                Scor: {percentageScore}%
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {quiz.questions.map((question, index) => {
              const userAnswer = quiz.userAnswers[index] || '';
              
              // Găsim indexul răspunsului corect (A=0, B=1, C=2, D=3)
              let correctIndex = 0;
              if (question.correctAnswer === "B") correctIndex = 1;
              if (question.correctAnswer === "C") correctIndex = 2;
              if (question.correctAnswer === "D") correctIndex = 3;
              
              // Răspunsul corect este opțiunea de la indexul corect
              const correctAnswer = question.options[correctIndex];
              
              // Verificăm dacă răspunsul utilizatorului este corect
              const isCorrect = userAnswer === correctAnswer;

              return (
                <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isCorrect ? "bg-green-500" : "bg-red-500"
                      }`}>
                        <span className="text-white font-medium">{index + 1}</span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          {question.question}
                        </h3>
                        <div className="space-y-2 mb-4">
                          {question.options.map((option, optionIndex) => {
                            const isUserAnswer = option === userAnswer;
                            const isCorrectAnswer = optionIndex === correctIndex;
                            
                            let optionClass = "bg-white border-gray-200";
                            let statusText = "";
                            
                            if (isCorrectAnswer && isUserAnswer) {
                              optionClass = "bg-green-50 border-green-500";
                              statusText = "Răspunsul tău (corect)";
                            } else if (isCorrectAnswer) {
                              optionClass = "bg-green-50 border-green-500";
                              statusText = "Răspunsul corect";
                            } else if (isUserAnswer) {
                              optionClass = "bg-red-50 border-red-500";
                              statusText = "Răspunsul tău (incorect)";
                            }
                            
                            return (
                              <div
                                key={optionIndex}
                                className={`p-4 rounded-lg border-2 ${optionClass}`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {isCorrectAnswer && isUserAnswer && (
                                      <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    )}
                                    {isUserAnswer && !isCorrectAnswer && (
                                      <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    )}
                                    {isCorrectAnswer && !isUserAnswer && (
                                      <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    )}
                                    <span className={`text-lg ${
                                      isCorrectAnswer 
                                        ? "font-semibold text-green-700" 
                                        : isUserAnswer 
                                        ? "text-red-700" 
                                        : "text-gray-700"
                                    }`}>
                                      {option}
                                    </span>
                                  </div>
                                  {statusText && (
                                    <span className={`text-sm font-medium ${
                                      isCorrectAnswer && isUserAnswer 
                                        ? "text-green-600" 
                                        : isCorrectAnswer 
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}>
                                      {statusText}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="space-y-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">Explicație:</h4>
                            <p className="text-blue-700">{question.explanation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    {activeChat === index ? (
                      <div className="space-y-4">
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {chatHistory[index]?.map((msg, msgIndex) => (
                            <div
                              key={msgIndex}
                              className={`p-3 rounded-lg ${
                                msg.role === "user" 
                                  ? "bg-blue-100 ml-8" 
                                  : "bg-gray-100 mr-8"
                              }`}
                            >
                              {msg.content}
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder="Întreabă ceva despre această întrebare..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleChatSubmit(index);
                              }
                            }}
                          />
                          <button
                            onClick={() => handleChatSubmit(index)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Trimite
                          </button>
                          <button
                            onClick={() => setActiveChat(null)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                          >
                            Închide
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveChat(index)}
                        className="w-full px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center justify-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Întreabă despre această întrebare
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => {
                resetQuiz();
                router.push("/");
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Înapoi la hartă
            </button>
            <button
              onClick={() => {
                resetQuiz();
                router.push(`/?region=${quiz.region}`);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Încearcă din nou
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 