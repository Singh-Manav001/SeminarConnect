"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Filter,
  FileText,
  MessageSquare,
} from "lucide-react";
import { formatINR } from "@/lib/payments";
import { Booking } from "@/lib/types";

export default function BookingsManagementPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetch("/api/bookings")
        .then((res) => res.json())
        .then((data) => {
          if (data.bookings) setBookings(data.bookings);
        })
        .finally(() => setLoading(false));
    }
  }, [user, isLoading, router]);

  if (isLoading || loading) {
    return <div className="p-12 text-center text-slate-500">Loading bookings...</div>;
  }

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "active") return ["pending", "accepted", "payment_pending", "confirmed"].includes(b.status);
    return b.status === filterStatus;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-brand-600">
              Institutional Engagements
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
              Booking Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track requests, verify payments, and coordinate seminar sessions.
            </p>
          </div>

          {user?.role === "principal" && (
            <Link
              href="/speakers"
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition inline-flex items-center space-x-1"
            >
              <span>+ Book Another Speaker</span>
            </Link>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
          {[
            { id: "all", label: `All (${bookings.length})` },
            { id: "active", label: "Active & In-Progress" },
            { id: "confirmed", label: "Confirmed" },
            { id: "completed", label: "Delivered & Completed" },
            { id: "cancelled", label: "Cancelled / Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-2 rounded-xl transition ${
                filterStatus === tab.id
                  ? "bg-navy-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-navy-900">No bookings match this filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your scheduled sessions will appear here as you book or receive seminar requests.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-card transition p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-500">
                      {b.bookingReference}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        b.status === "confirmed"
                          ? "bg-teal-50 text-teal-700 border border-teal-200"
                          : b.status === "completed"
                          ? "bg-slate-100 text-slate-700"
                          : b.status === "payment_pending"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : b.status === "cancelled" || b.status === "rejected"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-brand-50 text-brand-700"
                      }`}
                    >
                      {b.status.replace("_", " ")}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      • {b.deliveryFormat}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-navy-900">{b.seminarTitle}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400">Speaker: </span>
                      <span className="font-semibold text-slate-800">{b.candidateName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Institution: </span>
                      <span className="font-semibold text-slate-800">{b.institutionName}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{b.eventDate} ({b.startTime} - {b.endTime})</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Total Payable
                    </span>
                    <span className="text-lg font-black text-navy-900">
                      {formatINR(b.totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Link
                      href={`/bookings/${b.id}`}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center space-x-1"
                    >
                      <span>Manage Booking</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
