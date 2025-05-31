"use client";

import { useState, useRef, useEffect } from "react";

// Tip pentru mesaje 
type Message = {
  role: "user" | "assistant";
  content: string;
};

type VirtualAssistantProps = {
  question: string;
  correctAnswer: string;
  explanation: string;
  region: string;
  subject: string;
};

export default function VirtualAssistant({
  question,
  correctAnswer,
  explanation,
  region,
  subject,
}: VirtualAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll la ultimul mesaj
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Inițializăm asistentul cu un mesaj de întâmpinare
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `Bună! Sunt asistentul tău virtual AI pentru întrebarea despre ${subject} legată de ${region}. Pot să te ajut să înțelegi mai bine acest subiect sau să-ți ofer informații suplimentare. Ce dorești să știi?`
        },
      ]);
    }
  }, [isOpen, messages.length, region, subject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    setErrorMessage(null);
    
    // Adăugăm mesajul utilizatorului
    const userMessage: Message = {
      role: "user",
      content: inputValue,
    };
    
    // Actualizăm starea cu mesajul utilizatorului
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      // Construim contextul pentru API
      const contextInfo = `Întrebare: ${question}\nRăspuns corect: ${correctAnswer}\nExplicație: ${explanation}\nRegiune: ${region}\nSuiect: ${subject}`;
      
      // Folosim ultimele 10 mesaje pentru context (dacă există)
      const recentMessages = messages.slice(-10);
      
      console.log("Trimit cerere către API cu:", {
        question,
        context: contextInfo,
        query: inputValue,
        history: recentMessages
      });
      
      // Apelăm API-ul pentru a obține un răspuns
      const response = await fetch("/api/virtual-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          context: contextInfo,
          query: inputValue,
          history: recentMessages
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Eroare API: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      console.log("Răspuns de la API:", data);
      
      // Verificăm dacă există o eroare în răspuns
      if (data.error) {
        console.warn("Avertisment de la API:", data.error);
        throw new Error(data.error);
      }
      
      // Adăugăm răspunsul la conversație
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response || "Nu am putut genera un răspuns. Te rog să încerci din nou." },
      ]);
    } catch (error) {
      console.error("Eroare la generarea răspunsului:", error);
      
      // Afișăm mesaj de eroare pentru utilizator
      const errorMsg = error instanceof Error ? error.message : "A apărut o eroare în comunicarea cu asistentul virtual";
      setErrorMessage(errorMsg);
      
      // Adăugăm un mesaj de eroare în conversație
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Îmi pare rău, am întâmpinat o problemă în procesarea cererii tale. Te rog să încerci din nou.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="mt-3 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm flex items-center transition-colors border border-blue-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Întreabă asistentul virtual AI
      </button>
    );
  }

  return (
    <div className="mt-4 bg-white rounded-lg border border-blue-200 shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="font-medium">Asistent Virtual AI - {subject}</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-blue-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="h-64 overflow-y-auto px-4 py-3 bg-gray-50" ref={chatContainerRef}>
        {errorMessage && (
          <div className="mb-3 mx-auto max-w-[90%]">
            <div className="rounded-lg px-3 py-2 bg-red-50 border border-red-200 text-red-700 text-xs">
              <p>{errorMessage}</p>
            </div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-3 ${
              message.role === "assistant"
                ? "pr-10"
                : "pl-10"
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 inline-block max-w-[85%] ${
                message.role === "assistant"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-white border border-gray-200 text-gray-800 ml-auto"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="mb-3 pr-10">
            <div className="rounded-lg px-4 py-2 inline-block bg-blue-100 text-blue-800">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Scrie un mesaj..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 disabled:opacity-50"
            disabled={isLoading || !inputValue.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
} 