import React from "react";
import Link from "next/link";
import { GraduationCap, ShieldCheck, Award, CreditCard, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800 text-slate-300">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-teal-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Strict Academic Verification</h4>
              <p className="text-xs text-slate-400 mt-1">
                Every candidate is reviewed for degrees, verified background, and past teaching excellence.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-brand-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Escrow Protection & GST Invoicing</h4>
              <p className="text-xs text-slate-400 mt-1">
                Seminar fees are held in secure escrow until session delivery. Complete GST tax invoices for institutions.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Curriculum & NEP-2020 Aligned</h4>
              <p className="text-xs text-slate-400 mt-1">
                Stem, AI, Robotics, Career guidance, and communication seminars mapped to NEP experiential goals.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-indigo-500 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Seminar<span className="text-brand-400">Connect</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 mt-3 max-w-sm leading-relaxed">
              SeminarConnect is India&apos;s dedicated educational seminar marketplace connecting school principals, universities, and coaching institutes with verified subject matter experts and motivational speakers.
            </p>
            <p className="text-xs text-slate-500 mt-4">
              Registered Educational Marketplace Initiative • Made for Indian Schools & Colleges
            </p>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Top Topics</h5>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link href="/speakers?category=cat-4" className="hover:text-white transition">
                  Artificial Intelligence & ML
                </Link>
              </li>
              <li>
                <Link href="/speakers?category=cat-6" className="hover:text-white transition">
                  Robotics & IoT
                </Link>
              </li>
              <li>
                <Link href="/speakers?category=cat-2" className="hover:text-white transition">
                  Full-Stack Web Development
                </Link>
              </li>
              <li>
                <Link href="/speakers?category=cat-5" className="hover:text-white transition">
                  Cybersecurity & Ethical Hacking
                </Link>
              </li>
              <li>
                <Link href="/speakers?category=cat-8" className="hover:text-white transition">
                  Campus Placement & Careers
                </Link>
              </li>
              <li>
                <Link href="/speakers?category=cat-7" className="hover:text-white transition">
                  Vedic Math & Olympiads
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">For Institutions</h5>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link href="/speakers" className="hover:text-white transition">
                  Search Candidate Speakers
                </Link>
              </li>
              <li>
                <Link href="/dashboard/principal/requirements/new" className="hover:text-white transition">
                  Post Seminar Requirement
                </Link>
              </li>
              <li>
                <Link href="/dashboard/principal" className="hover:text-white transition">
                  Principal Dashboard
                </Link>
              </li>
              <li>
                <Link href="/payments" className="hover:text-white transition">
                  Invoices & Settlement
                </Link>
              </li>
              <li>
                <Link href="/cancellation" className="hover:text-white transition">
                  48-Hr Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Speakers & Policies */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Speakers & Legal</h5>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link href="/register?role=candidate" className="hover:text-white transition">
                  Become a Speaker
                </Link>
              </li>
              <li>
                <Link href="/dashboard/candidate" className="hover:text-white transition">
                  Speaker Dashboard
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation" className="hover:text-white transition">
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-slate-800 text-center md:flex md:justify-between items-center text-xs text-slate-500">
          <p>© 2026 SeminarConnect Technologies India. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Powered by Next.js, TypeScript, Tailwind CSS, Supabase & Razorpay
          </p>
        </div>
      </div>
    </footer>
  );
}
