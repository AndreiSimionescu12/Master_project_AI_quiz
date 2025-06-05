# GeoBacAI - Geografia României

O aplicație educațională interactivă care ajută elevii să se pregătească pentru examenul de Bacalaureat la Geografie prin intermediul quizurilor specifice fiecărui județ din România.

## Descriere

GeoBacAI este o aplicație web modernă care permite utilizatorilor să:

- Selecteze un județ de pe o hartă interactivă detaliată a României
- Aleagă subiectul Geografie
- Primească întrebări personalizate generate de AI, bazate pe programa BAC
- Verifice răspunsurile și să primească explicații detaliate

Aplicația este destinată elevilor de liceu, profesorilor și persoanelor care doresc să-și îmbunătățească cunoștințele despre geografia României.

## Tehnologii utilizate

- **Frontend:** React, Next.js (App Router)
- **UI:** Tailwind CSS
- **Hartă:** Mapbox GL, react-map-gl
- **AI:** OpenAI GPT-4 API
- **State Management:** React Context API + localStorage pentru persistență

## Caracteristici principale

- **Hartă interactivă a României** - Reprezentare precisă a județelor cu date GeoJSON
- **Interfață intuitivă și responsive** - Funcționează pe desktop și mobil
- **Generator de quiz AI de înaltă calitate** - Utilizează GPT-4 pentru întrebări personalizate
- **Flux de quiz interactiv** - Progres întrebare cu întrebare, calcul de scor și feedback
- **Persistența datelor** - Salvează progresul quizului în localStorage

## Instalare

1. Clonează repository-ul:
   ```
   git clone https://github.com/username/geobacai.git
   cd geobacai
   ```

2. Instalează dependențele:
   ```
   npm install
   ```

3. Configurează variabilele de mediu:
   Creează un fișier `.env.local` în directorul principal al proiectului și adaugă cheile API necesare:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   ```

4. Pornește serverul de dezvoltare:
   ```
   npm run dev
   ```

5. Deschide [http://localhost:3000](http://localhost:3000) în browser pentru a vedea aplicația.

## Utilizare

1. Deschide aplicația în browser
2. Selectează un județ de pe harta României
3. Alege disciplina Geografie
4. Răspunde la întrebările generate
5. Verifică răspunsurile și vezi explicațiile pentru răspunsurile incorecte
6. La final, vei vedea scorul obținut și vei putea încerca un nou quiz

## Structura proiectului

- `/app` - Rutele și paginile Next.js
- `/components` - Componentele React reutilizabile
- `/context` - Context API pentru gestionarea stării
- `/types` - Definiții TypeScript pentru biblioteci externe
- `/public` - Fișiere statice

## Problemele rezolvate

- **Tipuri pentru react-map-gl** - Am creat definiții proprii pentru tipurile lipsă
- **Management token Mapbox** - Configurare prin variabile de mediu pentru securitate
- **Gestionarea erorilor** - Tratare și afișare clară a mesajelor de eroare
- **Îmbunătățirea generării de întrebări** - Utilizare GPT-4 cu prompturi optimizate
- **Responsivitate** - Design adaptat pentru dispozitive mobile și desktop

## Îmbunătățiri viitoare

- Adăugarea mai multor discipline (Matematică, Fizică, Chimie, etc.)
- Implementarea unui sistem de cont utilizator pentru salvarea progresului
- Adăugarea de statistici și tracking al performanței
- Integrarea mai multor surse de date geografice și istorice
- Opțiuni pentru dificultate și filtrare a întrebărilor

## Licență

Acest proiect este licențiat sub licența MIT.

## Autori

Dezvoltat cu ❤️ pentru educația din România.

---

**Notă importantă:** Pentru a utiliza această aplicație în producție, este necesar să obții:
1. O cheie API de la OpenAI: https://platform.openai.com
2. Un token Mapbox valid: https://account.mapbox.com/access-tokens/
