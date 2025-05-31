export interface Region3DData {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  facts: string[];
  resources: string[];
  protectedAreas: string[];
  elevation: number;
  population: number;
  mainCities: string[];
  climate: string;
  vegetation: string[];
}

export const regions3DData: Region3DData[] = [
  {
    id: "transilvania",
    name: "Transilvania",
    coordinates: [24.0, 46.5],
    description: "Regiune istorică din centrul României, cunoscută pentru peisajele sale montane și tradițiile sale bogate.",
    facts: [
      "Găzduiește cel mai mare număr de cetăți medievale din Europa",
      "Este locul de origine al legendei lui Dracula",
      "Are cea mai mare densitate de biserici fortificate din Europa"
    ],
    resources: [
      "Resurse forestiere",
      "Minerit",
      "Turism cultural și natural"
    ],
    protectedAreas: [
      "Parcul Național Retezat",
      "Parcul Național Piatra Craiului",
      "Rezervația Naturală Cheile Turzii"
    ],
    elevation: 800,
    population: 6500000,
    mainCities: ["Cluj-Napoca", "Brașov", "Sibiu", "Târgu Mureș"],
    climate: "Temperat continental",
    vegetation: ["Păduri de conifere", "Păduri de foioase", "Pajiști alpine"]
  },
  {
    id: "dobrogea",
    name: "Dobrogea",
    coordinates: [28.5, 44.5],
    description: "Regiune din sud-estul României, mărginită de Marea Neagră și Dunăre, cunoscută pentru delta sa și stațiunile sale de pe litoral.",
    facts: [
      "Găzduiește Delta Dunării, cea mai mare deltă din Europa",
      "A fost locuită de greci încă din antichitate",
      "Are cea mai lungă perioadă de insolație din România"
    ],
    resources: [
      "Resurse piscicole",
      "Turism balnear",
      "Agricultură"
    ],
    protectedAreas: [
      "Delta Dunării",
      "Rezervația Naturală Cheile Dobrogei",
      "Parcul Natural Măcin"
    ],
    elevation: 200,
    population: 850000,
    mainCities: ["Constanța", "Tulcea", "Mangalia"],
    climate: "Mediteranean temperat",
    vegetation: ["Stepe", "Vegetație mediteraneană", "Păduri de stejar"]
  },
  {
    id: "moldova",
    name: "Moldova",
    coordinates: [27.0, 47.0],
    description: "Regiune istorică din estul României, cunoscută pentru tradițiile sale, mănăstirile pictate și peisajele sale naturale.",
    facts: [
      "Găzduiește Mănăstirile Pictate din Bucovina, Patrimoniu UNESCO",
      "Este locul de origine al limbii române literare",
      "Are cea mai mare concentrație de mănăstiri ortodoxe din România"
    ],
    resources: [
      "Agricultură",
      "Turism cultural și religios",
      "Resurse forestiere"
    ],
    protectedAreas: [
      "Parcul Național Ceahlău",
      "Rezervația Naturală Pădurea Slătioara",
      "Parcul Natural Vânători-Neamț"
    ],
    elevation: 400,
    population: 4500000,
    mainCities: ["Iași", "Bacău", "Piatra Neamț", "Suceava"],
    climate: "Temperat continental",
    vegetation: ["Păduri de foioase", "Păduri de conifere", "Pajiști"]
  }
];

export function getRegion3DById(id: string): Region3DData | undefined {
  return regions3DData.find(region => region.id === id);
} 