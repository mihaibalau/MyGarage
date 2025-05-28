"use client";
import React, { useEffect, useState } from "react";
import CarBadge from "../CarBadge";

type Car = {
  carID: number;
  carBrand: string;
  carModel: string;
  year: number;
  insuranceValidity: string;
  roadTaxValidity: string;
  technicalInspectionValidity: string;
};

const API_URL = "http://localhost:3001/api/cars";

const sortOptions = [
  { value: "brand", label: "Brand" },
  { value: "model", label: "Model" },
  { value: "year", label: "Year" },
  { value: "insurance", label: "Insurance Validity" },
  { value: "roadTax", label: "Road Tax Validity" },
  { value: "inspection", label: "Inspection Validity" },
];

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("brand");
  const [order, setOrder] = useState("asc");
  const [filter, setFilter] = useState({
    isValidInsurance: false,
    isValidRoadTax: false,
    isValidInspection: false,
  });
  const [confirmDelete, setConfirmDelete] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);


  
  const fetchCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("sortBy", sortBy);
      params.append("order", order);
      if (filter.isValidInsurance) params.append("isValidInsurance", "true");
      if (filter.isValidRoadTax) params.append("isValidRoadTax", "true");
      if (filter.isValidInspection) params.append("isValidInspection", "true");

      const res = await fetch(`${API_URL}?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setCars(data);
    } catch (err: any) {
      
      if (err.message === "Failed to fetch") {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(err.message || "Unknown error occurred.");
      }
      setCars([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => { fetchCars(); }, [sortBy, order, filter]);

  const handleModify = (car: Car) => {
    window.location.href = `/cars/${car.carID}/edit`;
  };

  const handleDelete = async (car: Car) => {
    setConfirmDelete(car);
  };

  const confirmDeleteCar = async () => {
    if (!confirmDelete) return;
    await fetch(`${API_URL}/${confirmDelete.carID}`, { method: "DELETE" });
    setConfirmDelete(null);
    fetchCars();
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Garage</h1>

      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-2">
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-zinc-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort by {opt.label}
              </option>
            ))}
          </select>

          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="border border-zinc-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>

        <div className="flex gap-2 bg-white rounded-xl px-4 py-2 shadow-sm">
          <label className="flex items-center gap-1 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={filter.isValidInsurance}
              onChange={(e) =>
                setFilter((f) => ({
                  ...f,
                  isValidInsurance: e.target.checked,
                }))
              }
              className="accent-teal-600 w-4 h-4"
            />
            Insurance valid
          </label>
          <label className="flex items-center gap-1 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={filter.isValidRoadTax}
              onChange={(e) =>
                setFilter((f) => ({
                  ...f,
                  isValidRoadTax: e.target.checked,
                }))
              }
              className="accent-teal-600 w-4 h-4"
            />
            Road Tax valid
          </label>
          <label className="flex items-center gap-1 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={filter.isValidInspection}
              onChange={(e) =>
                setFilter((f) => ({
                  ...f,
                  isValidInspection: e.target.checked,
                }))
              }
              className="accent-teal-600 w-4 h-4"
            />
            Inspection valid
          </label>
        </div>

      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-10 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg shadow-sm mx-auto max-w-s">
          <svg xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            className="w-6 h-6 mb-2 text-rose-400">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <circle cx="12" cy="16" r="1" />
          </svg>
          <span className="font-semibold text-base">{error}</span>
          <button
            onClick={fetchCars}
            className="mt-3 px-4 py-1 rounded bg-rose-200 text-rose-800 font-medium hover:bg-rose-300 transition"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-10 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg shadow-sm mx-auto max-w-s animate-pulse">
          <svg className="w-6 h-6 mb-2 animate-spin text-yellow-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span className="font-semibold text-base">Loading...</span>
        </div>
      ) : cars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 bg-zinc-50 border border-zinc-200 text-zinc-500 rounded-lg shadow-sm mx-auto max-w-s">
          <svg xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            className="w-6 h-6 mb-2 text-zinc-400">
            <rect x="5" y="11" width="14" height="8" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <span className="font-semibold text-base">No cars found.</span>
        </div>
      ) : (
        cars.map((car) => (
          <CarBadge
            key={car.carID}
            car={car}
            onModify={handleModify}
            onDelete={handleDelete}
          />
        ))
      )}

      
      {confirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white border border-zinc-200 rounded-xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
              
              <svg className="w-10 h-10 mb-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" className="stroke-rose-200" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
              </svg>
              <h2 className="text-xl font-bold text-rose-700 mb-2 text-center">
                Confirm delete
              </h2>
              <p className="mb-6 text-center text-zinc-700">
                Are you sure you want to delete
                <span className="font-semibold text-rose-700"> {confirmDelete.carBrand} {confirmDelete.carModel}</span>?
              </p>
              <div className="flex justify-end gap-3 w-full">
                <button
                  className="px-5 py-2 rounded-lg bg-zinc-100 text-zinc-700 font-medium hover:bg-zinc-200 transition"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600 transition"
                  onClick={confirmDeleteCar}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}
