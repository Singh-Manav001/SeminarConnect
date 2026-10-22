"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { PlusCircle, ArrowLeft, AlertCircle } from "lucide-react";
import { Category } from "@/lib/types";

export default function NewSeminarPackagePage() {
  const router = useRouter();
  const { user, candidate, isLoading } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [outcomesText, setOutcomesText] = useState(
    "Deep dive into foundational and advanced principles\nLive demonstrations and practical workshop exercises\nIndustry career pathways and interactive Q&A"
  );
  const [targetAudience, setTargetAudience] = useState("High School (Class 9-12) & Undergraduates");
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState(120);
  const [maxAudienceSize, setMaxAudienceSize] = useState(150);
  const [deliveryFormat, setDeliveryFormat] = useState<"online" | "offline" | "hybrid">("hybrid");
  const [basePrice, setBasePrice] = useState(8500);
  const [travelChargePerKm, setTravelChargePerKm] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "candidate")) {
      router.push("/login");
      return;
    }
    fetch("/api/categories")
      .then((res) => res.json())
      .then((d) => {
        if (d.categories) {
          setCategories(d.categories);
          if (d.categories.length > 0) setCategoryId(d.categories[0].id);
        }
      });
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const outcomes = outcomesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/seminars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          categoryId,
          description,
          learningOutcomes: outcomes.length > 0 ? outcomes : ["Hands-on seminar learning outcomes"],
          targetAudience,
          sessionDurationMinutes: Number(sessionDurationMinutes),
          maxAudienceSize: Number(maxAudienceSize),
          deliveryFormat,
          basePrice: Number(basePrice),
          travelChargePerKm: Number(travelChargePerKm),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed creating seminar offering");

      router.push("/dashboard/candidate");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <Link
            href="/dashboard/candidate"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Candidate Dashboard</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900">
              Create New Seminar Package
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Design a structured offering with clear learning outcomes and transparent pricing.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Seminar Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern Full-Stack Web Architecture & Cloud Microservices"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Topic Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Delivery Format
                </label>
                <select
                  value={deliveryFormat}
                  onChange={(e: any) => setDeliveryFormat(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                >
                  <option value="hybrid">Hybrid (Both On-Campus & Online)</option>
                  <option value="offline">Offline / On-Campus Only</option>
                  <option value="online">Online / Virtual Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Syllabus & Course Description
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a comprehensive summary of topics covered in the session..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
              ></textarea>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Key Learning Outcomes (One per line)
              </label>
              <textarea
                rows={3}
                required
                value={outcomesText}
                onChange={(e) => setOutcomesText(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-sans"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  required
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min={30}
                  max={480}
                  value={sessionDurationMinutes}
                  onChange={(e) => setSessionDurationMinutes(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Max Audience Size
                </label>
                <input
                  type="number"
                  min={10}
                  max={5000}
                  value={maxAudienceSize}
                  onChange={(e) => setMaxAudienceSize(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Base Seminar Fee (INR ₹)
                </label>
                <input
                  type="number"
                  min={500}
                  step={500}
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Travel Surcharge (₹ per km)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={travelChargePerKm}
                  onChange={(e) => setTravelChargePerKm(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-150 flex justify-end space-x-2">
              <Link
                href="/dashboard/candidate"
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow disabled:opacity-50"
              >
                {loading ? "Publishing..." : "Add to Catalog"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
