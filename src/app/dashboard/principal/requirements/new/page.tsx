"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { PlusCircle, ArrowLeft, Building, AlertCircle } from "lucide-react";
import { Category } from "@/lib/types";

export default function NewSeminarRequirementPage() {
  const router = useRouter();
  const { user, institution, isLoading } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("2026-11-28");
  const [startTime, setStartTime] = useState("10:00");
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [deliveryFormat, setDeliveryFormat] = useState<"online" | "offline" | "hybrid">("hybrid");
  const [audienceSize, setAudienceSize] = useState(150);
  const [budget, setBudget] = useState(10000);
  const [preferredLanguage, setPreferredLanguage] = useState("English & Hindi");
  const [city, setCity] = useState("New Delhi");
  const [state, setState] = useState("Delhi");
  const [postalCode, setPostalCode] = useState("110022");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "principal")) {
      router.push("/login");
      return;
    }
    if (institution) {
      setCity(institution.city);
      setState(institution.state);
      setPostalCode(institution.postalCode);
    }
    fetch("/api/categories")
      .then((res) => res.json())
      .then((d) => {
        if (d.categories) {
          setCategories(d.categories);
          if (d.categories.length > 0) setCategoryId(d.categories[0].id);
        }
      });
  }, [user, institution, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          categoryId,
          description,
          targetDate,
          startTime,
          durationMinutes: Number(durationMinutes),
          deliveryFormat,
          city,
          state,
          postalCode,
          audienceSize: Number(audienceSize),
          budget: Number(budget),
          preferredLanguage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed posting requirement");

      router.push("/dashboard/principal");
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
            href="/dashboard/principal"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Principal Dashboard</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900">
              Post Seminar Requirement (RFP)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Broadcast your auditorium dates, student audience, and required topics to verified candidates.
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
                Seminar Requirement Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Hands-on Generative AI & Cyber Safety Workshop for Grade 11-12"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Academic Category</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Delivery Format</label>
                <select
                  value={deliveryFormat}
                  onChange={(e: any) => setDeliveryFormat(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                >
                  <option value="hybrid">Hybrid</option>
                  <option value="offline">On-Campus / Offline (Speaker travels)</option>
                  <option value="online">Online / Virtual Webinar</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Date</label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
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
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Audience Size</label>
                <input
                  type="number"
                  min={10}
                  value={audienceSize}
                  onChange={(e) => setAudienceSize(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Budget (INR ₹)
                </label>
                <input
                  type="number"
                  min={1000}
                  step={500}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Preferred Language
                </label>
                <input
                  type="text"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  placeholder="English, Hindi"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Detailed Requirement & Student Learning Goals
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your student background, key concepts to cover, hands-on lab requirements, and auditorium setup..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
              ></textarea>
            </div>

            <div className="pt-3 border-t border-slate-150 flex justify-end space-x-2">
              <Link
                href="/dashboard/principal"
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow disabled:opacity-50"
              >
                {loading ? "Publishing..." : "Publish Requirement to Board"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
