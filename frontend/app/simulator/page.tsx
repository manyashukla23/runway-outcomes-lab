"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import RiskResultCard from "@/components/RiskResultCard";

const API_BASE_URL = "http://localhost:8000";

interface PredictionResult {
  product_id: number;
  return_probability: number;
  risk_label: string;
}

interface PredictResponse {
  predictions: PredictionResult[];
}

export default function SimulatorPage() {
  const [formData, setFormData] = useState({
    category: "",
    brand: "",
    department: "",
    price: "",
    discount_pct: "",
    customer_age: "",
    customer_country: "",
  });

  const [prediction, setPrediction] = useState<PredictResponse | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(`${API_BASE_URL}/ml/predict_returns`, {
        products: [
          {
            product_id: Math.floor(Math.random() * 1000000),
            category: data.category,
            brand: data.brand,
            department: data.department,
            price: parseFloat(data.price),
            discount_pct: parseFloat(data.discount_pct),
            customer_age: parseInt(data.customer_age),
            customer_country: data.customer_country,
          },
        ],
      });
      return response.data;
    },
    onSuccess: (data) => {
      setPrediction(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF8F1] text-slate-900">
      {/* App Shell Header */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-pink-100/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold shadow-sm hover:bg-pink-200 transition-all duration-200">
                ← Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  New Drop Risk Simulator
                </h1>
                <p className="text-sm text-slate-600 mt-0.5">
                  Predict return probability before launching your next collection
                </p>
              </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 ${
              !mutation.isError
                ? 'bg-green-100 text-green-700 border border-green-200/50'
                : 'bg-red-100 text-red-700 border border-red-200/50'
            }`}>
              API: {mutation.isError ? 'Error' : 'Ready'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)] border border-white/50 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Product Details
            </h2>
            <p className="text-sm text-slate-600">
              Enter information about your new product drop to predict return risk
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-pink-200/50 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-pink-300 transition-all duration-200 placeholder:text-slate-400"
                  placeholder="e.g., Dresses"
                  required
                />
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-semibold text-slate-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-pink-200/50 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-pink-300 transition-all duration-200 placeholder:text-slate-400"
                  placeholder="e.g., Example Brand"
                  required
                />
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-semibold text-slate-700 mb-2">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-pink-200/50 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-pink-300 transition-all duration-200 text-slate-900"
                  required
                >
                  <option value="">Select department</option>
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                  <option value="Kids">Kids</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-slate-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-white/50 border border-pink-200/50 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-pink-300 transition-all duration-200 placeholder:text-slate-400"
                  placeholder="e.g., 129.99"
                  required
                />
              </div>

              <div>
                <label htmlFor="discount_pct" className="block text-sm font-semibold text-slate-700 mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  id="discount_pct"
                  name="discount_pct"
                  value={formData.discount_pct}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 bg-white/50 border border-pink-200/50 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-pink-300 transition-all duration-200 placeholder:text-slate-400"
                  placeholder="e.g., 20"
                  required
                />
              </div>

              <div>
                <label htmlFor="customer_age" className="block text-sm font-semibold text-slate-700 mb-2">
                  Customer Age
                </label>
                <input
                  type="number"
                  id="customer_age"
                  name="customer_age"
                  value={formData.customer_age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 bg-white/50 border border-pink-200/50 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-pink-300 transition-all duration-200 placeholder:text-slate-400"
                  placeholder="e.g., 24"
                  required
                />
              </div>

              <div>
                <label htmlFor="customer_country" className="block text-sm font-semibold text-slate-700 mb-2">
                  Customer Country
                </label>
                <input
                  type="text"
                  id="customer_country"
                  name="customer_country"
                  value={formData.customer_country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-pink-200/50 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-pink-300 transition-all duration-200 placeholder:text-slate-400"
                  placeholder="e.g., US"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#F9A8D4] to-[#EC4899] text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                {mutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Predicting...</span>
                  </>
                ) : (
                  <>
                    <span>Predict Return Risk</span>
                    <span className="text-lg">✨</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {mutation.isError && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)] border border-red-200/50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-red-900 font-semibold mb-1">Prediction Error</h3>
                <p className="text-red-700 text-sm">
                  {mutation.error?.message || "Failed to predict return risk. Please try again."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Prediction Result */}
        {prediction && prediction.predictions.length > 0 && (
          <RiskResultCard prediction={prediction.predictions[0]} />
        )}

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-br from-[#FFE4E6] via-[#FFF8F1] to-white rounded-3xl p-6 shadow-[0_18px_45px_rgba(236,72,153,0.1)] border border-pink-200/30">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            💡 How it works
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Our model analyzes product attributes, pricing, discounts, and customer demographics to predict return probability. 
            Higher prices, larger discounts, and younger customers typically correlate with increased return risk.
          </p>
        </div>
      </div>
    </div>
  );
}
