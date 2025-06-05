import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const count = body.count || 5;
    const exclude = body.exclude || [];

    console.log("Request pentru generare elemente geo:", { count, exclude });

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Configurare API incompletă" },
        { status: 500 }
      );
    }

    const prompt = `
You are "GeoQuiz-Maker", an expert assistant who creates bite-sized items for a
European-countries drag-and-drop game used by Romanian high-school students
that prepare the Bacalaureat (Geografie).

TASK
-----
1. Randomly generate ${count} UNIQUE quiz items, where each item belongs to EXACTLY
   ONE of these categories (chosen randomly unless the user specifies):
     • CAPITAL   – the capital city of a country
     • RIVER     – a major river that flows THROUGH or starts in the country
     • RELIEF    – a major landform/unit of relief located mainly in the country
     • EU_FACT   – a fact about EU / Schengen / € adoption year for the country
2. Only use the 46 sovereign states usually incl. in "Europa" (Council of Europe
   members + Kosovo). No micro-territories like Vatican City, Gibraltar, etc.
3. Output MUST be valid UTF-8 JSON array, **nothing else**.
${exclude.length > 0 ? `4. Do not use these countries: ${exclude.join(', ')}` : ''}

OUTPUT FIELDS (per item)
------------------------
• "label"        – string that the player will see on the draggable card  
• "country_iso2" – ISO-3166-1 alpha-2 code of the target country (RO, FR…)
• "category"     – exactly one of: CAPITAL | RIVER | RELIEF | EU_FACT
• "explanation"  – 1-sentence fact used for feedback when player greșește

EXAMPLES
--------
[
  {
    "label": "Ljubljana",
    "country_iso2": "SI",
    "category": "CAPITAL",
    "explanation": "Ljubljana este capitala Sloveniei încă din 1991."
  },
  {
    "label": "Dunărea",
    "country_iso2": "RO",
    "category": "RIVER",
    "explanation": "Dunărea străbate 10 țări europene și se varsă în Marea Neagră prin România."
  },
  {
    "label": "Masivul Central",
    "country_iso2": "FR",
    "category": "RELIEF",
    "explanation": "Masivul Central alcătuiește o regiune montană veche în sud-vestul Franței."
  },
  {
    "label": "UE 2007",
    "country_iso2": "RO",
    "category": "EU_FACT",
    "explanation": "România a aderat la Uniunea Europeană pe 1 ianuarie 2007."
  }
]

RULES
-----
• Do not repeat the same country in a single batch unless requested.
• Never output the same combination of label+country across different runs
  (simulate infinite variety).
• Keep labels SHORT (max 3 words). No diacritics are fine.
• Use Romanian in explanations.
• Validate that capitals match the current internationally recognized status
  (2025).

READY ➜ Return exactly the JSON array now.
    `;

    console.log("Se trimite cerere către Google AI pentru elemente geo...");

    try {
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
              temperature: 0.8,
              maxOutputTokens: 2048,
              topP: 0.9,
              topK: 40
            }
          })
        }
      );

      console.log("Status răspuns Google AI:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Răspuns negativ de la Google AI:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        return NextResponse.json(
          { 
            error: "Serviciul de generare elemente nu este disponibil momentan",
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
      console.log("Text primit de la AI:", text.substring(0, 200));
      
      try {
        // Curăță textul de markdown ```json wrapper dacă există
        let cleanText = text.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.substring(7);
        }
        if (cleanText.startsWith('```')) {
          cleanText = cleanText.substring(3);
        }
        if (cleanText.endsWith('```')) {
          cleanText = cleanText.substring(0, cleanText.length - 3);
        }
        cleanText = cleanText.trim();
        
        console.log("Text curățat pentru parsing:", cleanText.substring(0, 200));
        
        // Încearcă să parseze JSON-ul
        const items = JSON.parse(cleanText);
        
        if (!Array.isArray(items)) {
          throw new Error("Răspunsul nu este un array");
        }

        // Validează structura elementelor
        const validItems = items.filter(item => 
          item.label && 
          item.country_iso2 && 
          item.category && 
          item.explanation &&
          ['CAPITAL', 'RIVER', 'RELIEF', 'EU_FACT'].includes(item.category)
        );

        console.log("Elemente valide generate:", validItems.length);

        if (validItems.length === 0) {
          return NextResponse.json(
            { 
              error: "Nu s-au putut genera elemente valide",
              details: text.substring(0, 200)
            },
            { status: 422 }
          );
        }

        return NextResponse.json({ items: validItems });
      } catch (jsonError) {
        console.error("Eroare la parsarea JSON:", jsonError);
        return NextResponse.json(
          { 
            error: "Formatul răspunsului AI nu este valid JSON",
            details: text.substring(0, 200)
          },
          { status: 422 }
        );
      }
    } catch (fetchError) {
      console.error("Eroare la cererea către Google AI:", fetchError);
      return NextResponse.json(
        { 
          error: "Eroare la comunicarea cu serviciul AI",
          details: fetchError instanceof Error ? fetchError.message : "Eroare necunoscută"
        },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error("Eroare server:", error);
    return NextResponse.json(
      { 
        error: "Eroare internă la generarea elementelor",
        details: error.message
      },
      { status: 500 }
    );
  }
} 