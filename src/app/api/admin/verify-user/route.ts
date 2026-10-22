import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/dataStore";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user?.role !== "admin") {
      return NextResponse.json({ error: "Only administrators can perform verifications" }, { status: 403 });
    }

    const body = await req.json();
    const { type, id, status, rejectionReason } = body; // type: 'institution' | 'candidate'

    if (!type || !id || !status) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    if (type === "candidate") {
      const updated = db.updateCandidateVerification(id, status);
      if (!updated) {
        return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
      }

      db.addAuditLog({
        adminId: user.id,
        action: `VERIFY_CANDIDATE_${status.toUpperCase()}`,
        targetType: "candidate",
        targetId: id,
        details: { status, rejectionReason },
      });

      return NextResponse.json({ success: true, candidate: updated });
    } else if (type === "institution") {
      const updated = db.updateInstitutionVerification(id, status, rejectionReason);
      if (!updated) {
        return NextResponse.json({ error: "Institution not found" }, { status: 404 });
      }

      db.addAuditLog({
        adminId: user.id,
        action: `VERIFY_INSTITUTION_${status.toUpperCase()}`,
        targetType: "institution",
        targetId: id,
        details: { status, rejectionReason },
      });

      return NextResponse.json({ success: true, institution: updated });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
