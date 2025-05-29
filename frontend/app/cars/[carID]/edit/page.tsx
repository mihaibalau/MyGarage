import CarForm from '@/app/CarForm';

async function getCar(id: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const res = await fetch(`${API_URL}/api/cars/${id}`, { cache: 'no-store' });


  if (!res.ok) {
    throw new Error('Failed to fetch car. The id missing.');
  }
 
  return res.json();
}

interface EditPageProps {
  params: {
    carID: string
  }
}

export default async function EditPage(props: EditPageProps) {
  const { carID } = props.params

  if (!carID) {
    throw new Error('Failed to fetch car.')
  }

  try {
    const car = await getCar(carID)

    return (
      <CarForm
        initialData={car}
        carID={car.carID}
        isEdit={true}
      />
    )
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to load car: ${error.message}`)
    }
    throw new Error('Failed to load car: Unknown error')
  }
}

