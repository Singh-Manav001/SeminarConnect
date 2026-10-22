"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Star,
  MapPin,
  CheckCircle,
  GraduationCap,
  Calendar,
  Clock,
  Users,
  Video,
  FileText,
  Heart,
  MessageSquare,
  ShieldCheck,
  Award,
  ArrowRight,
  BookOpen,
  IndianRupee,
  Share2,
} from "lucide-react";
import { formatINR } from "@/lib/payments";
import { CandidateProfile, SeminarOffering, ReviewItem } from "@/lib/types";

export default function SpeakerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const candidateId = params.id as string;

  const [speaker, setSpeaker] = useState<CandidateProfile | null>(null);
  const [offerings, setOfferings] = useState<SeminarOffering[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  // Booking modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState<SeminarOffering | null>(null);
  const [eventDate, setEventDate] = useState("2026-11-20");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [format, setFormat] = useState<"online" | "offline" | "hybrid">("hybrid");
  const [audienceCount, setAudienceCount] = useState(100);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    // Fetch candidate
    fetch(`/api/speakers?q=`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.speakers?.find(
          (s: any) => s.id === candidateId || s.profileId === candidateId
        );
        if (found) {
          setSpeaker(found);
          setFormat(found.preferredDeliveryFormat);
        }
      });

    // Fetch offerings
    fetch(`/api/seminars?candidateId=${candidateId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.offerings) {
          setOfferings(data.offerings);
          if (data.offerings.length > 0) {
            setSelectedOffering(data.offerings[0]);
          }
        }
      });

    // Fetch reviews
    fetch(`/api/reviews?candidateId=${candidateId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) setReviews(data.reviews);
      })
      .finally(() => setLoading(false));

    // Check favorite status if principal logged in
    if (user?.role === "principal") {
      fetch("/api/favorites")
        .then((res) => res.json())
        .then((data) => {
          if (data.favorites?.includes(candidateId)) {
            setIsFavorite(true);
          }
        })
        .catch(() => {});
    }
  }, [candidateId, user]);

  const handleToggleFavorite = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsFavorite(data.isFavorite);
      }
    } catch (err) {
      console.error("Favorite toggle failed", err);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "principal") {
      setBookingError("Only registered institution principals can submit booking requests.");
      return;
    }

    setBookingLoading(true);
    setBookingError(null);

    try {
      const payload = {
        offeringId: selectedOffering?.id,
        candidateId: speaker?.id,
        seminarTitle: selectedOffering?.title || `Academic Seminar by ${speaker?.fullName}`,
        eventDate,
        startTime,
        endTime,
        deliveryFormat: format,
        audienceCount: Number(audienceCount),
        city: speaker?.city,
        state: speaker?.state,
        postalCode: speaker?.postalCode,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      setBookingSuccess(data.booking.bookingReference);
      setTimeout(() => {
        router.push(`/bookings/${data.booking.id}`);
      }, 1500);
    } catch (err: any) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading speaker profile...
      </div>
    );
  }

  if (!speaker) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-navy-900">Speaker Profile Not Found</h2>
        <p className="text-xs text-slate-500">The speaker candidate you requested does not exist.</p>
        <Link
          href="/speakers"
          className="inline-block px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
        >
          Back to Speakers Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
              <div className="relative shrink-0">
                <img
                  src={
                    speaker.avatarUrl ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80"
                  }
                  alt={speaker.fullName}
                  className="w-28 h-28 rounded-2xl object-cover border-2 border-brand-100 shadow"
                />
                {speaker.verificationStatus === "approved" && (
                  <span
                    className="absolute -bottom-2 -right-2 bg-teal-500 text-white p-1 rounded-full shadow-md"
                    title="Verified Academic Speaker"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl font-extrabold text-navy-900">{speaker.fullName}</h1>
                  {speaker.verificationStatus === "approved" && (
                    <span className="text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Expert</span>
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-slate-700">{speaker.professionalTitle}</p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center space-x-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{speaker.ratingAvg.toFixed(2)}</span>
                    <span className="text-slate-400 font-normal">({speaker.reviewsCount} reviews)</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {speaker.city}, {speaker.state}
                    </span>
                  </span>
                  <span>•</span>
                  <span>{speaker.experienceYears} Years Experience</span>
                </div>

                {/* Badges / Languages */}
                <div className="pt-2 flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  {speaker.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Primary CTA */}
            <div className="flex flex-col sm:items-end justify-center shrink-0 space-y-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="text-center sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                  Base Seminar Fee
                </span>
                <span className="text-2xl font-black text-navy-900">
                  {formatINR(speaker.baseSeminarFee)}
                </span>
                <span className="text-xs text-slate-500 block">/ session</span>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={handleToggleFavorite}
                  className={`p-3 rounded-xl border transition ${
                    isFavorite
                      ? "bg-rose-50 border-rose-200 text-rose-600"
                      : "bg-white border-slate-200 text-slate-600 hover:text-rose-600"
                  }`}
                  title={isFavorite ? "Saved in favorites" : "Add to favorites"}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                </button>

                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition text-sm flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request Booking</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Left Details, Right Logistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Details (Catalog & Bio & Reviews) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
              <h2 className="text-base font-bold text-navy-900 mb-3">About the Speaker</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {speaker.bio || "No biography provided."}
              </p>
            </div>

            {/* Seminar Catalog Packages */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-150">
                <div>
                  <h2 className="text-base font-bold text-navy-900">Seminar Catalog & Modules</h2>
                  <p className="text-xs text-slate-500">
                    Syllabus, learning outcomes, and formats offered by {speaker.fullName}
                  </p>
                </div>
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
                  {offerings.length} Packages
                </span>
              </div>

              <div className="space-y-4">
                {offerings.map((offering) => (
                  <div
                    key={offering.id}
                    className="p-5 rounded-xl border border-slate-200 hover:border-brand-300 transition space-y-3 bg-slate-50/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                          {offering.deliveryFormat.toUpperCase()}
                        </span>
                        <h3 className="font-bold text-navy-900 text-base mt-1">
                          {offering.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {offering.description}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <span className="text-base font-bold text-navy-900">
                          {formatINR(offering.basePrice)}
                        </span>
                        <span className="text-[11px] text-slate-500 block">per session</span>
                      </div>
                    </div>

                    {/* Learning outcomes */}
                    {offering.learningOutcomes?.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                          Key Learning Outcomes:
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                          {offering.learningOutcomes.map((item, i) => (
                            <li key={i} className="flex items-start space-x-1.5">
                              <span className="text-teal-600 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{offering.sessionDurationMinutes} Mins Duration</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>Up to {offering.maxAudienceSize} Students</span>
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedOffering(offering);
                          setBookingModalOpen(true);
                        }}
                        className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
                      >
                        <span>Select this package</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Reviews Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
              <h2 className="text-base font-bold text-navy-900">
                Institutional Reviews ({reviews.length})
              </h2>

              {reviews.length === 0 ? (
                <p className="text-xs text-slate-500 italic">
                  No public reviews submitted yet. Be the first school to review this speaker after conducting a seminar!
                </p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="py-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-navy-900">{rev.principalName}</h4>
                          <p className="text-[11px] text-slate-500">{rev.institutionName}</p>
                        </div>
                        <div className="flex items-center text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        &ldquo;{rev.reviewText}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Credentials, Travel Logistics & Policies */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
              <h3 className="font-bold text-sm text-navy-900 pb-2 border-b border-slate-150">
                Logistics & Travel Policy
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">
                    Base Campus Location
                  </span>
                  <span className="font-semibold text-slate-800">
                    {speaker.city}, {speaker.state} ({speaker.postalCode})
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">
                    Preferred Travel Radius
                  </span>
                  <span className="font-semibold text-slate-800">
                    Within {speaker.travelRadiusKm} km for On-Campus Seminars
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">
                    Supported Delivery Modes
                  </span>
                  <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded capitalize">
                    {speaker.preferredDeliveryFormat} Mode
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">
                    Spoken Languages
                  </span>
                  <span className="font-semibold text-slate-800">
                    {speaker.languages.join(", ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
              <h3 className="font-bold text-sm text-navy-900 pb-2 border-b border-slate-150">
                Verified Credentials
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start space-x-2.5">
                  <GraduationCap className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      {speaker.highestQualification}
                    </span>
                    <span className="text-[11px] text-slate-400">Academic Background</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      Identity & Background Cleared
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Vetted for educational campus conduct
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-navy-900">
                  Request Seminar Booking
                </h3>
                <p className="text-xs text-slate-500">
                  With {speaker.fullName}
                </p>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {bookingError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {bookingError}
              </div>
            )}

            {bookingSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                Booking request {bookingSuccess} created! Redirecting to booking tracker...
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Selected Seminar Package
                </label>
                <select
                  value={selectedOffering?.id || ""}
                  onChange={(e) => {
                    const off = offerings.find((o) => o.id === e.target.value);
                    if (off) setSelectedOffering(off);
                  }}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                >
                  {offerings.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.title} — {formatINR(o.basePrice)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Requested Date
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Audience Size
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={2000}
                    value={audienceCount}
                    onChange={(e) => setAudienceCount(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Delivery Format
                </label>
                <select
                  value={format}
                  onChange={(e: any) => setFormat(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                >
                  <option value="offline">On-Campus / Offline (Speaker visits school)</option>
                  <option value="online">Virtual / Online Webinar</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Base Seminar Fee:</span>
                  <span className="font-semibold text-navy-900">
                    {formatINR(selectedOffering?.basePrice || speaker.baseSeminarFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Escrow Fee (10%):</span>
                  <span>
                    {formatINR(Math.round(((selectedOffering?.basePrice || speaker.baseSeminarFee) * 10) / 100))}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 pt-1">
                  *Travel allowance calculated transparently if outside speaker&apos;s local municipal area.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold disabled:opacity-50"
                >
                  {bookingLoading ? "Submitting..." : "Send Booking Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
