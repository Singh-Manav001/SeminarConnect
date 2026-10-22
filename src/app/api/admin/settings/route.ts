import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/dataStore";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const settings = db.getSettings();
    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user?.role !== "admin") {
      return NextResponse.json({ error: "Only administrators can update platform settings" }, { status: 403 });
    }

    const body = await req.json();
    const { platformCommissionPercent, taxRateGst, minimumBookingLeadDays, cancellationCutoffHours } = body;

    const updated = db.updateSettings({
      ...(platformCommissionPercent !== undefined && {
        platformCommissionPercent: Number(platformCommissionPercent),
      }),
      ...(taxRateGst !== undefined && { taxRateGst: Number(taxRateGst) }),
      ...(minimumBookingLeadDays !== undefined && {
        minimumBookingLeadDays: Number(minimumBookingLeadDays),
      }),
      ...(cancellationCutoffHours !== undefined && {
        cancellationCutoffHours: Number(cancellationCutoffHours),
      }),
    });

    db.addAuditLog({
      adminId: user.id,
      action: "UPDATE_PLATFORM_SETTINGS",
      targetType: "settings",
      targetId: "global",
      details: body,
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
