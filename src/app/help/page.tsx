import React from "react";
import Link from "next/link";
import { HelpCircle, Mail, Phone, BookOpen } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-8 space-y-6">
          <div className="border-b border-slate-150 pb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              SeminarConnect Support & Help Center
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Assistance for School Principals, University Deans, and Resource Faculty
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <Mail className="w-5 h-5 text-brand-600" />
              <h3 className="font-bold text-navy-900">Institutional Helpdesk</h3>
              <p className="text-slate-500">support@seminarconnect.edu.in</p>
              <p className="text-[11px] text-slate-400">Response within 2 business hours</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <Phone className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-navy-900">Direct Helpline</h3>
              <p className="text-slate-500">+91 (011) 4920-8000</p>
              <p className="text-[11px] text-slate-400">Mon - Sat: 8:00 AM - 7:00 PM IST</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-navy-900">Principal Guides</h3>
              <p className="text-slate-500">Step-by-step onboarding & GST invoice handbook</p>
              <Link href="/cancellation" className="text-brand-600 font-bold block pt-1">
                Read Cancellation Policy →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
