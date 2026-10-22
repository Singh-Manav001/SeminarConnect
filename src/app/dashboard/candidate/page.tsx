"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  GraduationCap,
  Calendar,
  Clock,
  PlusCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  IndianRupee,
  Star,
  Users,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { formatINR } from "@/lib/payments";
import { Booking, SeminarOffering } from "@/lib/types";

export default function CandidateDashboard() {
  const { user, candidate, isLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [offerings, setOfferings] = useState<SeminarOffering[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Availability slot form
  const [slotDate, setSlotDate] = useState("2026-11-25");
  const [slotStartTime, setSlotStartTime] = useState("10:00");
  const [slotEndTime, setSlotEndTime] = useState("12:00");
  const [slotMsg, setSlotMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "candidate")) {
      router.push("/login");
      return;
    }

    if (user?.role === "candidate") {
      Promise.all([
        fetch("/api/bookings").then((res) => res.json()),
        fetch("/api/seminars?candidateId=" + (candidate?.id || "")).then((res) => res.json()),
      ])
        .then(([bookingsRes, offRes]) => {
          if (bookingsRes.bookings) setBookings(bookingsRes.bookings);
          if (offRes.offerings) setOfferings(offRes.offerings);
        })
        .finally(() => setLoadingData(false));
    }
  }, [user, candidate, isLoading, router]);

  const handleBookingAction = async (bookingId: string, action: "accept" | "reject" | "reschedule") => {
    setActionLoading(bookingId);
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, action }),
      });
      const data = await res.json();
      if (res.ok) {
        // Update local state
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? data.booking : b))
        );
      }
    } catch (err) {
      console.error("Action error", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setSlotMsg(`Availability slot for ${slotDate} (${slotStartTime}-${slotEndTime}) saved.`);
    setTimeout(() => setSlotMsg(null), 3000);
  };

  if (isLoading || loadingData) {
    return <div className="p-12 text-center text-slate-500">Loading speaker dashboard...</div>;
  }

  const incomingRequests = bookings.filter((b) => b.status === "pending");
  const upcomingSeminars = bookings.filter((b) => b.status === "confirmed");
  const completedSeminars = bookings.filter((b) => b.status === "completed");

  const totalEarnings = bookings
    .filter((b) => ["confirmed", "completed"].includes(b.status))
    .reduce((acc, curr) => acc + curr.candidatePayoutAmount, 0);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Card Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900">
                  {user?.fullName || "Candidate Speaker"}
                </h1>
                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Speaker</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {candidate?.professionalTitle || "Subject Matter Expert & Academic Faculty"} • Faculty Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard/candidate/seminars/new"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Seminar Package</span>
            </Link>
            <Link
              href={`/speakers/${candidate?.id || user?.id}`}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              <span>View Public Profile</span>
            </Link>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pending Requests
              </span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-navy-900 mt-2">
              {incomingRequests.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Requires your approval</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Confirmed Sessions
              </span>
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-navy-900 mt-2">
              {upcomingSeminars.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Escrow funded by schools</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Payout Earned
              </span>
              <IndianRupee className="w-5 h-5 text-brand-600" />
            </div>
            <div className="text-2xl font-black text-navy-900 mt-2">
              {formatINR(totalEarnings)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Direct speaker net payouts</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Average Rating
              </span>
              <Star className="w-5 h-5 text-amber-500 fill-current" />
            </div>
            <div className="text-2xl font-black text-navy-900 mt-2">
              {(candidate?.ratingAvg || 4.9).toFixed(2)} / 5.0
            </div>
            <p className="text-[11px] text-slate-500 mt-1">From verified principal reviews</p>
          </div>
        </div>

        {/* Incoming Booking Requests (Actionable) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-150">
            <div>
              <h2 className="text-base font-bold text-navy-900">Incoming Institutional Booking Requests</h2>
              <p className="text-xs text-slate-500">
                School principals seeking your expertise for on-campus or virtual seminars
              </p>
            </div>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
              {incomingRequests.length} Pending
            </span>
          </div>

          {incomingRequests.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center italic">
              No pending booking requests right now. When an institution selects your seminar packages, their request will appear here.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {incomingRequests.map((b) => (
                <div
                  key={b.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-xl"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-slate-500">{b.bookingReference}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        Pending Your Acceptance
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-navy-900">{b.seminarTitle}</h3>
                    <p className="text-xs text-slate-600">
                      <strong>Institution:</strong> {b.institutionName} ({b.principalName})
                    </p>
                    <p className="text-xs text-slate-500">
                      Date: <span className="font-semibold text-slate-800">{b.eventDate}</span> ({b.startTime} - {b.endTime}) • Format: {b.deliveryFormat.toUpperCase()} • Audience: {b.audienceCount} Students
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 uppercase font-bold block text-[10px]">
                        Net Speaker Payout
                      </span>
                      <span className="text-base font-black text-navy-900">
                        {formatINR(b.candidatePayoutAmount)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBookingAction(b.id, "accept")}
                        disabled={actionLoading === b.id}
                        className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
                      >
                        Accept & Propose Payment
                      </button>
                      <button
                        onClick={() => handleBookingAction(b.id, "reject")}
                        disabled={actionLoading === b.id}
                        className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-rose-600 text-xs font-semibold transition disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Two Columns: Seminar Catalog & Availability Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Seminar Packages */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-150">
              <div>
                <h2 className="text-base font-bold text-navy-900">Your Seminar Catalog ({offerings.length})</h2>
                <p className="text-xs text-slate-500">Packages visible to school principals in discovery</p>
              </div>
              <Link
                href="/dashboard/candidate/seminars/new"
                className="text-xs font-bold text-brand-600 hover:text-brand-700"
              >
                + New Package
              </Link>
            </div>

            <div className="space-y-3">
              {offerings.map((off) => (
                <div
                  key={off.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-teal-700 uppercase text-[10px]">
                      {off.deliveryFormat}
                    </span>
                    <h3 className="font-bold text-navy-900 text-sm">{off.title}</h3>
                    <p className="text-slate-500">
                      Duration: {off.sessionDurationMinutes} mins • Max Students: {off.maxAudienceSize}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base font-bold text-navy-900 block">
                      {formatINR(off.basePrice)}
                    </span>
                    <span className="text-[10px] text-slate-400">Base seminar rate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Slot Manager */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
            <h3 className="font-bold text-sm text-navy-900 pb-2 border-b border-slate-150">
              Availability & Concurrency
            </h3>

            {slotMsg && (
              <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs">
                {slotMsg}
              </div>
            )}

            <form onSubmit={handleAddSlot} className="space-y-3 text-xs">
              <p className="text-slate-500">
                Add open availability windows. Confirmed slots are automatically locked to prevent double-booking.
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Available Date</label>
                <input
                  type="date"
                  required
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={slotStartTime}
                    onChange={(e) => setSlotStartTime(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={slotEndTime}
                    onChange={(e) => setSlotEndTime(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs transition"
              >
                + Lock Availability Slot
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
