import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/dataStore";
import { getCurrentUser } from "@/lib/auth/session";
import { SeminarRequirementSchema } from "@/lib/validators";

export async function GET() {
  try {
    const requirements = db.getRequirements();
    return NextResponse.json({ requirements });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "principal") {
      return NextResponse.json({ error: "Only school/college principals can post seminar requirements" }, { status: 403 });
    }

    const institution = db.getInstitutionByProfileId(user.id);
    const body = await req.json();
    const validated = SeminarRequirementSchema.parse(body);

    const newReq = db.createRequirement({
      principalId: user.id,
      principalName: user.fullName,
      institutionName: institution?.institutionName || "Educational Institution",
      title: validated.title,
      categoryId: validated.categoryId,
      description: validated.description,
      targetDate: validated.targetDate,
      startTime: validated.startTime,
      durationMinutes: validated.durationMinutes,
      deliveryFormat: validated.deliveryFormat,
      city: validated.city,
      state: validated.state,
      postalCode: validated.postalCode,
      audienceSize: validated.audienceSize,
      budget: validated.budget,
      preferredLanguage: validated.preferredLanguage,
    });

    return NextResponse.json({ success: true, requirement: newReq });
  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json({ error: error.errors[0]?.message || "Validation failed" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
