import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json();

    // Verificăm dacă cheia API Google AI Studio este configurată
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Cheia API Google AI nu este configurată pe server" },
        { status: 500 }
      );
    }

    try {
      const prompt = `
        Ești un asistent virtual educațional pentru elevi care se pregătesc pentru Bacalaureat în România.
        Rolul tău este să ajuți elevii să înțeleagă mai bine materia legată de geografie, folosind un ton prietenos și încurajator.
        
        Context despre întrebarea din quiz:
        Întrebarea: "${context.question}"
        Răspunsul corect: "${context.correctAnswer}"
        Explicația oficială: "${context.explanation}"
        Subiectul: ${context.subject}
        Regiunea: ${context.region}
        
        INSTRUCȚIUNI SPECIALE:
        - Dacă întrebarea este formulată negativ (conține "NU" sau "nu este"), explică explicit că se caută ce NU este caracteristic/specific.
        - Pentru întrebări negative, explică de ce răspunsul corect NU este caracteristic, în timp ce celelalte opțiuni SUNT caracteristice.
        - Folosește exemple concrete pentru a ilustra diferențele.
        
        Întrebarea elevului: ${message}
        
        Răspunde în limba română, oferind informații precise și educative. Menține răspunsul concis dar informativ.
        Folosește exemple concrete și explicații clare pentru a ajuta elevul să înțeleagă mai bine.
      `;

      // Trimitem cererea către API-ul Google AI (Gemini)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1024,
              topP: 0.8,
              topK: 40,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Eroare necunoscută" }));
        console.error("Eroare Google AI:", error);
        throw new Error("Eroare la comunicarea cu serviciul AI");
      }

      const data = await response.json();

      // Verificăm dacă răspunsul conține datele necesare
      if (!data || !data.candidates || !data.candidates[0]?.content?.parts) {
        console.error("Răspuns Gemini incomplet:", data);
        throw new Error("Răspuns incomplet de la serviciul AI");
      }

      const textContent = data.candidates[0].content.parts[0]?.text || "";
      if (!textContent) {
        console.error("Conținut text lipsă în răspunsul Gemini");
        throw new Error("Conținut lipsă în răspunsul primit");
      }

      return NextResponse.json({ response: textContent });
    } catch (aiError) {
      console.error("Eroare în comunicarea cu Gemini API:", aiError);
      return NextResponse.json(
        { error: "Nu am putut procesa întrebarea ta în acest moment. Te rog încearcă din nou." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Eroare server chat:", error);
    return NextResponse.json(
      { error: "Eroare internă de server" },
      { status: 500 }
    );
  }
} 