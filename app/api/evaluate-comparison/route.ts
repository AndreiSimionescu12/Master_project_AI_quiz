import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { region1, region1Data, region1Notes, region2, region2Data, region2Notes } = await request.json();

    if (!region1 || !region1Notes || !region2 || !region2Notes) {
      return NextResponse.json(
        {
          error: "Este necesară specificarea regiunilor și observațiilor",
        },
        { status: 400 }
      );
    }

    // Verificăm dacă cheia API Google AI Studio este configurată
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Cheia API Google AI nu este configurată pe server" },
        { status: 500 }
      );
    }

    try {
      // Construim un prompt structurat pentru Gemini
      let prompt = `
        Ești un expert în geografia României specializat în educație pentru Bacalaureat.
        Evaluează comparația făcută de elev între două regiuni geografice din România.
        
        REGIUNEA 1: ${region1}
        Date despre ${region1}: ${JSON.stringify(region1Data)}
        Observațiile elevului despre ${region1}: "${region1Notes}"
        
        REGIUNEA 2: ${region2}
        Date despre ${region2}: ${JSON.stringify(region2Data)}
        Observațiile elevului despre ${region2}: "${region2Notes}"
        
        Te rog să evaluezi:
        1. Corectitudinea informațiilor oferite pentru fiecare regiune
        2. Dacă elevul a menționat elementele geografice importante pentru fiecare regiune
        3. Calitatea comparației între cele două regiuni
        4. Ce elemente lipsesc sau ar putea fi îmbunătățite
        
        Oferă feedback constructiv, subliniind atât punctele forte cât și aspectele care necesită îmbunătățiri.
        Oferă și 2-3 exemple concrete de cum ar trebui făcută o comparație eficientă între aceste regiuni.
        
        Structurează răspunsul în secțiuni clare, folosind un ton încurajator și educativ.
        Răspunde în limba română.
      `;

      // Trimitem cererea către API-ul Google AI (Gemini)
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
            topP: 0.8,
            topK: 40
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Eroare necunoscută" }));
        console.error("Eroare Google AI:", error);
        throw new Error("Eroare la comunicarea cu serviciul AI");
      }

      const data = await response.json().catch(err => {
        console.error("Eroare la parsarea răspunsului:", err);
        throw new Error("Eroare la procesarea răspunsului de la API");
      });
      
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

      // Returnăm evaluarea
      return NextResponse.json({
        isCorrect: true, // Default true, deoarece orice feedback este valoros
        message: "Evaluare completă a comparației:",
        feedback: textContent,
        corrections: [] // Format compatibil cu implementarea anterioară
      });
      
    } catch (aiError) {
      console.error("Eroare în comunicarea cu Gemini API:", aiError);
      
      // Răspuns simplificat în caz de eroare
      return NextResponse.json({
        isCorrect: false,
        message: "Nu am putut evalua comparația ta în acest moment.",
        feedback: "Te rugăm să verifici că ai inclus informații relevante despre relief, râuri și alte caracteristici geografice importante pentru ambele regiuni.",
        corrections: [
          { 
            field: "general", 
            correction: "Asigură-te că menționezi caracteristicile definitorii ale fiecărei regiuni și faci comparații directe între acestea."
          }
        ]
      }, { status: 200 });
    }
    
  } catch (error: unknown) {
    console.error("Eroare server evaluare comparație:", error);
    
    return NextResponse.json(
      { error: "Eroare internă de server" },
      { status: 500 }
    );
  }
} 