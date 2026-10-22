import React from "react";
import Link from "next/link";
import {
  Star,
  MapPin,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { CandidateProfile } from "@/lib/types";
import { formatINR } from "@/lib/payments";

interface SpeakerCardProps {
  speaker: CandidateProfile & {
    distanceKm?: number | null;
    offeringsCount?: number;
    sampleOfferings?: any[];
  };
}

export default function SpeakerCard({ speaker }: SpeakerCardProps) {
  const isVerified = speaker.verificationStatus === "approved";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-float transition duration-200 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Top Badges & Image Row */}
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="relative">
                <img
                  src={
                    speaker.avatarUrl ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                  }
                  alt={speaker.fullName || "Candidate"}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-sm"
                />
                {isVerified && (
                  <span
                    className="absolute -bottom-1 -right-1 bg-teal-500 text-white p-0.5 rounded-full shadow"
                    title="Verified Academic Speaker"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-bold text-navy-900 text-base group-hover:text-brand-600 transition">
                    {speaker.fullName}
                  </h3>
                  {speaker.isFeatured && (
                    <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-slate-600 line-clamp-1 mt-0.5">
                  {speaker.professionalTitle}
                </p>
                <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                  <span className="flex items-center space-x-1 text-amber-500 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{speaker.ratingAvg.toFixed(2)}</span>
                  </span>
                  <span>•</span>
                  <span>{speaker.reviewsCount} verified reviews</span>
                </div>
              </div>
            </div>
          </div>

          {/* Education & Experience info */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center space-x-2 truncate">
              <GraduationCap className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="truncate">{speaker.highestQualification}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-500">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  {speaker.city}, {speaker.state}
                </span>
              </div>
              {speaker.distanceKm !== null && speaker.distanceKm !== undefined && (
                <span className="text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                  {speaker.distanceKm.toFixed(0)} km away
                </span>
              )}
            </div>
          </div>

          {/* Core Skills Chips */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {speaker.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
            {speaker.skills.length > 3 && (
              <span className="text-[11px] text-slate-400 font-medium px-1 py-0.5">
                +{speaker.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Pricing & Actions */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
            Seminar Fee
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-base font-bold text-navy-900">
              {formatINR(speaker.baseSeminarFee)}
            </span>
            <span className="text-[11px] text-slate-500">/ session</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href={`/speakers/${speaker.id}`}
            className="inline-flex items-center space-x-1 text-xs font-semibold px-3 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
          >
            <span>View Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
