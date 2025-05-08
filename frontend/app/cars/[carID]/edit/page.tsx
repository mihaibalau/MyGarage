"use client";
import { useEffect, useState } from "react";
import CarForm from "@/app/CarForm";

type Car = {
  carID: number;
  carBrand: string;
  carModel: string;
  year: number;
  insuranceValidity: string;
  roadTaxValidity: string;
  technicalInspectionValidity: string;
};

export default function EditCarPage({ params }: { params: { carID: string } }) {
  const [carData, setCarData] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/cars/${params.carID}`
        );
        if (!response.ok) throw new Error("Mașina nu există");
        const data: Car = await response.json();
        setCarData(data);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [params.carID]);

  if (loading) return <div className="text-center py-10">Se încarcă...</div>;

  return carData ? (
    <CarForm 
      initialData={carData} 
      carID={Number(params.carID)}
      isEdit={true}
    />
  ) : null;
}
