import RegionComparator from "@/components/RegionComparator";

export const metadata = {
  title: 'Comparator de Regiuni | GeoRomania',
  description: 'Compară diferite regiuni geografice ale României și învață pentru bacalaureat',
};

export default function ComparatorPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-center text-[#002B7F] mb-3">
          Comparator de Regiuni Geografice
        </h1>
        <p className="text-center text-slate-600 mb-8">
          Compară caracteristicile geografice ale diferitelor regiuni din România și primește feedback
          personalizat pentru pregătirea la Bacalaureat.
        </p>
      </div>
      
      <RegionComparator />
    </main>
  );
} 