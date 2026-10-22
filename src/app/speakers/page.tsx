"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SpeakerCard from "@/components/shared/SpeakerCard";
import {
  Search,
  Filter,
  MapPin,
  SlidersHorizontal,
  X,
  Star,
  CheckCircle,
  RotateCcw,
  BookOpen,
  ArrowUpDown,
  Laptop,
} from "lucide-react";
import { Category } from "@/lib/types";

function SpeakersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter state synced with URL
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [locationInput, setLocationInput] = useState(searchParams.get("location") || "");
  const [radiusKm, setRadiusKm] = useState(searchParams.get("radius") || "150");
  const [format, setFormat] = useState(searchParams.get("format") || "all");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
  const [minExp, setMinExp] = useState(searchParams.get("minExp") || "");
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get("verified") === "true");
  const [sort, setSort] = useState(searchParams.get("sort") || "relevance");

  const [categories, setCategories] = useState<Category[]>([]);
  const [speakers, setSpeakers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch categories
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  // Fetch filtered speakers
  const fetchSpeakers = () => {
    setLoading(true);
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (selectedCategory) params.set("category", selectedCategory);
    if (locationInput) params.set("location", locationInput);
    if (radiusKm && locationInput) params.set("radius", radiusKm);
    if (format && format !== "all") params.set("format", format);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minRating) params.set("minRating", minRating);
    if (minExp) params.set("minExp", minExp);
    if (verifiedOnly) params.set("verified", "true");
    if (sort) params.set("sort", sort);

    // Update browser URL
    router.replace(`/speakers?${params.toString()}`);

    fetch(`/api/speakers?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setSpeakers(data.speakers || []);
      })
      .catch((err) => console.error("Failed fetching speakers:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSpeakers();
  }, [selectedCategory, format, verifiedOnly, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSpeakers();
  };

  const resetAllFilters = () => {
    setQuery("");
    setSelectedCategory("");
    setLocationInput("");
    setRadiusKm("150");
    setFormat("all");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setMinExp("");
    setVerifiedOnly(false);
    setSort("relevance");
    router.replace("/speakers");

    fetch("/api/speakers")
      .then((res) => res.json())
      .then((data) => setSpeakers(data.speakers || []));
  };

  const hasActiveFilters =
    Boolean(query) ||
    Boolean(selectedCategory) ||
    Boolean(locationInput) ||
    format !== "all" ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    Boolean(minRating) ||
    Boolean(minExp) ||
    verifiedOnly;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-600">
            Database-Backed Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
            Discover Verified Academic Speakers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Connect with subject matter experts, researchers, and professional trainers for school & college seminars.
          </p>
        </div>

        {/* Top Search Bar & Sort Row */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Keyword Search */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search topics, skills, or speaker names..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
              />
            </div>

            {/* Location / City Proximity */}
            <div className="md:col-span-4 relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Your City (e.g. Delhi, Bengaluru, Pune)"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
              />
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-3 flex items-center space-x-2">
              <button
                type="submit"
                className="flex-1 py-2 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow transition"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700"
                title="Filter Options"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold text-[11px]">Active Filters:</span>
              {selectedCategory && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 font-medium">
                  <span>{categories.find((c) => c.id === selectedCategory)?.name || "Category"}</span>
                  <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => setSelectedCategory("")} />
                </span>
              )}
              {locationInput && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 font-medium">
                  <span>Near {locationInput}</span>
                  <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => setLocationInput("")} />
                </span>
              )}
              {format !== "all" && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium capitalize">
                  <span>Format: {format}</span>
                  <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => setFormat("all")} />
                </span>
              )}
              {verifiedOnly && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium">
                  <span>Verified Only</span>
                  <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => setVerifiedOnly(false)} />
                </span>
              )}
              <button
                onClick={resetAllFilters}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 ml-auto flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-150">
                <h3 className="font-bold text-sm text-navy-900 flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-brand-600" />
                  <span>Filter Speakers</span>
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="text-[11px] font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* 1. Category Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                >
                  <option value="">All Categories (12 Topics)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Delivery Format */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Delivery Format
                </label>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      checked={format === "all"}
                      onChange={() => setFormat("all")}
                      className="text-brand-600"
                    />
                    <span>All Formats (Hybrid / Online / Offline)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      checked={format === "offline"}
                      onChange={() => setFormat("offline")}
                      className="text-brand-600"
                    />
                    <span>Offline (On-Campus Delivery)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      checked={format === "online"}
                      onChange={() => setFormat("online")}
                      className="text-brand-600"
                    />
                    <span>Online (Virtual Webinar)</span>
                  </label>
                </div>
              </div>

              {/* 3. Radius Distance (km) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Travel Radius
                  </label>
                  <span className="text-xs font-semibold text-brand-600">{radiusKm} km</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(e.target.value)}
                  className="w-full accent-brand-600 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Virtual/online sessions remain discoverable nationwide.
                </p>
              </div>

              {/* 4. Budget Range (INR) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Seminar Fee (₹)
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900"
                  />
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={fetchSpeakers}
                  className="mt-2 w-full py-1 text-xs font-semibold text-brand-600 bg-brand-50 rounded hover:bg-brand-100 transition"
                >
                  Apply Fee Range
                </button>
              </div>

              {/* 5. Rating & Verified status */}
              <div className="space-y-3 pt-3 border-t border-slate-150">
                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded text-brand-600"
                  />
                  <span className="font-semibold text-slate-800">
                    Verified Academic Credential Only
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Speaker Cards Grid */}
          <main className="lg:col-span-3 space-y-4">
            {/* Sorting bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 text-xs text-slate-500 border-b border-slate-200 gap-2">
              <span className="font-semibold text-slate-700">
                Showing {speakers.length} qualified academic speakers
              </span>

              <div className="flex items-center space-x-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-2 py-1 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="relevance">Relevance & Featured</option>
                  <option value="distance">Distance from Campus</option>
                  <option value="rating">Highest Rating</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="experience">Years of Experience</option>
                  <option value="popularity">Most Reviewed</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-6 bg-white rounded-2xl border border-slate-200 animate-pulse space-y-4"
                  >
                    <div className="flex space-x-4">
                      <div className="w-16 h-16 rounded-xl bg-slate-200"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-10 bg-slate-100 rounded"></div>
                  </div>
                ))}
              </div>
            ) : speakers.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-navy-900">No matching speakers found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try broadening your location radius, adjusting budget filters, or clearing specific topic queries.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {speakers.map((speaker) => (
                  <SpeakerCard key={speaker.id} speaker={speaker} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function SpeakersPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading academic speakers directory...</div>}>
      <SpeakersContent />
    </Suspense>
  );
}
