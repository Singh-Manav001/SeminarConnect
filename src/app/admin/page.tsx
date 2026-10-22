"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldAlert,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Layers,
  Settings,
  FileCheck,
  CreditCard,
  IndianRupee,
  AlertTriangle,
  RotateCcw,
  PlusCircle,
  Check,
} from "lucide-react";
import { formatINR } from "@/lib/payments";
import { Category, Booking, CandidateProfile, Institution } from "@/lib/types";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"overview" | "verification" | "categories" | "settings" | "bookings">("overview");

  const [categories, setCategories] = useState<Category[]>([]);
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState({
    platformCommissionPercent: 10,
    taxRateGst: 18,
    minimumBookingLeadDays: 2,
    cancellationCutoffHours: 48,
  });

  // Category modal
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [catMsg, setCatMsg] = useState<string | null>(null);

  // Settings update status
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login");
      return;
    }

    if (user?.role === "admin") {
      fetch("/api/categories")
        .then((res) => res.json())
        .then((d) => setCategories(d.categories || []));

      fetch("/api/speakers")
        .then((res) => res.json())
        .then((d) => setCandidates(d.speakers || []));

      fetch("/api/bookings")
        .then((res) => res.json())
        .then((d) => setBookings(d.bookings || []));

      fetch("/api/admin/settings")
        .then((res) => res.json())
        .then((d) => {
          if (d.settings) setSettings(d.settings);
        });
    }
  }, [user, isLoading, router]);

  const handleVerify = async (type: "candidate" | "institution", id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/admin/verify-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, status }),
      });
      if (res.ok) {
        if (type === "candidate") {
          setCandidates((prev) =>
            prev.map((c) => (c.id === id ? { ...c, verificationStatus: status } : c))
          );
        }
      }
    } catch (err) {
      console.error("Verification failed", err);
    }
  };

  const handleToggleCategory = async (cat: Category) => {
    try {
      const res = await fetch("/api/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cat.id, isActive: !cat.isActive }),
      });
      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, isActive: !c.isActive } : c))
        );
      }
    } catch (err) {
      console.error("Failed toggling category", err);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName,
          description: newCatDesc,
          iconName: "BookOpen",
          displayOrder: categories.length + 1,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories((prev) => [...prev, data.category]);
        setNewCatName("");
        setNewCatDesc("");
        setCatMsg("Category added successfully!");
        setTimeout(() => setCatMsg(null), 3000);
      }
    } catch (err) {
      console.error("Failed adding category", err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSettingsMsg("Platform commission and financial settings updated.");
        setTimeout(() => setSettingsMsg(null), 3000);
      }
    } catch (err) {
      console.error("Failed updating settings", err);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-slate-500">Authenticating administrative access...</div>;
  }

  const totalGMV = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalPlatformRev = bookings.reduce((sum, b) => sum + b.platformFee, 0);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="bg-navy-900 text-white rounded-2xl shadow-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  Administrative Directorate
                </h1>
                <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Central verification, category governance, marketplace financial settlement & audit logging
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-2 rounded-xl transition ${
                activeTab === "overview"
                  ? "bg-white text-navy-900 shadow"
                  : "bg-navy-800 text-slate-300 hover:text-white"
              }`}
            >
              Overview KPI
            </button>
            <button
              onClick={() => setActiveTab("verification")}
              className={`px-3 py-2 rounded-xl transition ${
                activeTab === "verification"
                  ? "bg-white text-navy-900 shadow"
                  : "bg-navy-800 text-slate-300 hover:text-white"
              }`}
            >
              Verification Queue ({candidates.filter((c) => c.verificationStatus === "pending").length})
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-3 py-2 rounded-xl transition ${
                activeTab === "categories"
                  ? "bg-white text-navy-900 shadow"
                  : "bg-navy-800 text-slate-300 hover:text-white"
              }`}
            >
              Categories ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-3 py-2 rounded-xl transition ${
                activeTab === "bookings"
                  ? "bg-white text-navy-900 shadow"
                  : "bg-navy-800 text-slate-300 hover:text-white"
              }`}
            >
              Bookings ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-3 py-2 rounded-xl transition ${
                activeTab === "settings"
                  ? "bg-white text-navy-900 shadow"
                  : "bg-navy-800 text-slate-300 hover:text-white"
              }`}
            >
              Platform Settings
            </button>
          </div>
        </div>

        {/* Tab 1: Overview KPIs */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Speakers
                </span>
                <div className="text-2xl font-black text-navy-900 mt-2">{candidates.length}</div>
                <p className="text-[11px] text-teal-600 mt-1">
                  {candidates.filter((c) => c.verificationStatus === "approved").length} verified approved
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Bookings
                </span>
                <div className="text-2xl font-black text-navy-900 mt-2">{bookings.length}</div>
                <p className="text-[11px] text-slate-500 mt-1">Across all school institutions</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Gross Marketplace Volume (GMV)
                </span>
                <div className="text-2xl font-black text-navy-900 mt-2">
                  {formatINR(totalGMV)}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Held securely in escrow</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Platform Commission Revenue
                </span>
                <div className="text-2xl font-black text-emerald-600 mt-2">
                  {formatINR(totalPlatformRev)}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{settings.platformCommissionPercent}% platform fee</p>
              </div>
            </div>

            {/* Quick overview of latest bookings */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
              <h2 className="text-base font-bold text-navy-900">Live Booking Oversight</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-left">
                      <th className="pb-2">Reference</th>
                      <th className="pb-2">Seminar Title</th>
                      <th className="pb-2">Institution</th>
                      <th className="pb-2">Candidate Speaker</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.slice(0, 6).map((b) => (
                      <tr key={b.id} className="py-2">
                        <td className="py-3 font-mono font-bold text-slate-600">{b.bookingReference}</td>
                        <td className="py-3 font-semibold text-navy-900">{b.seminarTitle}</td>
                        <td className="py-3 text-slate-600">{b.institutionName}</td>
                        <td className="py-3 text-slate-600">{b.candidateName}</td>
                        <td className="py-3 font-bold text-slate-900">{formatINR(b.totalAmount)}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Verification Queue */}
        {activeTab === "verification" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-navy-900">Speaker Verification Queue</h2>
              <p className="text-xs text-slate-500">
                Review submitted degrees, identity documents, and assign verified expert badges
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {candidates.map((c) => (
                <div key={c.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={c.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                      alt={c.fullName}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-navy-900 text-sm">{c.fullName}</h3>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            c.verificationStatus === "approved"
                              ? "bg-teal-50 text-teal-700"
                              : c.verificationStatus === "rejected"
                              ? "bg-rose-50 text-rose-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {c.verificationStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{c.professionalTitle}</p>
                      <p className="text-[11px] text-slate-400">{c.highestQualification} • {c.city}, {c.state}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleVerify("candidate", c.id, "approved")}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleVerify("candidate", c.id, "rejected")}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-rose-600 font-semibold text-xs flex items-center space-x-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Category Management */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
              <h2 className="text-base font-bold text-navy-900">Add New Academic Category</h2>
              {catMsg && (
                <div className="p-2.5 rounded-lg bg-teal-50 text-teal-800 text-xs">{catMsg}</div>
              )}
              <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <input
                  type="text"
                  required
                  placeholder="Category Name (e.g. Quantum Computing)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
                <input
                  type="text"
                  placeholder="Description of seminar topics"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs"
                >
                  + Create Category
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
              <h2 className="text-base font-bold text-navy-900">
                12 Database-Backed Categories ({categories.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`p-4 rounded-xl border transition ${
                      cat.isActive
                        ? "bg-slate-50/60 border-slate-200"
                        : "bg-slate-100 border-slate-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-navy-900 text-xs">{cat.name}</h4>
                      <button
                        onClick={() => handleToggleCategory(cat)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          cat.isActive
                            ? "bg-teal-100 text-teal-800"
                            : "bg-slate-300 text-slate-700"
                        }`}
                      >
                        {cat.isActive ? "Active" : "Disabled"}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Platform Financial Settings */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 max-w-2xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-navy-900">Platform Financial & Escrow Settings</h2>
              <p className="text-xs text-slate-500">
                Configure commission rates, taxation parameters, and cancellation policy windows
              </p>
            </div>

            {settingsMsg && (
              <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs">
                {settingsMsg}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Platform Commission Rate (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={settings.platformCommissionPercent}
                  onChange={(e) =>
                    setSettings({ ...settings, platformCommissionPercent: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
                <span className="text-[11px] text-slate-400">
                  Deducted transparently as platform convenience fee on completed seminars.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  GST Rate on Platform Services (%)
                </label>
                <input
                  type="number"
                  value={settings.taxRateGst}
                  onChange={(e) =>
                    setSettings({ ...settings, taxRateGst: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cancellation Cutoff Window (Hours before seminar)
                </label>
                <input
                  type="number"
                  value={settings.cancellationCutoffHours}
                  onChange={(e) =>
                    setSettings({ ...settings, cancellationCutoffHours: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}

        {/* Tab 5: Bookings Oversight */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
            <h2 className="text-base font-bold text-navy-900">All Marketplace Bookings ({bookings.length})</h2>
            <div className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-500 mr-2">{b.bookingReference}</span>
                    <span className="font-bold text-navy-900">{b.seminarTitle}</span>
                    <p className="text-slate-500">
                      {b.institutionName} ➔ {b.candidateName} • {b.eventDate}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-navy-900">{formatINR(b.totalAmount)}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {b.status}
                    </span>
                    <Link
                      href={`/bookings/${b.id}`}
                      className="text-brand-600 font-semibold hover:underline"
                    >
                      Audit View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
