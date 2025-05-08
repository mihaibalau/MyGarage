import { notFound } from 'next/navigation';
import CarForm from '@/app/CarForm';

const convertToHTMLDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

async function getCar(id: string) {
  const res = await fetch(`http://localhost:3001/api/cars/${id}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch car');
  }

  return res.json();
}

export default async function EditPage(props: any) {
  const carID = props.params?.carID;

  if (!carID) {
    return notFound();
  }

  try {
    const car = await getCar(carID);

    return (
      <CarForm
        initialData={{
          ...car,
          insuranceValidity: convertToHTMLDate(car.insuranceValidity),
          roadTaxValidity: convertToHTMLDate(car.roadTaxValidity),
          technicalInspectionValidity: convertToHTMLDate(car.technicalInspectionValidity),
        }}
        carID={car.carID}
        isEdit={true}
      />
    );
  } catch (error) {
    return notFound();
  }
}
