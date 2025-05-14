"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Link from "next/link";

type CarFormValues = {
  carBrand: string;
  carModel: string;
  year: number;
  insuranceValidity: string;
  roadTaxValidity: string;
  technicalInspectionValidity: string;
};

type CarFormProps = {
  initialData?: CarFormValues;
  carID?: number;
  isEdit?: boolean;
};

const CarForm: React.FC<CarFormProps> = ({ initialData, carID, isEdit = false }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CarFormValues>({ defaultValues: initialData });

  const onSubmit = async (data: CarFormValues) => {
    try {
  
      const endpoint = isEdit && carID 
        ? `http://localhost:3001/api/cars/${carID}`
        : "http://localhost:3001/api/cars";
  
      const response = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Server error");
      }
  
      toast.success(isEdit ? "Car updated!" : "Car added!");
      window.location.href = "/cars";
    } catch (err) {
      setError('root', {
        type: 'server',
        message: err instanceof Error ? err.message : "Connection error!"
      });
    }
  };
  

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
        {isEdit ? "Modify car" : "Add new car"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Car Brand */}
        <div>
          <label className="block text-lg font-medium text-zinc-700 mb-1">
            Car Brand
          </label>
          <input
            {...register("carBrand")}
            type="text"
            id="carBrand"
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="ex: BMW"
          />
          {errors.carBrand && (
            <p className="text-red-500 text-sm mt-1">{errors.carBrand.message}</p>
          )}
        </div>

        {/* Car Model */}
        <div>
          <label className="block text-lg font-medium text-zinc-700 mb-1">
            Model
          </label>
          <input
            {...register("carModel")}
            type="text"
            id="CarModel"
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="ex: Seria 3"
          />
          {errors.carModel && (
            <p className="text-red-500 text-sm mt-1">{errors.carModel.message}</p>
          )}
        </div>

        {/* Year */}
        <div>
          <label className="block text-lg font-medium text-zinc-700 mb-1">
            Production Year
          </label>
          <input
            {...register("year", { valueAsNumber: true })}
            type="number"
            id="year"
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            min="1900"
            max={new Date().getFullYear() + 1}
          />
          {errors.year && (
            <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
          )}
        </div>

        {/* Insurance Validity */}
        <div>
          <label className="block text-lg font-medium text-zinc-700 mb-1">
            Insurance Validity
          </label>
          <input
            {...register("insuranceValidity")}
            type="date"
            id="insuranceValidity"
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.insuranceValidity && (
            <p className="text-red-500 text-sm mt-1">{errors.insuranceValidity.message}</p>
          )}
        </div>

        {/* Road Tax Validity */}
        <div>
          <label className="block text-lg font-medium text-zinc-700 mb-1">
            Road Tax Validity
          </label>
          <input
            {...register("roadTaxValidity")}
            type="date"
            id="roadTaxValidity"
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.roadTaxValidity && (
            <p className="text-red-500 text-sm mt-1">{errors.roadTaxValidity.message}</p>
          )}
        </div>

        {/* Technical Inspection Validity */}
        <div>
          <label className="block text-lg font-medium text-zinc-700 mb-1">
          Technical Inspection Validity
          </label>
          <input
            {...register("technicalInspectionValidity")}
            type="date"
            id="technicalInspectionValidity"
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.technicalInspectionValidity && (
            <p className="text-red-500 text-sm mt-1">{errors.technicalInspectionValidity.message}</p>
          )}
        </div>

        {errors.root && (
        <p className="text-red-500 text-center">{errors.root.message}</p>
        )}

        <div className="flex justify-between pt-6">
          <Link
            href="/cars"
            className="px-6 py-2 rounded-lg bg-zinc-200 text-zinc-700 font-semibold hover:bg-zinc-300 transition"
          >
            Return
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {isSubmitting ? "Saving..." : (isEdit ? "Modify" : "Add")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarForm;
