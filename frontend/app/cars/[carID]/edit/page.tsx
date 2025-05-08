import { notFound } from 'next/navigation';
import CarForm from '@/app/CarForm';

interface Car {
  carID: number;
  carBrand: string;
  carModel: string;
  year: number;
  insuranceValidity: string;
  roadTaxValidity: string;
  technicalInspectionValidity: string;
}

// Funcție pentru a converti data din format dd/mm/yyyy în yyyy-mm-dd
const convertToHTMLDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

async function getCar(id: string): Promise<Car> {
  const res = await fetch(`http://localhost:3001/api/cars/${id}`, { cache: 'no-store' });
  
  if (!res.ok) {
    throw new Error('Failed to fetch car');
  }
  
  return res.json();
}

export default async function EditPage({ params }: { params: { carID: string } }) {
  try {
    const car = await getCar(params.carID);
    
    return (
      <CarForm 
        initialData={{
          ...car,
          insuranceValidity: convertToHTMLDate(car.insuranceValidity),
          roadTaxValidity: convertToHTMLDate(car.roadTaxValidity),
          technicalInspectionValidity: convertToHTMLDate(car.technicalInspectionValidity)
        }}
        carID={car.carID}
        isEdit={true}
      />
    );
  } catch (error) {
    return notFound();
  }
}
