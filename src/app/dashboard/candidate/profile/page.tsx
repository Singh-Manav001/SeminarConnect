"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function CandidateProfileEdit() {
  const { user, candidate } = useAuth();
  const [name, setName] = useState(user?.fullName || "");
  const [title, setTitle] = useState(candidate?.professionalTitle || "");
  const [fee, setFee] = useState(candidate?.baseSeminarFee || 8000);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        <Link
          href="/dashboard/candidate"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Speaker Dashboard</span>
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-4">
          <h1 className="text-xl font-bold text-navy-900">Edit Faculty Profile</h1>

          {saved && (
            <div className="p-3 rounded-lg bg-teal-50 text-teal-800 text-xs font-semibold">
              Profile details updated successfully.
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Professional Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Base Seminar Rate (₹)</label>
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
