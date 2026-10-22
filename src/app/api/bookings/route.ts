import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/dataStore";
import { getCurrentUser } from "@/lib/auth/session";
import { calculateDistanceKm, getCoordinatesForCity } from "@/lib/geo";
import { calculateSeminarPricing } from "@/lib/payments";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("id");

    if (bookingId) {
      const booking = db.getBookingById(bookingId);
      if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }
      return NextResponse.json({ booking });
    }

    let allBookings = db.getBookings();

    if (user.role === "principal") {
      allBookings = allBookings.filter((b) => b.principalId === user.id);
    } else if (user.role === "candidate") {
      const cand = db.getCandidateById(user.id);
      allBookings = allBookings.filter((b) => b.candidateId === cand?.id);
    }
    // Admin sees all

    return NextResponse.json({ bookings: allBookings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "principal") {
      return NextResponse.json({ error: "Only registered principals can initiate booking requests" }, { status: 403 });
    }

    const body = await req.json();
    const {
      offeringId,
      candidateId,
      seminarTitle,
      eventDate,
      startTime,
      endTime,
      deliveryFormat,
      venueAddress,
      city,
      state,
      postalCode,
      audienceCount,
    } = body;

    if (!candidateId || !seminarTitle || !eventDate || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required booking fields" }, { status: 400 });
    }

    // 1. Double booking check
    const isDoubleBooked = db.checkDoubleBooking(candidateId, eventDate, startTime);
    if (isDoubleBooked) {
      return NextResponse.json(
        { error: "Speaker already has a confirmed or pending booking on this date and time slot. Please choose another slot." },
        { status: 409 }
      );
    }

    const candidate = db.getCandidateById(candidateId);
    if (!candidate) {
      return NextResponse.json({ error: "Speaker candidate not found" }, { status: 404 });
    }

    const institution = db.getInstitutionByProfileId(user.id);
    const offering = offeringId ? db.getOfferingById(offeringId) : undefined;

    // 2. Calculate distance and pricing
    const baseFee = offering?.basePrice || candidate.baseSeminarFee || 5000;
    const isOnline = deliveryFormat === "online";

    let distanceKm = 0;
    if (!isOnline) {
      const instCoords = institution?.latitude
        ? { lat: institution.latitude, lng: institution.longitude || 0 }
        : getCoordinatesForCity(city);
      distanceKm = calculateDistanceKm(instCoords.lat, instCoords.lng, candidate.latitude, candidate.longitude);
    }

    const travelChargePerKm = offering?.travelChargePerKm || 15;
    const pricing = calculateSeminarPricing({
      baseFee,
      isOnline,
      distanceKm,
      travelChargePerKm,
    });

    // 3. Create Booking
    const newBooking = db.createBooking({
      offeringId,
      candidateId,
      candidateName: candidate.fullName,
      candidateTitle: candidate.professionalTitle,
      candidateAvatar: candidate.avatarUrl,
      candidatePhone: candidate.phone,
      candidateEmail: candidate.email,
      principalId: user.id,
      principalName: user.fullName,
      institutionName: institution?.institutionName || "Educational Institution",
      principalPhone: user.phone,
      principalEmail: user.email,
      seminarTitle,
      eventDate,
      startTime,
      endTime,
      deliveryFormat,
      venueAddress: venueAddress || institution?.address || "",
      city: city || institution?.city || "New Delhi",
      state: state || institution?.state || "Delhi",
      postalCode: postalCode || institution?.postalCode || "110001",
      audienceCount: Number(audienceCount) || 50,
      baseFee: pricing.baseFee,
      travelFee: pricing.travelFee,
      platformCommissionRate: pricing.platformCommissionRate,
      platformFee: pricing.platformFee,
      totalAmount: pricing.totalAmount,
      candidatePayoutAmount: pricing.candidatePayoutAmount,
      status: "pending",
    });

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Booking failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { bookingId, action, reason, rescheduleNotes } = body;

    if (!bookingId || !action) {
      return NextResponse.json({ error: "Booking ID and action are required" }, { status: 400 });
    }

    const booking = db.getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    let nextStatus = booking.status;

    // State machine transitions:
    // candidate can 'accept', 'reject', 'propose_reschedule'
    // principal can 'pay' (moves to confirmed via payment route) or 'cancel'
    // admin can resolve or cancel
    if (action === "accept") {
      nextStatus = "payment_pending";
    } else if (action === "reject") {
      nextStatus = "rejected";
    } else if (action === "cancel") {
      nextStatus = "cancelled";
    } else if (action === "reschedule") {
      nextStatus = "rescheduled";
    } else if (action === "complete") {
      nextStatus = "completed";
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updated = db.updateBookingStatus(bookingId, nextStatus, reason, rescheduleNotes);

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
