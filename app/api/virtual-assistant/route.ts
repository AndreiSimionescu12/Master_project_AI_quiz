import { NextResponse } from "next/server";

// Tip pentru mesajele din istoric
type Message = {
  role: string;
  content: string;
};

export async function POST(request: Request) {
  try {
    const { question, context, query, history } = await request.json();

    if (!question || !context || !query) {
      return NextResponse.json(
        {
          error: "Este necesară specificarea întrebării, contextului și interogării",
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

    // Tratăm cazul când API-ul nu este disponibil sau cheia nu este validă
    try {
      // Extragem informațiile relevante din context
      const contextLines = context.split('\n');
      const explanationContext = contextLines[2] || '';

      // Construim un prompt structurat pentru Gemini
      let prompt = `
        Ești un asistent virtual educațional pentru elevi care se pregătesc pentru Bacalaureat în România.
        Rolul tău este să ajuți elevii să înțeleagă mai bine materia legată de geografie, folosind un ton prietenos și încurajator.
        
        Context despre întrebarea din quiz:
        ${context}
        
        Întrebarea elevului:
        ${query}
        
        Răspunde în limba română, oferind informații precise și educative. Menține răspunsul concis dar informativ.
      `;

      // Adăugăm istoricul conversației, dacă există
      if (history && Array.isArray(history) && history.length > 0) {
        prompt += "\n\nIstoric conversație (cele mai recente 3 mesaje):\n";
        
        // Folosim doar ultimele 3 mesaje pentru a menține prompt-ul concis
        const recentHistory = history.slice(-3);
        
        for (const msg of recentHistory) {
          prompt += `${msg.role === 'user' ? 'Elev' : 'Asistent'}: ${msg.content}\n`;
        }
      }

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
            maxOutputTokens: 800,
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

      // Returnăm răspunsul procesat
      return NextResponse.json({
        response: textContent
      });
      
    } catch (aiError) {
      console.error("Eroare în comunicarea cu Gemini API:", aiError);
      
      // Fallback cu răspunsuri locale în caz de eroare
      const contextLines = context.split('\n');
      const explanationContext = contextLines[2] || '';

      // Implementare locală simplificată de răspunsuri
      let response = '';
      
      // Verificăm cuvinte cheie în întrebare pentru a genera răspunsuri relevante
      if (query.toLowerCase().includes('explica') || query.toLowerCase().includes('explică') || 
          query.toLowerCase().includes('detalii') || query.toLowerCase().includes('mai mult')) {
        response = `Sigur, pot să-ți explic mai detaliat. ${explanationContext.replace('Explicație: ', '')} Această informație este importantă pentru înțelegerea corectă a geografiei României.`;
      }
      else if (query.toLowerCase().includes('de ce') || query.toLowerCase().includes('motivul')) {
        response = `Motivul este legat de specificul regiunii. ${explanationContext.replace('Explicație: ', '')} Acest aspect este relevant pentru examenul de Bacalaureat.`;
      }
      else if (query.toLowerCase().includes('unde') || query.toLowerCase().includes('localizare') || 
              query.toLowerCase().includes('poziție') || query.toLowerCase().includes('pozitie')) {
        response = `Din punct de vedere geografic, această regiune/acest fenomen se situează ${explanationContext.replace('Explicație: ', '')}`;
      }
      else if (query.toLowerCase().includes('cum') || query.toLowerCase().includes('proces')) {
        response = `Procesul poate fi înțeles astfel: ${explanationContext.replace('Explicație: ', '')} Acest concept este esențial pentru subiectul discutat.`;
      }
      else {
        // Răspuns general
        response = `Referitor la întrebarea ta despre "${query}": ${explanationContext.replace('Explicație: ', '')} Sper că această informație te ajută. Poți să-mi pui întrebări suplimentare dacă dorești să aprofundăm subiectul.`;
      }
      
      return NextResponse.json({
        response: response,
      });
    }
    
  } catch (error: unknown) {
    console.error("Eroare server asistent virtual:", error);
    
    return NextResponse.json(
      { error: "Eroare internă de server" },
      { status: 500 }
    );
  }
} 