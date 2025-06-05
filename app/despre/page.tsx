"use client";

export default function DesprePage() {
  return (
    <main className="flex-1">
      {/* Header decorativ */}
      <div className="absolute inset-x-0 top-16 h-48 bg-gradient-to-b from-blue-50 to-transparent -z-10"></div>

      <div className="container mx-auto px-4 pt-8 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Titlu principal */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Despre GeoBacAI
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Aplicația educațională AI pentru pregătirea examenului de Bacalaureat la Geografie
            </p>
          </div>

          {/* Secțiuni informative */}
          <div className="space-y-8">
            
            {/* Ce este GeoBacAI */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                🎯 Ce este GeoBacAI?
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                GeoBacAI este o aplicație educațională modernă care combină inteligența artificială cu 
                geografiile interactive pentru a ajuta elevii să se pregătească eficient pentru 
                examenul de Bacalaureat la Geografie. Aplicația oferă quiz-uri personalizate și 
                jocuri interactive bazate pe programa oficială.
              </p>
            </div>

            {/* Funcționalități principale */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                ⚡ Funcționalități Principale
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">🗺️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Hartă Interactivă România</h3>
                      <p className="text-slate-600 text-sm">Selectează regiuni pentru quiz-uri personalizate</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">🤖</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Quiz-uri Generate de AI</h3>
                      <p className="text-slate-600 text-sm">Întrebări personalizate bazate pe Google AI</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-bold">🎮</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Joc Geografie Europa</h3>
                      <p className="text-slate-600 text-sm">Asociază capitale, râuri și reliefuri cu țările</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-600 font-bold">📊</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Comparator Regiuni</h3>
                      <p className="text-slate-600 text-sm">Compară caracteristicile diferitelor regiuni</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-bold">📱</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Design Responsive</h3>
                      <p className="text-slate-600 text-sm">Funcționează perfect pe mobile și desktop</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-600 font-bold">📈</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Progres Personalizat</h3>
                      <p className="text-slate-600 text-sm">Urmărește progresul și performanțele</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tehnologii */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                🔧 Tehnologii Utilizate
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Frontend</h3>
                  <ul className="text-blue-600 text-sm space-y-1">
                    <li>• Next.js 14</li>
                    <li>• React</li>
                    <li>• TypeScript</li>
                    <li>• Tailwind CSS</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">AI & APIs</h3>
                  <ul className="text-green-600 text-sm space-y-1">
                    <li>• Google Gemini AI</li>
                    <li>• Mapbox GL</li>
                    <li>• REST APIs</li>
                    <li>• JSON Data</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Features</h3>
                  <ul className="text-purple-600 text-sm space-y-1">
                    <li>• Progressive Web App</li>
                    <li>• Local Storage</li>
                    <li>• Responsive Design</li>
                    <li>• Real-time Updates</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Cum să folosești */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                📚 Cum să Folosești GeoBacAI
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Pentru Quiz-uri Clasice:</h3>
                  <ol className="space-y-2 text-slate-600">
                    <li className="flex items-start space-x-2">
                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                      <span>Selectează o regiune de pe harta României</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                      <span>Alege "Geografie fizică" ca subiect</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                      <span>Răspunde la întrebările generate de AI</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                      <span>Primește feedback și explicații detaliate</span>
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Pentru Jocul Europei:</h3>
                  <ol className="space-y-2 text-slate-600">
                    <li className="flex items-start space-x-2">
                      <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                      <span>Accesează "🎮 Joc Geografie" din menu</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                      <span>Generează elemente geografice cu AI</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                      <span>Asociază elementele cu țările pe hartă</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                      <span>Urmărește scorul și progresul</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Info despre dezvoltare */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                💡 Dezvoltat pentru Educație
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed mb-6">
                GeoBacAI a fost creat special pentru elevii și profesorii din România care vor să 
                transforme învățarea geografiei într-o experiență interactivă și plăcută. 
                Utilizând cele mai noi tehnologii AI, aplicația oferă conținut personalizat 
                și actualizat permanent.
              </p>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm text-blue-100">
                  <strong className="text-white">🎯 Obiectiv:</strong> Să fac pregătirea pentru Bacalaureat mai eficientă și mai plăcută prin tehnologie modernă.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
} 