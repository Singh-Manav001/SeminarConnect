"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  GraduationCap,
  Search,
  Calendar,
  MessageSquare,
  Bell,
  Heart,
  User,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  FileText,
  PlusCircle,
  Briefcase,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const { user, logout, login } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user) {
      fetch("/api/notifications")
        .then((res) => res.json())
        .then((data) => {
          if (data.notifications) {
            const unread = data.notifications.filter((n: any) => !n.isRead).length;
            setUnreadCount(unread);
          }
        })
        .catch(() => {});
    }
  }, [user, pathname]);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    router.push("/");
  };

  const handleQuickSwitch = async (email: string) => {
    await login(email);
    setUserDropdownOpen(false);
    if (email.includes("principal")) {
      router.push("/dashboard/principal");
    } else if (email.includes("admin")) {
      router.push("/admin");
    } else {
      router.push("/dashboard/candidate");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Top Demo Quick Switch Bar */}
      <div className="bg-navy-900 text-slate-300 text-xs py-1.5 px-4 hidden md:flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
          <span className="font-medium text-slate-200">SeminarConnect Sandbox:</span>
          <span>Switch roles instantly for local testing:</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleQuickSwitch("principal@dps-delhi.edu")}
            className="hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition"
          >
            🏫 DPS Principal
          </button>
          <button
            onClick={() => handleQuickSwitch("ananya.ai@seminarconnect.com")}
            className="hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition"
          >
            🎤 Dr. Ananya (AI Speaker)
          </button>
          <button
            onClick={() => handleQuickSwitch("vikram.iot@seminarconnect.com")}
            className="hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition"
          >
            🤖 Vikram (Robotics Speaker)
          </button>
          <button
            onClick={() => handleQuickSwitch("admin@seminarconnect.com")}
            className="hover:text-white px-2 py-0.5 rounded bg-brand-900 text-brand-200 hover:bg-brand-800 transition"
          >
            🛡️ Central Admin
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-indigo-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-navy-900">
                Seminar<span className="text-brand-600">Connect</span>
              </span>
              <span className="hidden sm:block text-[10px] tracking-widest uppercase font-semibold text-teal-600">
                Verified Academic Speakers
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              href="/speakers"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                pathname === "/speakers"
                  ? "text-brand-700 bg-brand-50"
                  : "text-slate-700 hover:text-brand-600 hover:bg-slate-50"
              }`}
            >
              Explore Speakers
            </Link>

            <Link
              href="/requirements"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                pathname === "/requirements"
                  ? "text-brand-700 bg-brand-50"
                  : "text-slate-700 hover:text-brand-600 hover:bg-slate-50"
              }`}
            >
              Requirements Board
            </Link>

            {user?.role === "principal" && (
              <>
                <Link
                  href="/dashboard/principal"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === "/dashboard/principal"
                      ? "text-brand-700 bg-brand-50"
                      : "text-slate-700 hover:text-brand-600 hover:bg-slate-50"
                  }`}
                >
                  Principal Dashboard
                </Link>
                <Link
                  href="/bookings"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === "/bookings"
                      ? "text-brand-700 bg-brand-50"
                      : "text-slate-700 hover:text-brand-600 hover:bg-slate-50"
                  }`}
                >
                  My Bookings
                </Link>
                <Link
                  href="/favorites"
                  className={`p-2 rounded-lg text-slate-600 hover:text-rose-600 transition`}
                  title="Saved Favorites"
                >
                  <Heart className="w-5 h-5" />
                </Link>
              </>
            )}

            {user?.role === "candidate" && (
              <>
                <Link
                  href="/dashboard/candidate"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === "/dashboard/candidate"
                      ? "text-brand-700 bg-brand-50"
                      : "text-slate-700 hover:text-brand-600 hover:bg-slate-50"
                  }`}
                >
                  Speaker Dashboard
                </Link>
                <Link
                  href="/bookings"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === "/bookings"
                      ? "text-brand-700 bg-brand-50"
                      : "text-slate-700 hover:text-brand-600 hover:bg-slate-50"
                  }`}
                >
                  Requests
                </Link>
                <Link
                  href="/dashboard/candidate/seminars/new"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 transition flex items-center space-x-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>New Offering</span>
                </Link>
              </>
            )}

            {user?.role === "admin" && (
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  pathname === "/admin"
                    ? "text-indigo-700 bg-indigo-50"
                    : "text-slate-800 hover:text-indigo-600 hover:bg-slate-50"
                } flex items-center space-x-1.5`}
              >
                <ShieldAlert className="w-4 h-4 text-indigo-600" />
                <span>Admin Command</span>
              </Link>
            )}
          </nav>

          {/* Right Header Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                {/* Messages Link */}
                <Link
                  href="/messages"
                  className="p-2 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition relative"
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>

                {/* Notifications Link */}
                <Link
                  href="/notifications"
                  className="p-2 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 transition"
                  >
                    <img
                      src={user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                      alt={user.fullName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold text-navy-900 max-w-[120px] truncate">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">
                      {user.role}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{user.email}</p>
                      </div>

                      {user.role === "principal" && (
                        <>
                          <Link
                            href="/dashboard/principal"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                          >
                            Principal Dashboard
                          </Link>
                          <Link
                            href="/dashboard/principal/requirements/new"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                          >
                            Post Seminar Requirement
                          </Link>
                          <Link
                            href="/payments"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                          >
                            Invoices & Receipts
                          </Link>
                        </>
                      )}

                      {user.role === "candidate" && (
                        <>
                          <Link
                            href="/dashboard/candidate"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                          >
                            Candidate Dashboard
                          </Link>
                          <Link
                            href="/payments"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                          >
                            Earnings & Payouts
                          </Link>
                        </>
                      )}

                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                        >
                          Administrative Console
                        </Link>
                      )}

                      <div className="border-t border-slate-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-brand-600 px-3 py-2 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-brand-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/speakers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-slate-800 hover:bg-slate-50"
          >
            Explore Speakers
          </Link>
          <Link
            href="/requirements"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-slate-800 hover:bg-slate-50"
          >
            Requirements Board
          </Link>

          {user ? (
            <>
              {user.role === "principal" && (
                <>
                  <Link
                    href="/dashboard/principal"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md font-medium text-brand-700 bg-brand-50"
                  >
                    Principal Dashboard
                  </Link>
                  <Link
                    href="/bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md font-medium text-slate-800 hover:bg-slate-50"
                  >
                    My Bookings
                  </Link>
                </>
              )}
              {user.role === "candidate" && (
                <>
                  <Link
                    href="/dashboard/candidate"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md font-medium text-brand-700 bg-brand-50"
                  >
                    Speaker Dashboard
                  </Link>
                  <Link
                    href="/bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md font-medium text-slate-800 hover:bg-slate-50"
                  >
                    Manage Requests
                  </Link>
                </>
              )}
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md font-medium text-indigo-700 bg-indigo-50"
                >
                  Admin Console
                </Link>
              )}
              <Link
                href="/messages"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md font-medium text-slate-800 hover:bg-slate-50"
              >
                Messages
              </Link>
              <Link
                href="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md font-medium text-slate-800 hover:bg-slate-50"
              >
                Notifications ({unreadCount})
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md font-medium text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-4 py-2 rounded-lg font-semibold text-slate-700 border border-slate-200"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-4 py-2 rounded-lg font-semibold text-white bg-brand-600 hover:bg-brand-700"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
