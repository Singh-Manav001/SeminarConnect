import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/dataStore";
import { getCurrentUser } from "@/lib/auth/session";
import { ReviewSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get("candidateId");
    const reviews = db.getReviews(candidateId || undefined);
    return NextResponse.json({ reviews });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "principal") {
      return NextResponse.json({ error: "Only school/college principals can submit seminar reviews" }, { status: 403 });
    }

    const body = await req.json();
    const validated = ReviewSchema.parse(body);

    const booking = db.getBookingById(validated.bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.principalId !== user.id) {
      return NextResponse.json({ error: "You can only review bookings made by your institution" }, { status: 403 });
    }

    if (booking.status !== "completed") {
      return NextResponse.json({ error: "Reviews can only be submitted for completed seminars" }, { status: 400 });
    }

    const institution = db.getInstitutionByProfileId(user.id);

    const review = db.addReview({
      bookingId: booking.id,
      principalId: user.id,
      principalName: user.fullName,
      institutionName: institution?.institutionName || "Educational Institution",
      candidateId: booking.candidateId,
      offeringId: booking.offeringId,
      rating: validated.rating,
      reviewText: validated.reviewText,
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json({ error: error.errors[0]?.message || "Validation failed" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
