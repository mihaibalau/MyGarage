import React from "react";

type Car = {
  carID: number;
  carBrand: string;
  carModel: string;
  year: number;
  insuranceValidity: string;
  roadTaxValidity: string;
  technicalInspectionValidity: string;
};

type Props = {
  car: Car;
  onModify: (car: Car) => void;
  onDelete: (car: Car) => void;
};

const CarBadge: React.FC<Props> = ({ car, onModify, onDelete }) => (
  <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-xl shadow p-5 mb-4 border border-zinc-200">
    {/* Details */}
    <div className="flex-1 text-left">
      <div className="text-xl font-bold text-blue-700">{car.carBrand}</div>
      <div className="text-zinc-500 text-base">{car.carModel}</div>
      <div className="text-zinc-700 font-medium">Year: {car.year}</div>
    </div>
    {/* Valability */}
    <div className="flex-1 flex flex-col md:flex-row justify-center items-center gap-3 mt-3 md:mt-0">
      <div className="bg-blue-50 px-3 py-1 rounded text-blue-800 text-sm">
        Insurance: {car.insuranceValidity}
      </div>
      <div className="bg-green-50 px-3 py-1 rounded text-green-800 text-sm">
        Road Tax: {car.roadTaxValidity}
      </div>
      <div className="bg-yellow-50 px-3 py-1 rounded text-yellow-800 text-sm">
        Inspection: {car.technicalInspectionValidity}
      </div>
    </div>
    {/* Buttons */}
    <div className="flex flex-col gap-2 md:ml-6 mt-3 md:mt-0">
      <button
        className="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        onClick={() => onModify(car)}
      >
        Modify
      </button>
      <button
        className="px-4 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
        onClick={() => onDelete(car)}
      >
        Delete
      </button>
    </div>
  </div>
);

export default CarBadge;
