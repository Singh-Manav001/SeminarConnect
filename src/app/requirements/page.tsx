"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  ArrowRight,
  School,
  PlusCircle,
} from "lucide-react";
import { formatINR } from "@/lib/payments";
import { SeminarRequirement } from "@/lib/types";

export default function RequirementsBoardPage() {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState<SeminarRequirement[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/requirements")
      .then((res) => res.json())
      .then((data) => {
        if (data.requirements) setRequirements(data.requirements);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = requirements.filter((r) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.categoryName?.toLowerCase().includes(q) ||
      r.institutionName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-brand-600">
              Institutional Request Board
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
              Open Seminar Requirements
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Schools and colleges actively seeking expert guest speakers and STEM workshops.
            </p>
          </div>

          {user?.role === "principal" && (
            <Link
              href="/dashboard/principal/requirements/new"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Requirement</span>
            </Link>
          )}
        </div>

        {/* Search Filter */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by topic, institution, or keywords..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
            />
          </div>
        </div>

        {/* Requirements Grid */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">Loading open requirements...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-navy-900">No open requirements found</h3>
            <p className="text-xs text-slate-500">Check back later or adjust your search filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-card transition p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full">
                      {req.categoryName}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {req.deliveryFormat}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-navy-900">{req.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {req.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <School className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-800">{req.institutionName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{req.city}, {req.state}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{req.targetDate}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{req.audienceSize} Students</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Institution Budget
                      </span>
                      <span className="text-base font-black text-brand-700">
                        {formatINR(req.budget)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
