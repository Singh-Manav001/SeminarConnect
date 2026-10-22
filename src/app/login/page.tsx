"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        if (email.includes("principal")) {
          router.push("/dashboard/principal");
        } else if (email.includes("admin")) {
          router.push("/admin");
        } else {
          router.push("/dashboard/candidate");
        }
      } else {
        setError("Invalid email or password. Please try again or use the demo accounts below.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string, rolePath: string) => {
    setEmail(demoEmail);
    setPassword("Password123!");
    login(demoEmail, "Password123!").then((ok) => {
      if (ok) router.push(rolePath);
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-card">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-700 to-indigo-500 flex items-center justify-center text-white mx-auto shadow-md">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-navy-900 tracking-tight">
            Sign in to SeminarConnect
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Access your principal portal, speaker dashboard, or admin console
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Institutional or Personal Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@institution.edu"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            <span>{loading ? "Signing In..." : "Sign In to Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Fast Sandbox Logins */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-2.5">
            1-Click Demo Logins for Testing
          </p>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleFillDemo("principal@dps-delhi.edu", "/dashboard/principal")}
              className="w-full p-2 rounded-lg border border-slate-200 hover:border-brand-300 bg-slate-50 hover:bg-brand-50/50 text-left transition flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-800">🏫 Dr. Rajesh Sharma</span>
                <span className="block text-[11px] text-slate-500">Principal, DPS R.K. Puram</span>
              </div>
              <span className="text-[10px] font-semibold text-brand-600">Principal Role →</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo("ananya.ai@seminarconnect.com", "/dashboard/candidate")}
              className="w-full p-2 rounded-lg border border-slate-200 hover:border-brand-300 bg-slate-50 hover:bg-brand-50/50 text-left transition flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-800">🎤 Dr. Ananya Roy</span>
                <span className="block text-[11px] text-slate-500">AI Researcher & Speaker</span>
              </div>
              <span className="text-[10px] font-semibold text-brand-600">Speaker Role →</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo("admin@seminarconnect.com", "/admin")}
              className="w-full p-2 rounded-lg border border-slate-200 hover:border-brand-300 bg-slate-50 hover:bg-brand-50/50 text-left transition flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-800">🛡️ Central Directorate</span>
                <span className="block text-[11px] text-slate-500">Platform Administrator</span>
              </div>
              <span className="text-[10px] font-semibold text-brand-600">Admin Role →</span>
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="font-bold text-brand-600 hover:text-brand-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
