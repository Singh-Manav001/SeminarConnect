"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  School,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  PlusCircle,
  AlertCircle,
  MessageSquare,
  Search,
  Star,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { formatINR } from "@/lib/payments";
import { Booking, SeminarRequirement } from "@/lib/types";

export default function PrincipalDashboard() {
  const { user, institution, isLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requirements, setRequirements] = useState<SeminarRequirement[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "principal")) {
      router.push("/login");
      return;
    }

    if (user?.role === "principal") {
      Promise.all([
        fetch("/api/bookings").then((res) => res.json()),
        fetch("/api/requirements").then((res) => res.json()),
      ])
        .then(([bookingsRes, reqsRes]) => {
          if (bookingsRes.bookings) setBookings(bookingsRes.bookings);
          if (reqsRes.requirements) {
            setRequirements(
              reqsRes.requirements.filter((r: any) => r.principalId === user.id)
            );
          }
        })
        .finally(() => setLoadingData(false));
    }
  }, [user, isLoading, router]);

  if (isLoading || loadingData) {
    return <div className="p-12 text-center text-slate-500">Loading principal portal...</div>;
  }

  const pendingBookings = bookings.filter((b) => b.status === "pending" || b.status === "payment_pending");
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const completedBookings = bookings.filter((b) => b.status === "completed");

  const totalSpent = bookings
    .filter((b) => ["confirmed", "completed"].includes(b.status))
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
              <School className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900">
                  {institution?.institutionName || "Delhi Public School R.K. Puram"}
                </h1>
                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Campus</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Welcome back, {user?.fullName || "Principal"} • Educational Administration Portal
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard/principal/requirements/new"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Seminar Requirement</span>
            </Link>
            <Link
              href="/speakers"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              <Search className="w-4 h-4" />
              <span>Browse Speakers</span>
            </Link>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Bookings
              </span>
              <Calendar className="w-5 h-5 text-brand-600" />
            </div>
            <div className="text-2xl font-black text-navy-900 mt-2">
              {pendingBookings.length + confirmedBookings.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {confirmedBookings.length} confirmed • {pendingBookings.length} pending
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Seminars Conducted
              </span>
              <CheckCircle className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-navy-900 mt-2">
              {completedBookings.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Successfully completed sessions</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Allocated
              </span>
              <CreditCard className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-navy-900 mt-2">
              {formatINR(totalSpent)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">In escrow & delivered fees</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Posted RFP Board
              </span>
              <FileText className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-navy-900 mt-2">{requirements.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Open requirements for speakers</p>
          </div>
        </div>

        {/* Actionable Tabs: Recent Bookings & Posted Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Bookings Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-150">
                <div>
                  <h2 className="text-base font-bold text-navy-900">Recent Seminar Bookings</h2>
                  <p className="text-xs text-slate-500">
                    Track requests, complete escrow funding, and access session details
                  </p>
                </div>
                <Link
                  href="/bookings"
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
                >
                  <span>View all</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 space-y-3">
                  <p>You haven&apos;t booked any seminars yet.</p>
                  <Link
                    href="/speakers"
                    className="inline-block px-4 py-2 rounded-lg bg-brand-600 text-white font-bold"
                  >
                    Find a Speaker to Book
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-xl transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-slate-500">
                            {booking.bookingReference}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              booking.status === "confirmed"
                                ? "bg-teal-50 text-teal-700 border border-teal-200"
                                : booking.status === "completed"
                                ? "bg-slate-100 text-slate-700"
                                : booking.status === "payment_pending"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-brand-50 text-brand-700"
                            }`}
                          >
                            {booking.status.replace("_", " ")}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-navy-900">
                          {booking.seminarTitle}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Speaker: <span className="font-semibold text-slate-700">{booking.candidateName}</span> • Date: {booking.eventDate} ({booking.startTime})
                        </p>
                      </div>

                      <div className="flex items-center space-x-3 sm:text-right shrink-0">
                        <div>
                          <span className="text-sm font-bold text-navy-900 block">
                            {formatINR(booking.totalAmount)}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            {booking.deliveryFormat} session
                          </span>
                        </div>

                        <Link
                          href={`/bookings/${booking.id}`}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 hover:border-brand-500 text-xs font-bold text-slate-700 hover:text-brand-600 transition"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Posted Requirements & Campus Overview */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-150">
                <h3 className="font-bold text-sm text-navy-900">Your Posted Requirements</h3>
                <Link
                  href="/dashboard/principal/requirements/new"
                  className="text-xs font-bold text-brand-600 hover:text-brand-700"
                >
                  + Post New
                </Link>
              </div>

              {requirements.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No open seminar requests posted yet. Post your auditorium dates so candidates can submit proposals!
                </p>
              ) : (
                <div className="space-y-3">
                  {requirements.map((req) => (
                    <div
                      key={req.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-brand-700">{req.categoryName}</span>
                        <span className="font-bold text-navy-900">{formatINR(req.budget)}</span>
                      </div>
                      <p className="font-semibold text-slate-800 line-clamp-1">{req.title}</p>
                      <p className="text-[11px] text-slate-500">
                        Target Date: {req.targetDate} • Audience: {req.audienceSize} students
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Invoicing and Policy Shortcuts */}
            <div className="bg-navy-900 text-white rounded-2xl p-6 space-y-3">
              <h3 className="font-bold text-sm">Institutional Guarantees</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                All funds are protected under SeminarConnect Escrow. If a speaker is unable to attend, your institution receives a 100% immediate refund.
              </p>
              <div className="pt-2">
                <Link
                  href="/payments"
                  className="inline-block text-xs font-bold text-teal-400 hover:text-teal-300"
                >
                  View Downloadable GST Invoices →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
