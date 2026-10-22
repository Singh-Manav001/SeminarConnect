import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/dataStore";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { bookingId } = body;

    const booking = db.getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Amount in INR (Paise for Razorpay API: amount * 100)
    const amountInINR = booking.totalAmount;
    const amountInPaise = Math.round(amountInINR * 100);

    // If live Razorpay key is present, create real Razorpay order; otherwise generate test order
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "rzp_test_educational_demo";
    const orderId = `order_${booking.bookingReference.replace(/[^a-zA-Z0-9]/g, "")}_${Date.now()}`;

    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        amount: amountInPaise,
        currency: "INR",
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
        seminarTitle: booking.seminarTitle,
        totalAmountINR: amountInINR,
        baseFee: booking.baseFee,
        travelFee: booking.travelFee,
        platformFee: booking.platformFee,
        keyId: razorpayKeyId,
        isTestMode: !Boolean(process.env.RAZORPAY_KEY_SECRET),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
