"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import InvoiceModal from "@/components/shared/InvoiceModal";
import {
  CreditCard,
  Download,
  Printer,
  FileText,
  ShieldCheck,
  CheckCircle,
  IndianRupee,
  Clock,
  ArrowRight,
} from "lucide-react";
import { formatINR } from "@/lib/payments";
import { Booking, PaymentRecord } from "@/lib/types";

export default function PaymentsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings) {
          // Filter to those with financial records
          setBookings(data.bookings.filter((b: any) => ["confirmed", "completed"].includes(b.status)));
        }
      })
      .finally(() => setLoading(false));
  }, [user, isLoading, router]);

  if (isLoading || loading) {
    return <div className="p-12 text-center text-slate-500">Loading invoices & receipts...</div>;
  }

  const isPrincipal = user?.role === "principal";

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-brand-600">
            Financial Ledger & Tax Records
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
            {isPrincipal ? "Institutional Invoices & Receipts" : "Speaker Earnings & Settlements"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compliant with Indian educational accounting standards, GST, and escrow disbursements.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-navy-900">No payment records found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Once a booking is confirmed and funded through escrow, its itemized GST invoice will be generated here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase text-left font-bold">
                    <th className="p-4">Invoice No.</th>
                    <th className="p-4">Seminar Topic</th>
                    <th className="p-4">{isPrincipal ? "Faculty Speaker" : "Host Campus"}</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Amount</th>
                    <th className="p-4 text-center">Escrow Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-mono font-bold text-slate-700">
                        INV-2026-{b.bookingReference.split("-")[2]}
                      </td>
                      <td className="p-4 font-bold text-navy-900 max-w-xs truncate">
                        {b.seminarTitle}
                      </td>
                      <td className="p-4 text-slate-600">
                        {isPrincipal ? b.candidateName : b.institutionName}
                      </td>
                      <td className="p-4 text-slate-500">{b.eventDate}</td>
                      <td className="p-4 text-right font-bold text-navy-900">
                        {formatINR(isPrincipal ? b.totalAmount : b.candidatePayoutAmount)}
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-50 text-teal-700 border border-teal-200">
                          {b.status === "completed" ? "Settled" : "Held in Escrow"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedBookingForInvoice(b)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Invoice</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedBookingForInvoice && (
        <InvoiceModal
          booking={selectedBookingForInvoice}
          onClose={() => setSelectedBookingForInvoice(null)}
        />
      )}
    </div>
  );
}
