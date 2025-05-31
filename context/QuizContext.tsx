"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Tipuri pentru quiz
export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type Quiz = {
  region: string;
  subject: string;
  questions: QuizQuestion[];
  userAnswers: (string | null)[];
  currentQuestion: number;
};

// Tip pentru istoricul quizurilor completate
export type QuizHistoryItem = {
  id: string;
  date: string;
  region: string;
  subject: string;
  score: number;
  totalQuestions: number;
  percentageScore: number;
};

// Tipul pentru contextul quizului
type QuizContextType = {
  quiz: Quiz | null;
  loading: boolean;
  error: string | null;
  quizHistory: QuizHistoryItem[];
  setQuiz: (quiz: Quiz) => void;
  selectAnswer: (questionIndex: number, answer: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  resetQuiz: () => void;
  completeQuiz: () => void;
  generateQuiz: (region: string, subject: string) => Promise<void>;
  getScore: () => number;
  clearHistory: () => void;
};

// Creăm contextul
const QuizContext = createContext<QuizContextType | null>(null);

// Hook pentru utilizarea contextului
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === null) {
    throw new Error("useQuiz trebuie utilizat în interiorul unui QuizProvider");
  }
  return context;
};

// Provider-ul contextului
export function QuizProvider({ children }: { children: ReactNode }) {
  const [quiz, setQuizState] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);

  // Restaurăm starea din localStorage la încărcare
  useEffect(() => {
    try {
      // Restaurare progres quiz
      const savedQuiz = localStorage.getItem("quizProgress");
      if (savedQuiz) {
        setQuizState(JSON.parse(savedQuiz));
      }
      
      // Restaurare istoric quizuri
      const savedHistory = localStorage.getItem("quizHistory");
      if (savedHistory) {
        setQuizHistory(JSON.parse(savedHistory));
      }
    } catch (err) {
      console.error("Eroare la încărcarea datelor salvate:", err);
    }
  }, []);

  // Salvăm starea în localStorage la modificare
  useEffect(() => {
    if (quiz) {
      localStorage.setItem("quizProgress", JSON.stringify(quiz));
    }
  }, [quiz]);
  
  // Salvăm istoricul în localStorage la modificare
  useEffect(() => {
    localStorage.setItem("quizHistory", JSON.stringify(quizHistory));
  }, [quizHistory]);

  // Funcții pentru manipularea stării quizului
  const setQuiz = (newQuiz: Quiz) => {
    setQuizState(newQuiz);
  };

  const selectAnswer = (questionIndex: number, answer: string) => {
    if (!quiz) return;

    const newUserAnswers = [...quiz.userAnswers];
    newUserAnswers[questionIndex] = answer;

    setQuizState({
      ...quiz,
      userAnswers: newUserAnswers,
    });
  };

  const nextQuestion = () => {
    if (!quiz) return;

    if (quiz.currentQuestion < quiz.questions.length - 1) {
      setQuizState({
        ...quiz,
        currentQuestion: quiz.currentQuestion + 1,
      });
    }
  };

  const previousQuestion = () => {
    if (!quiz) return;

    if (quiz.currentQuestion > 0) {
      setQuizState({
        ...quiz,
        currentQuestion: quiz.currentQuestion - 1,
      });
    }
  };

  const resetQuiz = () => {
    // Înainte de a șterge quiz-ul, curățăm și marcajul de quiz completat
    if (quiz) {
      localStorage.removeItem(`quizCompleted_${quiz.region}_${quiz.subject}`);
    }
    
    setQuizState(null);
    localStorage.removeItem("quizProgress");
  };
  
  const completeQuiz = () => {
    if (!quiz) return;
    
    const score = getScore();
    const percentageScore = (score / quiz.questions.length) * 100;
    
    // Adăugăm quizul completat în istoric
    const historyItem: QuizHistoryItem = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      region: quiz.region,
      subject: quiz.subject,
      score: score,
      totalQuestions: quiz.questions.length,
      percentageScore: percentageScore,
    };
    
    setQuizHistory(prevHistory => [historyItem, ...prevHistory.slice(0, 19)]);
  };
  
  const clearHistory = () => {
    setQuizHistory([]);
    localStorage.removeItem("quizHistory");
  };

  const getScore = () => {
    if (!quiz) return 0;

    let totalScore = 0;
    quiz.userAnswers.forEach((userAnswer, index) => {
      if (!userAnswer) return;

      const question = quiz.questions[index];
      
      // Găsim indexul răspunsului corect (A=0, B=1, C=2, D=3)
      let correctIndex = 0;
      if (question.correctAnswer === "B") correctIndex = 1;
      if (question.correctAnswer === "C") correctIndex = 2;
      if (question.correctAnswer === "D") correctIndex = 3;

      // Răspunsul corect este opțiunea de la indexul corect
      const correctAnswer = question.options[correctIndex];

      // Verificăm dacă răspunsul utilizatorului este corect
      if (userAnswer === correctAnswer) {
        totalScore++;
      }
    });

    return totalScore;
  };

  // Parsarea răspunsului de la API
  const parseQuizResponse = (response: any): QuizQuestion[] => {
    try {
      console.log("Începe parsarea răspunsului:", typeof response);
      
      // Verificăm structura răspunsului și extragem conținutul textului
      let responseText = "";
      
      if (response.content) {
        // Format direct
        responseText = response.content;
        console.log("Conținut găsit direct în response.content");
      } else if (response.choices && response.choices.length > 0) {
        // Format OpenAI/compatibil
        responseText = response.choices[0]?.message?.content || "";
        console.log("Conținut găsit în format OpenAI");
      } else if (response.candidates && response.candidates.length > 0) {
        // Format Gemini
        responseText = response.candidates[0]?.content?.parts?.[0]?.text || "";
        console.log("Conținut găsit în format Gemini");
      }
      
      if (!responseText) {
        console.error("Format de răspuns nerecunoscut:", JSON.stringify(response).substring(0, 200));
        throw new Error("Nu am putut extrage conținutul din răspunsul API");
      }
      
      console.log("Text extras pentru parsare, lungime:", responseText.length);
      console.log("Primele 100 caractere:", responseText.substring(0, 100));

      // Căutăm întrebările în formatul nostru
      const questions: QuizQuestion[] = [];
      // Modificăm regex-ul pentru a fi mai flexibil și a gestiona mai multe formate
      const qRegex = /Q\d+\.?\s+([\s\S]+?)\s+A\)\s+([\s\S]+?)\s+B\)\s+([\s\S]+?)\s+C\)\s+([\s\S]+?)\s+D\)\s+([\s\S]+?)\s+Correct:?\s+([A-D])\s+Explanation:?\s+([\s\S]+?)(?=\s*(?:Q\d+\.?|$))/g;

      let match;
      let count = 0;
      while ((match = qRegex.exec(responseText)) !== null) {
        count++;
        console.log(`Întrebarea #${count} găsită`);
        
        const [, question, optionA, optionB, optionC, optionD, correct, explanation] = match;
        
        // Verificăm că toate câmpurile au fost extrase corect
        if (!question || !optionA || !optionB || !optionC || !optionD || !correct || !explanation) {
          console.warn(`Întrebare #${count} incompletă detectată, se continuă cu următoarea`);
          continue;
        }
        
        // Mapăm litera răspunsului corect la textul opțiunii
        let correctAnswer = "";
        switch (correct.trim()) {
          case "A":
            correctAnswer = optionA.trim();
            break;
          case "B":
            correctAnswer = optionB.trim();
            break;
          case "C":
            correctAnswer = optionC.trim();
            break;
          case "D":
            correctAnswer = optionD.trim();
            break;
          default:
            console.warn(`Litera răspunsului corect nevalidă: ${correct}`);
            correctAnswer = optionA.trim(); // Folosim prima opțiune ca default
        }

        questions.push({
          question: question.trim(),
          options: [
            optionA.trim(),
            optionB.trim(),
            optionC.trim(),
            optionD.trim(),
          ],
          correctAnswer,
          explanation: explanation.trim(),
        });
      }
      
      console.log(`Total întrebări găsite: ${questions.length}`);
      
      if (questions.length === 0) {
        console.error("Nu s-au găsit întrebări în formatul așteptat. Răspuns primit:", responseText);
        throw new Error("Nu am putut extrage întrebările din răspunsul primit.");
      }
      
      return questions;
    } catch (error) {
      console.error("Eroare la parsarea răspunsului:", error);
      throw new Error("Nu am putut procesa răspunsul de la AI");
    }
  };

  // Generare quiz prin API
  const generateQuiz = async (region: string, subject: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Generare quiz pentru:", { region, subject });
      
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          county: region,
          subject: subject
        }),
      });

      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        console.error("Eroare la parsarea răspunsului JSON:", e);
        throw new Error("Răspuns invalid de la server");
      }

      if (!response.ok) {
        console.error("Eroare de la API:", errorData);
        throw new Error(
          errorData.error || 
          errorData.details || 
          "Nu s-au putut genera întrebările. Vă rugăm încercați din nou."
        );
      }

      if (!errorData || !Array.isArray(errorData.questions) || errorData.questions.length === 0) {
        console.error("Date invalide primite:", errorData);
        throw new Error("Formatul răspunsului de la API este invalid");
      }

      // Validăm fiecare întrebare
      const validQuestions = errorData.questions.filter((q: any) => {
        return q.question && 
               Array.isArray(q.options) && 
               q.options.length === 4 &&
               q.correctAnswer &&
               q.explanation;
      });

      if (validQuestions.length === 0) {
        throw new Error("Nu s-au putut genera întrebări valide");
      }

      setQuiz({
        region,
        subject,
        questions: validQuestions,
        userAnswers: Array(validQuestions.length).fill(null),
        currentQuestion: 0,
      });

    } catch (err: any) {
      console.error("Eroare la generarea quizului:", err);
      setError(err.message || "A apărut o eroare la generarea quizului");
    } finally {
      setLoading(false);
    }
  };

  // Valoarea contextului
  const value = {
    quiz,
    loading,
    error,
    quizHistory,
    setQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    resetQuiz,
    completeQuiz,
    generateQuiz,
    getScore,
    clearHistory,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
} 