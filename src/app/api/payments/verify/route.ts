import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/dataStore";
import { getCurrentUser } from "@/lib/auth/session";
import { verifyRazorpaySignature } from "@/lib/payments";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentMethod = "UPI / Card",
    } = body;

    const booking = db.getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Verify signature
    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Payment verification failed: Invalid signature" }, { status: 400 });
    }

    // Record verified payment
    const payment = db.createPayment({
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      principalId: user.id,
      principalName: user.fullName,
      institutionName: booking.institutionName,
      paymentGateway: "razorpay",
      gatewayOrderId: razorpay_order_id,
      gatewayPaymentId: razorpay_payment_id,
      amount: booking.totalAmount,
      currency: "INR",
      status: "completed",
      receiptUrl: `/invoices/INV-2026-${booking.bookingReference.split("-")[2]}.pdf`,
      paymentMethod,
    });

    // Notify Speaker that booking is officially confirmed & funded in escrow
    const cand = db.getCandidateById(booking.candidateId);
    if (cand) {
      db.createNotification({
        userId: cand.profileId,
        title: "Booking Confirmed & Funded",
        message: `${booking.institutionName} has completed payment for "${booking.seminarTitle}" on ${booking.eventDate}.`,
        link: `/bookings/${booking.id}`,
        type: "payment",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and booking confirmed",
      payment,
      booking: db.getBookingById(booking.id),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Payment verification failed" }, { status: 500 });
  }
}
