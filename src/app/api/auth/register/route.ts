import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/dataStore";
import {
  PrincipalRegistrationSchema,
  CandidateRegistrationSchema,
} from "@/lib/validators";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { getCoordinatesForCity } from "@/lib/geo";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role } = body;

    if (role === "principal") {
      const validated = PrincipalRegistrationSchema.parse(body);

      // Check if email already registered
      if (db.findUserByEmail(validated.email)) {
        return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
      }

      // Geo coordinates lookup
      const coords = getCoordinatesForCity(validated.city);

      // 1. Create User Profile
      const newUser = db.createUser({
        email: validated.email,
        role: "principal",
        fullName: validated.fullName,
        phone: validated.phone,
        bio: `Leadership team at ${validated.institutionName}`,
      });

      // 2. Create Institution Record
      const newInst = db.createInstitution({
        profileId: newUser.id,
        institutionName: validated.institutionName,
        institutionType: validated.institutionType,
        address: validated.address,
        city: validated.city,
        state: validated.state,
        postalCode: validated.postalCode,
        latitude: coords.lat,
        longitude: coords.lng,
        website: validated.website,
        verificationDocUrl: validated.verificationDocUrl || "/docs/sample-affiliation.pdf",
        verificationStatus: "approved", // In sandbox demo mode, approve so they can start immediately
      });

      // Create session
      const sessionPayload = {
        userId: newUser.id,
        role: "principal",
        email: newUser.email,
      };

      const res = NextResponse.json({
        success: true,
        user: newUser,
        institution: newInst,
      });

      res.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: JSON.stringify(sessionPayload),
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: false,
        sameSite: "lax",
      });

      return res;
    } else if (role === "candidate") {
      const validated = CandidateRegistrationSchema.parse(body);

      // Check if email already registered
      if (db.findUserByEmail(validated.email)) {
        return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
      }

      const coords = getCoordinatesForCity(validated.city);

      // 1. Create User Profile
      const newUser = db.createUser({
        email: validated.email,
        role: "candidate",
        fullName: validated.fullName,
        phone: validated.phone,
        bio: validated.bio,
      });

      // 2. Create Candidate Profile
      const newCand = db.createCandidateProfile({
        profileId: newUser.id,
        professionalTitle: validated.professionalTitle,
        experienceYears: validated.experienceYears,
        highestQualification: validated.highestQualification,
        baseSeminarFee: validated.baseSeminarFee,
        travelRadiusKm: validated.travelRadiusKm,
        preferredDeliveryFormat: validated.preferredDeliveryFormat,
        city: validated.city,
        state: validated.state,
        postalCode: validated.postalCode,
        latitude: coords.lat,
        longitude: coords.lng,
        verificationStatus: "approved", // In demo mode, approve so they appear in discovery immediately
        languages: validated.languages,
        skills: validated.skills,
      });

      // Create default starter seminar package for this candidate
      db.createOffering({
        candidateId: newCand.id,
        title: `Comprehensive Masterclass: ${validated.skills[0] || "Foundations"}`,
        categoryId: "cat-4", // default or mapped category
        description: `Hands-on seminar on ${validated.skills.join(", ")} designed to engage students with industry-standard practices, live demonstrations, and career insights.`,
        learningOutcomes: [
          `Master fundamental and intermediate concepts in ${validated.skills[0]}`,
          "Industry use cases and live coding / practical demonstrations",
          "Interactive Q&A and project portfolio recommendations",
        ],
        targetAudience: "High School & College Students",
        sessionDurationMinutes: 120,
        maxAudienceSize: 150,
        deliveryFormat: validated.preferredDeliveryFormat,
        basePrice: validated.baseSeminarFee,
        travelChargePerKm: 15,
      });

      const sessionPayload = {
        userId: newUser.id,
        role: "candidate",
        email: newUser.email,
      };

      const res = NextResponse.json({
        success: true,
        user: newUser,
        candidate: newCand,
      });

      res.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: JSON.stringify(sessionPayload),
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: false,
        sameSite: "lax",
      });

      return res;
    } else {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
    }
  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json({ error: error.errors[0]?.message || "Validation failed" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
  }
}
