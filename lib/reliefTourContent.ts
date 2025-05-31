export interface ReliefTourStep {
  title: string;
  content: string;
  imageUrl?: string;
  quiz?: {
    question: string;
    options: string[];
    answer: number;
  };
}

export const reliefTourContent: Record<string, ReliefTourStep[]> = {
  "carpatii-meridionali": [
    {
      title: "Localizare și delimitare",
      content:
        "Carpații Meridionali sunt situați în partea central-sudică a României, între Valea Prahovei la est și Defileul Dunării la vest. Sunt delimitați la nord de Depresiunea Brașovului și la sud de Subcarpații Getici și Podișul Mehedinți.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Carpatii_Meridionali.png",
    },
    {
      title: "Caracteristici fizico-geografice",
      content:
        "Carpații Meridionali sunt cei mai înalți munți din România, cu vârfuri ce depășesc 2500 m (Moldoveanu 2544 m, Negoiu 2535 m). Relieful este alpin, cu creste, platouri glaciare, circuri și văi glaciare. Clima este aspră, cu precipitații bogate și temperaturi scăzute la altitudine.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Muntii_Fagarasului.jpg",
    },
    {
      title: "Resurse și utilizare",
      content:
        "Zona este bogată în resurse forestiere, apă, hidroenergie și are potențial turistic ridicat (drumeții, schi, alpinism). Sunt prezente stațiuni montane renumite: Sinaia, Bușteni, Rânca, Voineasa.",
    },
    {
      title: "Orașe importante",
      content:
        "Orașe situate la poalele Carpaților Meridionali: Brașov, Sibiu, Petroșani, Câmpulung, Curtea de Argeș.",
    },
    {
      title: "Exemplu de subiect Bac",
      content:
        "Prezentați două caracteristici ale reliefului Carpaților Meridionali și două resurse importante ale acestei zone.",
    },
    {
      title: "Mini-quiz",
      content: "Care este cel mai înalt vârf din Carpații Meridionali?",
      quiz: {
        question: "Care este cel mai înalt vârf din Carpații Meridionali?",
        options: ["Omu", "Moldoveanu", "Negoiu", "Parângu Mare"],
        answer: 1,
      },
    },
  ],
}; 