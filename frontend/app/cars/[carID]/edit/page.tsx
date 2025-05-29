import CarForm from '@/app/CarForm';

async function getCar(id: string) {
  const res = await fetch(`http://51.21.152.86:3001/api/cars/${id}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch car. The id missing.');
  }
 
  return res.json();
}

export default async function EditPage(props: any) {
  const { carID } = await props.params;

  if (!carID) {
    throw new Error('Failed to fetch car.');
  }

  try {
    const car = await getCar(carID);

    return (
        <CarForm
          initialData={car}
          carID={car.carID}
          isEdit={true}
        />
    );
  } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to load the error from cars edit page.');
      }
  }
}
