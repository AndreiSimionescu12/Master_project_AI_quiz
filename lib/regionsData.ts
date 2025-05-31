export interface RegionData {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  facts: string[];
  resources: string[];
  protectedAreas: string[];
}

export const regionsData: RegionData[] = [
  {
    id: 'transilvania',
    name: 'Transilvania',
    coordinates: [24.0, 46.5],
    description: 'Regiune istorică din centrul României, cunoscută pentru peisajele sale montane și tradițiile sale bogate.',
    facts: [
      'Este înconjurată de lanțuri montane: Carpații Orientali, Carpații Meridionali și Carpații Occidentali',
      'Găzduiește cel mai mare număr de cetăți medievale din România',
      'Este cunoscută pentru diversitatea sa culturală și etnică'
    ],
    resources: [
      'Resurse forestiere',
      'Minerale (aur, argint, cupru)',
      'Pășuni și terenuri agricole'
    ],
    protectedAreas: [
      'Parcul Național Retezat',
      'Parcul Național Piatra Craiului',
      'Rezervația Naturală Cheile Turzii'
    ]
  },
  // Vom adăuga mai multe regiuni aici
];

export const getRegionById = (id: string): RegionData | undefined => {
  return regionsData.find(region => region.id === id);
}; 