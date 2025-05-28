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
        throw new Error(errorData.message || "Server communication error!");
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

      <h1 className="text-3xl font-bold mb-8 text-center text-teal-700">
        {isEdit ? "Modify car" : "Add new car"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div>
          <label className="block text-lg font-medium text-zinc-700 mb-1">
            Car Brand
          </label>

          <input
            {...register("carBrand")}
            type="text"
            id="carBrand"
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="ex: BMW"
            minLength={3}
            required={true}
          />
        </div>

        
        <div>
          <label className="block text-lg font-medium text-zinc-700 mb-1">
            Model
          </label>

          <input
            {...register("carModel")}
            type="text"
            id="CarModel"
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="ex: Seria 3"
            required={true}
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-zinc-700 mb-1">
            Production Year
          </label>
          <input
            {...register("year", { valueAsNumber: true })}
            type="number"
            id="year"
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            min="1886"
            max={new Date().getFullYear() + 1}
          /> 
        </div>

        <div>
          <label className="block text-lg font-medium text-zinc-700 mb-1">
            Insurance Validity
          </label>
          <input
            {...register("insuranceValidity")}
            type="date"
            id="insuranceValidity"
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            required={true}
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-zinc-700 mb-1">
            Road Tax Validity
          </label>
          <input
            {...register("roadTaxValidity")}
            type="date"
            id="roadTaxValidity"
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            required={true}
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-zinc-700 mb-1">
          Technical Inspection Validity
          </label>
          <input
            {...register("technicalInspectionValidity")}
            type="date"
            id="technicalInspectionValidity"
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            required={true}
          />
        </div>

        {errors.root && (
          <div className="flex items-center justify-center gap-2 bg-rose-100 border border-rose-300 text-rose-700 px-4 py-2 rounded-lg shadow animate-pulse mt-2">
            <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
            </svg>
            <span>{errors.root.message}</span>
          </div>
        )}

        <div className="flex justify-between pt-5">
          <Link
            href="/cars"
            className="px-6 py-2 rounded-lg bg-zinc-200 text-zinc-700 font-semibold"
          >
            Return
          </Link>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2 rounded-lg bg-teal-600 text-white font-semibold"
          >
            {isSubmitting ? "Saving..." : (isEdit ? "Modify" : "Add")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarForm;
