import React from "react";
import Link from "next/link";
import { ShieldCheck, RotateCcw, Clock, AlertTriangle } from "lucide-react";

export default function CancellationPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-8 space-y-6">
          <div className="border-b border-slate-150 pb-4">
            <span className="text-xs uppercase font-bold tracking-widest text-teal-600">
              Institutional Guarantees
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
              Cancellation & Refund Policy
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Last Updated: October 2026 • Valid for All Registered Schools & Speakers
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h3 className="text-base font-bold text-navy-900">
              1. 48-Hour Full Institutional Refund Policy
            </h3>
            <p>
              Educational institutions (schools, colleges, universities) may cancel any confirmed seminar booking up to <strong>48 hours before the scheduled session start time</strong> for an immediate 100% refund of the seminar fee and travel surcharges.
            </p>

            <h3 className="text-base font-bold text-navy-900">
              2. Cancellations within 48 Hours
            </h3>
            <p>
              When an institution cancels a seminar within 48 hours of the scheduled start time, the speaker is entitled to a 50% preparation compensation fee to account for reserved calendar time, lab material preparation, and travel scheduling.
            </p>

            <h3 className="text-base font-bold text-navy-900">
              3. Speaker Unavailability & Emergencies
            </h3>
            <p>
              If a candidate speaker becomes unavailable due to illness or unforeseen emergency:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The institution is offered an immediate 100% refund without deduction.</li>
              <li>Or the institution may accept a mutually agreeable rescheduled date.</li>
            </ul>

            <h3 className="text-base font-bold text-navy-900">
              4. Escrow Protection Mechanism
            </h3>
            <p>
              All payments made via Razorpay / electronic transfer are held in an RBI-compliant escrow account until the seminar has been delivered and confirmed by the host school principal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
