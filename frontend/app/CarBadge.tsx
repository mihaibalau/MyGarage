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

function getBadgeColor(dateStr: string) {
  if (!dateStr) return "bg-gray-100 text-gray-400";
  const now = new Date();
  const exp = new Date(dateStr);
  const diff = exp.getTime() - now.getTime();
  const threeMonths = 1000 * 60 * 60 * 24 * 90;

  if (exp < now) return "bg-pink-100 text-pink-700 border border-pink-300";
  if (diff <= threeMonths) return "bg-orange-100 text-orange-800 border border-orange-300";
  return "bg-lime-100 text-lime-800 border border-lime-300";
}

const CarBadge: React.FC<Props> = ({ car, onModify, onDelete }) => (
  <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-xl shadow p-5 mb-4 border border-zinc-200">
    
    <div className="flex-1 text-left">
      <div className="text-xl font-bold text-teal-700">{car.carBrand}</div>
      <div className="text-zinc-500 text-base">{car.carModel}</div>
      <div className="text-zinc-700 font-medium">Year: {car.year}</div>
    </div>
    
    <div className="flex-1 flex flex-col md:flex-row justify-center items-center gap-5 pr-10">
      <div className={`px-3 py-1 rounded text-sm font-medium min-w-[120px] ${getBadgeColor(car.insuranceValidity)}`}>
        Insurance: {car.insuranceValidity}
      </div>
      <div className={`px-3 py-1 rounded text-sm font-medium min-w-[120px] ${getBadgeColor(car.roadTaxValidity)}`}>
        Road Tax: {car.roadTaxValidity}
      </div>
      <div className={`px-3 py-1 rounded text-sm font-medium min-w-[120px] ${getBadgeColor(car.technicalInspectionValidity)}`}>
        Inspection: {car.technicalInspectionValidity}
      </div>
    </div>
    
    <div className="flex flex-col gap-2 md:ml-6 mt-3 md:mt-0">
      <button
        className="px-4 py-1 rounded bg-teal-600 text-white font-semibold"
        onClick={() => onModify(car)}
      >
        Modify
      </button>
      <button
        className="px-4 py-1 rounded bg-rose-400 text-white font-semibold"
        onClick={() => onDelete(car)}
      >
        Delete
      </button>
    </div>
  </div>
);

export default CarBadge;
