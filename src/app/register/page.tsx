"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  GraduationCap,
  School,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Building,
  CheckCircle,
  FileText,
  Briefcase,
  Award,
  Clock,
  IndianRupee,
  Compass,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

function RegisterPageForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "candidate" ? "candidate" : "principal";

  const [role, setRole] = useState<"principal" | "candidate">(initialRole);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Common fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Principal specific
  const [institutionName, setInstitutionName] = useState("");
  const [institutionType, setInstitutionType] = useState<
    "School" | "College" | "University" | "Coaching Institute" | "Vocational Centre"
  >("School");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("New Delhi");
  const [state, setState] = useState("Delhi");
  const [postalCode, setPostalCode] = useState("110001");
  const [website, setWebsite] = useState("");
  const [verificationDocName, setVerificationDocName] = useState("affiliation_proof.pdf");

  // Candidate specific
  const [professionalTitle, setProfessionalTitle] = useState("");
  const [highestQualification, setHighestQualification] = useState("Ph.D. / M.Tech");
  const [experienceYears, setExperienceYears] = useState(5);
  const [baseSeminarFee, setBaseSeminarFee] = useState(8000);
  const [travelRadiusKm, setTravelRadiusKm] = useState(100);
  const [preferredDeliveryFormat, setPreferredDeliveryFormat] = useState<"online" | "offline" | "hybrid">("hybrid");
  const [skillInput, setSkillInput] = useState("Artificial Intelligence, Python, STEM Workshops");
  const [bio, setBio] = useState("Passionate educator and researcher with extensive experience delivering interactive workshops for students.");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let payload: any = {
        role,
        fullName,
        email,
        phone,
        password,
      };

      if (role === "principal") {
        payload = {
          ...payload,
          institutionName,
          institutionType,
          address,
          city,
          state,
          postalCode,
          website: website || undefined,
          verificationDocUrl: `/docs/${verificationDocName}`,
        };
      } else {
        const skillsArray = skillInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        payload = {
          ...payload,
          professionalTitle,
          highestQualification,
          experienceYears: Number(experienceYears),
          baseSeminarFee: Number(baseSeminarFee),
          travelRadiusKm: Number(travelRadiusKm),
          preferredDeliveryFormat,
          city,
          state,
          postalCode,
          skills: skillsArray.length > 0 ? skillsArray : ["General Education"],
          languages: ["English", "Hindi"],
          bio,
        };
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Redirect to corresponding dashboard
      if (role === "principal") {
        router.push("/dashboard/principal");
      } else {
        router.push("/dashboard/candidate");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-card">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-700 to-indigo-500 flex items-center justify-center text-white mx-auto shadow-md">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Join SeminarConnect
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Connect your institution with verified speakers, or share your expertise across schools & colleges
          </p>

          {/* Role Selector Tabs */}
          <div className="mt-6 grid grid-cols-2 p-1.5 rounded-xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setRole("principal");
                setError(null);
              }}
              className={`py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition ${
                role === "principal"
                  ? "bg-white text-navy-900 shadow-sm"
                  : "text-slate-600 hover:text-navy-900"
              }`}
            >
              <School className="w-4 h-4 text-brand-600" />
              <span>School / Institution Principal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole("candidate");
                setError(null);
              }}
              className={`py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition ${
                role === "candidate"
                  ? "bg-white text-navy-900 shadow-sm"
                  : "text-slate-600 hover:text-navy-900"
              }`}
            >
              <GraduationCap className="w-4 h-4 text-teal-600" />
              <span>Candidate / Seminar Speaker</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Account & Identity */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">
              1. Basic Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@school.edu"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98111 22334"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
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
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Principal / Institution details */}
          {role === "principal" && (
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">
                2. Institution Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    required
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="Delhi Public School R.K. Puram"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institution Type
                  </label>
                  <select
                    value={institutionType}
                    onChange={(e: any) => setInstitutionType(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  >
                    <option value="School">School (K-12)</option>
                    <option value="College">Undergraduate College</option>
                    <option value="University">University</option>
                    <option value="Coaching Institute">Coaching / Test Prep Institute</option>
                    <option value="Vocational Centre">Vocational & Skill Centre</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Campus Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Sector XII, R.K. Puram"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New Delhi"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Delhi"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PIN Code (Postal Code)
                  </label>
                  <input
                    type="text"
                    required
                    pattern="[1-9][0-9]{5}"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="110022"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institution Website (Optional)
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://dpsrkp.net"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institution Verification Document (Affiliation letter / Certificate)
                  </label>
                  <div className="flex items-center space-x-3 p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50">
                    <FileText className="w-6 h-6 text-brand-600 shrink-0" />
                    <div className="flex-1 text-xs">
                      <span className="font-semibold text-slate-800">
                        {verificationDocName}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Accepted: PDF, JPG, PNG (Max 10MB)
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                      Ready for review
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Candidate / Speaker details */}
          {role === "candidate" && (
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">
                2. Professional Expertise & Seminar Logistics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Professional Title / Designation
                  </label>
                  <input
                    type="text"
                    required
                    value={professionalTitle}
                    onChange={(e) => setProfessionalTitle(e.target.value)}
                    placeholder="e.g. Lead AI Researcher & ML Architect"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Highest Academic Qualification
                  </label>
                  <input
                    type="text"
                    required
                    value={highestQualification}
                    onChange={(e) => setHighestQualification(e.target.value)}
                    placeholder="Ph.D. in Computer Science (IISc)"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    required
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Base Seminar Fee (INR ₹ / session)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={500}
                      step={500}
                      required
                      value={baseSeminarFee}
                      onChange={(e) => setBaseSeminarFee(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Delivery Format Preference
                  </label>
                  <select
                    value={preferredDeliveryFormat}
                    onChange={(e: any) => setPreferredDeliveryFormat(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  >
                    <option value="hybrid">Hybrid (Both Offline & Online)</option>
                    <option value="offline">Offline / On-Campus Only</option>
                    <option value="online">Online / Virtual Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Travel Radius (km from base city)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={1500}
                    value={travelRadiusKm}
                    onChange={(e) => setTravelRadiusKm(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Base City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State & PIN Code
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Karnataka"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                    />
                    <input
                      type="text"
                      required
                      pattern="[1-9][0-9]{5}"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="560001"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Key Topics & Skills (Comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Artificial Intelligence, Deep Learning, Python, Prompt Engineering"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Professional Biography
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
            >
              <span>{loading ? "Creating Account..." : `Register as ${role === "principal" ? "School Principal" : "Seminar Speaker"}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-brand-600 hover:text-brand-700">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading registration form...</div>}>
      <RegisterPageForm />
    </Suspense>
  );
}
