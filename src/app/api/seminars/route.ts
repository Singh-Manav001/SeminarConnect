import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/dataStore";
import { getCurrentUser } from "@/lib/auth/session";
import { SeminarOfferingSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get("candidateId");
    let offerings = db.getOfferings();

    if (candidateId) {
      offerings = offerings.filter((o) => o.candidateId === candidateId);
    }

    return NextResponse.json({ offerings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "candidate") {
      return NextResponse.json({ error: "Only speaker candidates can create seminar packages" }, { status: 403 });
    }

    const candidate = db.getCandidateById(user.id);
    if (!candidate) {
      return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const validated = SeminarOfferingSchema.parse(body);

    const newOffering = db.createOffering({
      candidateId: candidate.id,
      title: validated.title,
      categoryId: validated.categoryId,
      description: validated.description,
      learningOutcomes: validated.learningOutcomes,
      targetAudience: validated.targetAudience,
      sessionDurationMinutes: validated.sessionDurationMinutes,
      maxAudienceSize: validated.maxAudienceSize,
      deliveryFormat: validated.deliveryFormat,
      basePrice: validated.basePrice,
      travelChargePerKm: validated.travelChargePerKm,
    });

    return NextResponse.json({ success: true, offering: newOffering });
  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json({ error: error.errors[0]?.message || "Validation failed" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
