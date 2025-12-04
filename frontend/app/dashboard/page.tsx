"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import MetricCard from "@/components/MetricCard";
import ReturnsByCategoryChart from "@/components/ReturnsByCategoryChart";
import RevenueByDepartmentChart from "@/components/RevenueByDepartmentChart";
import TopBrandsChart from "@/components/TopBrandsChart";
import AgeDistributionChart from "@/components/AgeDistributionChart";

const API_BASE_URL = "http://localhost:8000";

type SummaryResponse = {
  total_revenue: number;
  overall_return_rate: number;
  top_category_by_revenue: string;
  top_category_by_return_rate: string;
};

type ReturnsByCategory = {
  category: string;
  return_rate: number;
};

type RevenueByDepartment = {
  department: string;
  revenue: number;
  order_count: number;
};


type RevenueByBrand = {
  brand: string;
  revenue: number;
  product_count: number;
};

type AgeDistribution = {
  age_range: string;
  customer_count: number;
  avg_order_value: number;
};

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading, error: summaryError } = useQuery<SummaryResponse>({
    queryKey: ["summary"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/analytics/summary`);
      return response.data;
    },
    retry: 2,
  });

  const { data: categoryData, isLoading: categoryLoading, error: categoryError } = useQuery<ReturnsByCategory[]>({
    queryKey: ["returns-by-category"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/analytics/returns-by-category`);
      return response.data.map((item: any) => ({
        category: item.category,
        return_rate: item.return_rate,
      }));
    },
    retry: 2,
  });

  const { data: departmentRevenue, isLoading: deptLoading } = useQuery<RevenueByDepartment[]>({
    queryKey: ["revenue-by-department"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/analytics/revenue-by-department`);
      return response.data;
    },
    retry: 2,
  });


  const { data: topBrands, isLoading: brandsLoading } = useQuery<RevenueByBrand[]>({
    queryKey: ["revenue-by-brand"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/analytics/revenue-by-brand?limit=10`);
      return response.data;
    },
    retry: 2,
  });

  const { data: ageDistribution, isLoading: ageLoading } = useQuery<AgeDistribution[]>({
    queryKey: ["age-distribution"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/analytics/age-distribution`);
      return response.data;
    },
    retry: 2,
  });

  const isLoading = summaryLoading || categoryLoading;
  const hasError = summaryError || categoryError;
  const isConnected = !hasError && !isLoading;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F1] flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)] border border-white/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-pink-200 rounded-full animate-ping" />
            </div>
            <span className="text-slate-700 font-medium">Loading runway metrics…</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="min-h-screen bg-[#FFF8F1] flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)] border border-red-200/50">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xl">⚠️</span>
            </div>
            <div className="flex-1">
              <h3 className="text-red-900 font-semibold text-lg mb-2">Error loading data</h3>
              <p className="text-red-700 text-sm mb-4">
                {summaryError?.message || categoryError?.message || "Failed to connect to backend"}
              </p>
              <p className="text-red-600 text-sm">
                Make sure the backend is running on http://localhost:8000
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F1] text-slate-900">
      {/* App Shell Header */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-pink-100/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold shadow-sm">
                Runway Outcomes Lab
              </span>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Collections Analytics Dashboard
                </h1>
                <p className="text-sm text-slate-600 mt-0.5">
                  Track runway performance and returns in real-time
                </p>
              </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 ${
              isConnected
                ? 'bg-green-100 text-green-700 border border-green-200/50'
                : 'bg-red-100 text-red-700 border border-red-200/50'
            }`}>
              API: {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            label="Total Revenue"
            value={`$${summary?.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`}
            helper="Total revenue from completed orders"
            tone="default"
          />
          <MetricCard
            label="Overall Return Rate"
            value={`${((summary?.overall_return_rate || 0) * 100).toFixed(1)}%`}
            helper="Percentage of items returned"
            tone="warning"
          />
          <MetricCard
            label="Top Category (Revenue)"
            value={summary?.top_category_by_revenue || "N/A"}
            helper="Category with highest revenue"
            tone="default"
          />
          <MetricCard
            label="Top Category (Returns)"
            value={summary?.top_category_by_return_rate || "N/A"}
            helper="Category with highest return rate"
            tone="warning"
          />
        </div>

        {/* Charts Grid - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Return Rate by Category */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)] border border-white/50">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  Return Rate by Category
                </h3>
                <p className="text-sm text-slate-600">
                  Spot risky categories before the next drop.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-medium border border-pink-200/50">
                Risk Analysis
              </span>
            </div>
            {categoryData && categoryData.length > 0 ? (
              <ReturnsByCategoryChart data={categoryData} />
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-slate-400">No data available</p>
              </div>
            )}
          </div>

          {/* Revenue by Department */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)] border border-white/50">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  Revenue by Department
                </h3>
                <p className="text-sm text-slate-600">
                  See which departments drive the most revenue.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-medium border border-pink-200/50">
                Revenue
              </span>
            </div>
            {departmentRevenue && departmentRevenue.length > 0 ? (
              <RevenueByDepartmentChart data={departmentRevenue} />
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-slate-400">No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Charts Grid - Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Brands */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)] border border-white/50">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  Top Brands by Revenue
                </h3>
                <p className="text-sm text-slate-600">
                  Leading brands driving sales performance.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-medium border border-pink-200/50">
                Brands
              </span>
            </div>
            {topBrands && topBrands.length > 0 ? (
              <TopBrandsChart data={topBrands} />
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-slate-400">No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Charts Grid - Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Age Distribution */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)] border border-white/50">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  Customer Age Distribution
                </h3>
                <p className="text-sm text-slate-600">
                  Understand your customer demographics.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-medium border border-pink-200/50">
                Demographics
              </span>
            </div>
            {ageDistribution && ageDistribution.length > 0 ? (
              <AgeDistributionChart data={ageDistribution} />
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-slate-400">No data available</p>
              </div>
            )}
          </div>

          {/* Insight Cards */}
          <div className="space-y-6">
            {/* Quick Insight Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)] border border-white/50">
              <h4 className="text-lg font-bold text-slate-900 mb-3">
                Quick insight
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed mb-3">
                Focus on categories with{" "}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-medium">
                  high revenue
                </span>{" "}
                and{" "}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                  rising return rates
                </span>
                . These represent the biggest risk to profitability.
              </p>
            </div>

            {/* Next Step Card */}
            <div className="bg-gradient-to-br from-[#FFE4E6] via-[#FFF8F1] to-white rounded-3xl p-6 shadow-[0_18px_45px_rgba(236,72,153,0.1)] border border-pink-200/30">
              <h4 className="text-lg font-bold text-slate-900 mb-3">
                Next step
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                Test new product drops before launch. Predict return risk and optimize pricing strategy.
              </p>
              <Link
                href="/simulator"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F9A8D4] to-[#EC4899] text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                <span>Open simulator</span>
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
