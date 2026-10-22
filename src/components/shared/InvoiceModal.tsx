"use client";

import React from "react";
import { formatINR } from "@/lib/payments";
import { Booking, PaymentRecord } from "@/lib/types";
import { Printer, X, Download, ShieldCheck } from "lucide-react";

interface InvoiceModalProps {
  booking: Booking;
  payment?: PaymentRecord;
  onClose: () => void;
}

export default function InvoiceModal({ booking, payment, onClose }: InvoiceModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-2026-${booking.bookingReference.replace(/[^0-9]/g, "")}`;
  const gstPlatformTax = Math.round(booking.platformFee * 0.18);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative border border-slate-200">
        {/* Controls */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 no-print">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-teal-100 text-teal-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="text-sm font-bold text-slate-700">Official GST Tax Invoice</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body (Printable) */}
        <div className="pt-6 space-y-6 text-slate-800">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-black text-navy-900 tracking-tight">
                Seminar<span className="text-brand-600">Connect</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                SeminarConnect EdTech Marketplace Pvt. Ltd.
              </p>
              <p className="text-xs text-slate-500">
                GSTIN: 07AAACS1429R1ZX • SAC: 999293 (Commercial Training & Education)
              </p>
              <p className="text-xs text-slate-500">New Delhi, India</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                PAID & ESCROWED
              </span>
              <p className="text-xs text-slate-500 mt-2">
                <strong className="text-slate-800">Invoice No:</strong> {invoiceNumber}
              </p>
              <p className="text-xs text-slate-500">
                <strong className="text-slate-800">Date:</strong>{" "}
                {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Billed To / Speaker Info */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 text-xs">
            <div>
              <span className="font-bold uppercase text-slate-500 tracking-wider block mb-1">
                Billed To (Institution):
              </span>
              <p className="font-bold text-navy-900 text-sm">{booking.institutionName}</p>
              <p className="text-slate-600">Attn: {booking.principalName}</p>
              <p className="text-slate-600">{booking.venueAddress || booking.city}</p>
              <p className="text-slate-600">
                {booking.city}, {booking.state} - {booking.postalCode}
              </p>
            </div>
            <div>
              <span className="font-bold uppercase text-slate-500 tracking-wider block mb-1">
                Resource Speaker / Faculty:
              </span>
              <p className="font-bold text-navy-900 text-sm">{booking.candidateName}</p>
              <p className="text-slate-600">{booking.candidateTitle}</p>
              <p className="text-slate-600">
                Event Date: {booking.eventDate} ({booking.startTime} - {booking.endTime})
              </p>
              <p className="text-slate-600">Format: {booking.deliveryFormat.toUpperCase()}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-500 uppercase">
                <th className="py-2 text-left">Description</th>
                <th className="py-2 text-right">Audience</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3">
                  <p className="font-semibold text-slate-900">{booking.seminarTitle}</p>
                  <p className="text-[11px] text-slate-500">
                    Curriculum Seminar & Workshop Delivery
                  </p>
                </td>
                <td className="py-3 text-right text-slate-600">{booking.audienceCount} Students</td>
                <td className="py-3 text-right font-medium text-slate-900">
                  {formatINR(booking.baseFee)}
                </td>
              </tr>
              {booking.travelFee > 0 && (
                <tr>
                  <td className="py-3">
                    <p className="font-medium text-slate-800">Travel Surcharge & Logistical Expenses</p>
                    <p className="text-[11px] text-slate-500">
                      Direct reimbursement to speaker for campus visit
                    </p>
                  </td>
                  <td className="py-3 text-right text-slate-600">-</td>
                  <td className="py-3 text-right font-medium text-slate-900">
                    {formatINR(booking.travelFee)}
                  </td>
                </tr>
              )}
              <tr>
                <td className="py-3">
                  <p className="font-medium text-slate-800">Platform Facilitation & Escrow Fee</p>
                  <p className="text-[11px] text-slate-500">
                    Verified speaker escrow service ({booking.platformCommissionRate}%)
                  </p>
                </td>
                <td className="py-3 text-right text-slate-600">-</td>
                <td className="py-3 text-right font-medium text-slate-900">
                  {formatINR(booking.platformFee)}
                </td>
              </tr>
              <tr>
                <td className="py-3">
                  <p className="font-medium text-slate-800">GST on Facilitation Services (18%)</p>
                  <p className="text-[11px] text-slate-500">CGST 9% + SGST 9%</p>
                </td>
                <td className="py-3 text-right text-slate-600">-</td>
                <td className="py-3 text-right font-medium text-slate-900">
                  {formatINR(gstPlatformTax)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-900 text-sm font-bold">
                <td colSpan={2} className="py-3 text-right text-navy-900">
                  Total Paid:
                </td>
                <td className="py-3 text-right text-brand-700">
                  {formatINR(booking.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Payment metadata */}
          <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-500 flex justify-between">
            <span>Payment Mode: {payment?.paymentMethod || "Electronic Bank Transfer / UPI"}</span>
            <span>Gateway Ref: {payment?.gatewayPaymentId || "RAZORPAY_ESCROW_CONFIRMED"}</span>
          </div>

          <div className="bg-teal-50 border border-teal-200 p-3 rounded-lg text-teal-800 text-[11px]">
            <strong>Escrow Guarantee:</strong> Payout of {formatINR(booking.candidatePayoutAmount)}{" "}
            is held securely and released to {booking.candidateName} upon delivery of the seminar.
          </div>
        </div>
      </div>
    </div>
  );
}
