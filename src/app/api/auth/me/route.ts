import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/dataStore";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null });
    }

    let institution = null;
    let candidate = null;

    if (user.role === "principal") {
      institution = db.getInstitutionByProfileId(user.id) || null;
    } else if (user.role === "candidate") {
      candidate = db.getCandidateById(user.id) || null;
    }

    return NextResponse.json({
      user,
      institution,
      candidate,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
