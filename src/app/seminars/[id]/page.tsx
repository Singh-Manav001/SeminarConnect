"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Clock,
  Users,
  Calendar,
  CheckCircle,
  GraduationCap,
  MapPin,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Star,
} from "lucide-react";
import { formatINR } from "@/lib/payments";
import { SeminarOffering } from "@/lib/types";

export default function SeminarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const offeringId = params.id as string;

  const [offering, setOffering] = useState<SeminarOffering | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/seminars")
      .then((res) => res.json())
      .then((data) => {
        const found = data.offerings?.find((o: any) => o.id === offeringId);
        if (found) setOffering(found);
      })
      .finally(() => setLoading(false));
  }, [offeringId]);

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Loading seminar curriculum...</div>;
  }

  if (!offering) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-navy-900">Seminar Offering Not Found</h2>
        <Link href="/speakers" className="text-xs font-bold text-brand-600">
          ← Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <Link
            href="/speakers"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Speakers</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-150">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                {offering.deliveryFormat} Seminar
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-2">
                {offering.title}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Category: <span className="font-semibold text-slate-700">{offering.categoryName}</span>
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Session Fee
              </span>
              <span className="text-3xl font-black text-navy-900">
                {formatINR(offering.basePrice)}
              </span>
              <span className="text-xs text-slate-500 block">per session</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">
                Duration
              </span>
              <div className="flex items-center space-x-1 font-semibold text-slate-800 mt-1">
                <Clock className="w-4 h-4 text-brand-600" />
                <span>{offering.sessionDurationMinutes} Minutes</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">
                Audience Capacity
              </span>
              <div className="flex items-center space-x-1 font-semibold text-slate-800 mt-1">
                <Users className="w-4 h-4 text-teal-600" />
                <span>Up to {offering.maxAudienceSize} Students</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">
                Target Audience
              </span>
              <p className="font-semibold text-slate-800 mt-1 truncate">
                {offering.targetAudience}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-navy-900">Seminar Overview & Scope</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {offering.description}
            </p>
          </div>

          {/* Learning Outcomes */}
          {offering.learningOutcomes?.length > 0 && (
            <div className="space-y-3 pt-2">
              <h2 className="text-sm font-bold text-navy-900">Syllabus & Core Learning Outcomes</h2>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {offering.learningOutcomes.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Speaker profile link & booking action */}
          <div className="pt-6 border-t border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              href={`/speakers/${offering.candidateId}`}
              className="text-xs font-bold text-slate-700 hover:text-brand-600 flex items-center space-x-1.5"
            >
              <span>View Speaker Profile & Reviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href={`/speakers/${offering.candidateId}`}
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition text-center"
            >
              Request Booking for This Seminar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
