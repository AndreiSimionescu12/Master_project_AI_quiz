import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const county = body.county || body.region || "";
    const subject = body.subject || "";

    console.log("Request primit pentru generare quiz:", { county, subject });

    if (!county || !subject) {
      return NextResponse.json(
        { error: "Este necesară specificarea regiunii și subiectului" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Configurare API incompletă" },
        { status: 500 }
      );
    }

    const prompt = `
      Creează 5 întrebări de examen tip grilă pentru Bacalaureat la ${subject} despre ${county}.
      Fiecare întrebare trebuie să respecte EXACT acest format:

      Q1. [Întrebare]
      A) [Opțiune A]
      B) [Opțiune B]
      C) [Opțiune C]
      D) [Opțiune D]
      Correct: [A/B/C/D]
      Explanation: [Explicație]

      INSTRUCȚIUNI SPECIALE:
      - Pentru întrebările formulate negativ (care conțin "NU" sau "nu este"), asigură-te că explicația clarifică:
        1. De ce răspunsul corect NU este caracteristic regiunii
        2. De ce celelalte opțiuni SUNT caracteristice regiunii
      - Folosește exemple concrete în explicații
      - Evită ambiguitatea în formularea întrebărilor negative

      Concentrează-te pe: ${
        subject.toLowerCase().includes("geograf")
          ? "relief, hidrografie, climă, populație, resurse naturale"
          : "evenimente istorice, personalități, monumente, tradiții"
      }
    `;

    console.log("Se trimite cerere către Google AI...");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            topP: 0.8,
            topK: 40
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Răspuns negativ de la Google AI:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      return NextResponse.json(
        { 
          error: "Serviciul de generare întrebări nu este disponibil momentan",
          details: errorText
        },
        { status: 503 }
      );
    }

    const data = await response.json();
    console.log("Răspuns primit de la Google AI:", {
      status: "success",
      hasContent: !!data?.candidates?.[0]?.content
    });

    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("Răspuns invalid de la Google AI:", JSON.stringify(data));
      return NextResponse.json(
        { 
          error: "Răspuns invalid de la serviciul AI",
          details: JSON.stringify(data)
        },
        { status: 500 }
      );
    }

    const text = data.candidates[0].content.parts[0].text;
    const questions = parseQuizQuestions(text);

    if (questions.length === 0) {
      console.error("Nu s-au putut extrage întrebări din răspuns:", text.substring(0, 200));
      return NextResponse.json(
        { 
          error: "Nu s-au putut genera întrebări valide",
          details: text.substring(0, 200)
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("Eroare server:", error);
    return NextResponse.json(
      { 
        error: "Eroare internă la generarea întrebărilor",
        details: error.message
      },
      { status: 500 }
    );
  }
}

function parseQuizQuestions(text: string) {
  const questions = [];
  const questionRegex = /Q\d+\.\s*(.*?)\s*A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*?)\s*D\)\s*(.*?)\s*Correct:\s*([A-D])\s*Explanation:\s*(.*?)(?=(?:\n\s*Q\d+\.|\s*$))/g;
  
  let match;
  while ((match = questionRegex.exec(text)) !== null) {
    const [_, question, optionA, optionB, optionC, optionD, correct, explanation] = match;
    
    if (question && optionA && optionB && optionC && optionD && correct && explanation) {
      questions.push({
        question: question.trim(),
        options: [
          optionA.trim(),
          optionB.trim(),
          optionC.trim(),
          optionD.trim()
        ],
        correctAnswer: correct.trim(),
        explanation: explanation.trim()
      });
    }
  }
  
  return questions;
} 