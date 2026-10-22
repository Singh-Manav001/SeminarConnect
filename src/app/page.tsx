import React from "react";
import Link from "next/link";
import { db } from "@/lib/db/dataStore";
import SpeakerCard from "@/components/shared/SpeakerCard";
import {
  GraduationCap,
  Sparkles,
  Search,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  CreditCard,
  MapPin,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Users,
  Compass,
  FileCheck,
  Award,
} from "lucide-react";

export default function HomePage() {
  const categories = db.getCategories();
  const allSpeakers = db.getCandidates();
  const featuredSpeakers = allSpeakers.filter((s) => s.isFeatured).slice(0, 3);
  const requirements = db.getRequirements().slice(0, 3);

  return (
    <div className="bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-50/60 via-white to-white py-20 lg:py-28 border-b border-slate-150">
        <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-brand-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 -z-10 w-80 h-80 bg-teal-100/40 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold shadow-subtle">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>India&apos;s Dedicated Academic Seminar Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight leading-[1.15]">
              Bring Expert Knowledge to Your Classroom.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Discover skilled speakers, book engaging seminars, and inspire the next generation.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/speakers"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md hover:shadow-lg transition duration-150 text-base space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Find a Speaker</span>
              </Link>

              <Link
                href="/register?role=candidate"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-navy-900 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition duration-150 text-base space-x-2"
              >
                <GraduationCap className="w-5 h-5 text-brand-600" />
                <span>Become a Speaker</span>
              </Link>
            </div>

            {/* Quick stats / Highlights */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>100% Background & Degree Verified</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Escrow Payments in Indian Rupees (₹)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Full GST Invoices for Institutions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR SEMINAR TOPICS */}
      <section className="py-16 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-brand-600">
                Curriculum & STEM Tracks
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
                Explore Seminar Categories
              </h2>
            </div>
            <Link
              href="/speakers"
              className="mt-3 md:mt-0 inline-flex items-center space-x-1 text-sm font-bold text-brand-600 hover:text-brand-700"
            >
              <span>View all categories</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/speakers?category=${cat.id}`}
                className="group p-5 bg-white rounded-xl border border-slate-200 hover:border-brand-300 shadow-sm hover:shadow-card transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-brand-50 group-hover:bg-brand-600 text-brand-600 group-hover:text-white flex items-center justify-center transition mb-3">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-navy-900 text-sm group-hover:text-brand-600 transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-brand-600 font-semibold">
                  <span>Browse Experts</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED ACADEMIC SPEAKERS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-teal-600">
                Peer-Reviewed Talent
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
                Featured Guest Speakers & Faculty
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Researchers, corporate specialists, and educators rated 4.8+ by leading schools.
              </p>
            </div>
            <Link
              href="/speakers"
              className="mt-3 md:mt-0 inline-flex items-center space-x-1 text-sm font-bold text-brand-600 hover:text-brand-700"
            >
              <span>Explore all speakers</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSpeakers.map((speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (Institutional Journey) */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-teal-400">
              Institutional Peace of Mind
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-1">
              How SeminarConnect Works for Schools & Colleges
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              From finding the ideal subject matter expert to certified completion and automated invoicing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-navy-800/80 p-6 rounded-2xl border border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-base mb-4">
                1
              </div>
              <h3 className="font-bold text-base text-white">Search & Filter</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Filter speakers by city, travel radius, topic, audience age, delivery format (offline or online), and budget.
              </p>
            </div>

            <div className="bg-navy-800/80 p-6 rounded-2xl border border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-base mb-4">
                2
              </div>
              <h3 className="font-bold text-base text-white">Request Date & Syllabus</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Choose an existing seminar package or request custom learning outcomes. The speaker reviews your date and auditorium requirements.
              </p>
            </div>

            <div className="bg-navy-800/80 p-6 rounded-2xl border border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-base mb-4">
                3
              </div>
              <h3 className="font-bold text-base text-white">Escrow Payment</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Securely fund the seminar fee via UPI or Corporate Net Banking. Funds are held in escrow until the seminar is successfully conducted.
              </p>
            </div>

            <div className="bg-navy-800/80 p-6 rounded-2xl border border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-base mb-4">
                4
              </div>
              <h3 className="font-bold text-base text-white">Deliver & Review</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                The speaker conducts the seminar at your campus or online. The principal marks completion, downloads the GST invoice, and leaves a verified review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OPEN REQUIREMENTS BOARD PREVIEW */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-brand-600">
                School & College Requests
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
                Recent Seminar Requirements Posted by Principals
              </h2>
            </div>
            <Link
              href="/requirements"
              className="mt-3 md:mt-0 inline-flex items-center space-x-1 text-sm font-bold text-brand-600 hover:text-brand-700"
            >
              <span>View all open requirements</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requirements.map((req) => (
              <div
                key={req.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-card transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full">
                      {req.categoryName}
                    </span>
                    <span className="uppercase text-[10px] font-bold tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {req.deliveryFormat}
                    </span>
                  </div>
                  <h3 className="font-bold text-navy-900 text-base line-clamp-2 mt-1">
                    {req.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {req.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Target Institution
                    </span>
                    <span className="font-semibold text-navy-900">{req.institutionName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Budget
                    </span>
                    <span className="font-bold text-brand-700 text-sm">₹{req.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-teal-600">
              Institutional Feedback
            </span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-1">
              Trusted by Progressive School Leaders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card">
              <p className="text-sm text-slate-700 italic leading-relaxed">
                &ldquo;Finding qualified, credible guest speakers for our senior science and AI clubs used to take weeks of informal calls. Through SeminarConnect, we booked Dr. Ananya Roy for an AI workshop. The session was thoroughly researched, highly interactive, and our students were inspired.&rdquo;
              </p>
              <div className="mt-5 flex items-center space-x-3 pt-4 border-t border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                  alt="Dr. Rajesh Sharma"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-navy-900">Dr. Rajesh Sharma</h4>
                  <p className="text-[11px] text-slate-500">Principal, Delhi Public School R.K. Puram</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card">
              <p className="text-sm text-slate-700 italic leading-relaxed">
                &ldquo;The escrow payment model and clear GST invoicing give our administration complete financial peace of mind. We have hosted three workshops this semester on mechatronics and career readiness without a single logistical hiccup.&rdquo;
              </p>
              <div className="mt-5 flex items-center space-x-3 pt-4 border-t border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
                  alt="Dr. Meenakshi Sundaram"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-navy-900">Dr. Meenakshi Sundaram</h4>
                  <p className="text-[11px] text-slate-500">Dean, National College of Engineering & Tech</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-600">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-white rounded-xl border border-slate-200">
              <h3 className="font-bold text-sm text-navy-900">
                How does SeminarConnect verify speaker candidates?
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Every candidate must submit government identity proofs, academic degree certificates, and proof of professional expertise. Our verification team reviews documentation before granting the verified speaker badge.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200">
              <h3 className="font-bold text-sm text-navy-900">
                What is the cancellation and refund policy?
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Institutions can cancel confirmed bookings up to 48 hours prior to the scheduled session for a 100% refund of the seminar fee. Cancellations within 48 hours are subject to a nominal speaker preparation compensation.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200">
              <h3 className="font-bold text-sm text-navy-900">
                How are travel expenses calculated for offline seminars?
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Travel charges are transparently computed based on the exact road/aerial distance between the speaker&apos;s base location and your campus using verified coordinates, multiplied by the speaker&apos;s disclosed per-kilometer rate.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200">
              <h3 className="font-bold text-sm text-navy-900">
                Do you provide GST invoices for institutional accounting?
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Yes. Every completed transaction generates an itemized GST Tax Invoice featuring the institution&apos;s name, GSTIN, SAC education code (999293), and full financial breakdown.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BOTTOM CTA BANNER */}
      <section className="py-16 bg-brand-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Empower Your Students with World-Class Seminars?
          </h2>
          <p className="text-sm sm:text-base text-brand-100 max-w-2xl mx-auto">
            Join hundreds of progressive schools and colleges upgrading their campus workshops with verified industry mentors.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/speakers"
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white text-brand-700 hover:bg-slate-50 font-bold shadow-md transition"
            >
              Browse Speakers Now
            </Link>
            <Link
              href="/register?role=principal"
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-bold border border-brand-500 transition"
            >
              Register as Institution
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
