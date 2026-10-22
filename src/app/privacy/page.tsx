import React from "react";

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-8 space-y-6">
          <div className="border-b border-slate-150 pb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">Privacy Policy</h1>
            <p className="text-xs text-slate-500 mt-1">Digital Personal Data Protection (DPDP) Act 2023 Compliant</p>
          </div>
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h3 className="font-bold text-navy-900">1. Private Document Storage</h3>
            <p>
              Uploaded verification documents (degree certificates, government IDs) are stored in secure private buckets and are never accessible via public URLs or search engine crawlers. Only authorized administrators have verification access.
            </p>
            <h3 className="font-bold text-navy-900">2. Student & Institutional Privacy</h3>
            <p>
              Student attendance lists and classroom communications are strictly protected. SeminarConnect does not sell or share student data with commercial third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
