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

  // Fetch cars
  const fetchCars = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append("sortBy", sortBy);
    params.append("order", order);
    if (filter.isValidInsurance) params.append("isValidInsurance", "true");
    if (filter.isValidRoadTax) params.append("isValidRoadTax", "true");
    if (filter.isValidInspection) params.append("isValidInspection", "true");
    const res = await fetch(`${API_URL}?${params.toString()}`);
    const data = await res.json();
    setCars(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line
  }, [sortBy, order, filter]);

  // Handlers
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
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Garage</h1>
      {/* Sortare și filtrare */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-2">
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-2 py-1"
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
            className="border rounded px-2 py-1"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
        <div className="flex gap-2">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={filter.isValidInsurance}
              onChange={(e) =>
                setFilter((f) => ({
                  ...f,
                  isValidInsurance: e.target.checked,
                }))
              }
            />
            Insurance valid
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={filter.isValidRoadTax}
              onChange={(e) =>
                setFilter((f) => ({
                  ...f,
                  isValidRoadTax: e.target.checked,
                }))
              }
            />
            Road Tax valid
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={filter.isValidInspection}
              onChange={(e) =>
                setFilter((f) => ({
                  ...f,
                  isValidInspection: e.target.checked,
                }))
              }
            />
            Inspection valid
          </label>
        </div>
      </div>

      {/* Lista mașini */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : cars.length === 0 ? (
        <div className="text-center py-10 text-zinc-500">No cars found.</div>
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

      {/* Confirmare ștergere */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">
              Confirm delete
            </h2>
            <p className="mb-6">
              Are you sure you want to delete <b>{confirmDelete.carBrand} {confirmDelete.carModel}</b>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-1 rounded bg-zinc-200 text-zinc-700 hover:bg-zinc-300 transition"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
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
