import React from "react";

export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-8 space-y-6">
          <div className="border-b border-slate-150 pb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">Terms of Service</h1>
            <p className="text-xs text-slate-500 mt-1">Version 2.4 • Effective October 2026</p>
          </div>
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h3 className="font-bold text-navy-900">1. Educational Purpose & Conduct</h3>
            <p>
              SeminarConnect is an educational platform. All speakers agree to conduct seminars strictly adhering to academic integrity, respectful classroom pedagogy, and child safety laws (POCSO compliance).
            </p>
            <h3 className="font-bold text-navy-900">2. Verification Standards</h3>
            <p>
              Principals and speakers represent that all credentials, degrees, institution registration numbers, and identity documents provided are genuine and up to date.
            </p>
            <h3 className="font-bold text-navy-900">3. Taxation & Invoicing</h3>
            <p>
              All transactions in Indian Rupees (INR) include applicable GST. SeminarConnect issues tax invoices under SAC 999293.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
