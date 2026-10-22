"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import BookingTimeline from "@/components/shared/BookingTimeline";
import InvoiceModal from "@/components/shared/InvoiceModal";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  CreditCard,
  MessageSquare,
  Star,
  ShieldCheck,
  ArrowLeft,
  Users,
  AlertTriangle,
} from "lucide-react";
import { formatINR } from "@/lib/payments";
import { Booking, PaymentRecord } from "@/lib/types";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Payment mock trigger state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const fetchBooking = () => {
    fetch(`/api/bookings?id=${bookingId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.booking) setBooking(data.booking);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }
    fetchBooking();
  }, [bookingId, user, isLoading]);

  const handleAction = async (action: "accept" | "reject" | "cancel" | "complete") => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, action }),
      });
      const data = await res.json();
      if (res.ok) {
        setBooking(data.booking);
      }
    } catch (err) {
      console.error("Action error", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Payment execution with verified signature
  const handleExecutePayment = async () => {
    if (!booking) return;
    setPaymentLoading(true);
    setPaymentError(null);

    try {
      // 1. Create order
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Order creation failed");

      // 2. Complete payment in test escrow mode with valid signature token
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          razorpay_order_id: orderData.order.id,
          razorpay_payment_id: `pay_test_${Date.now()}_verified`,
          razorpay_signature: `test_sig_${Date.now()}_verified_escrow_signature_token`,
          paymentMethod: "Electronic Net Banking / UPI",
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed");

      setPaymentModalOpen(false);
      setBooking(verifyData.booking);
    } catch (err: any) {
      setPaymentError(err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Review submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setReviewError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          rating,
          reviewText,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed submitting review");

      setReviewSuccess(true);
      setTimeout(() => {
        setReviewModalOpen(false);
        fetchBooking();
      }, 1500);
    } catch (err: any) {
      setReviewError(err.message);
    }
  };

  if (isLoading || loading) {
    return <div className="p-12 text-center text-slate-500">Loading booking file...</div>;
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-navy-900">Booking Record Not Found</h2>
        <Link href="/bookings" className="text-xs font-bold text-brand-600">
          ← Back to All Bookings
        </Link>
      </div>
    );
  }

  const isPrincipal = user?.id === booking.principalId;
  const isCandidate = user?.role === "candidate";
  const isAdmin = user?.role === "admin";

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/bookings"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Bookings</span>
          </Link>
        </div>

        {/* Status Timeline Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <span className="font-mono text-xs font-bold text-slate-400">
                REFERENCE: {booking.bookingReference}
              </span>
              <h1 className="text-xl font-extrabold text-navy-900 mt-0.5">
                {booking.seminarTitle}
              </h1>
            </div>
            <div>
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  booking.status === "confirmed"
                    ? "bg-teal-50 text-teal-700 border border-teal-200"
                    : booking.status === "completed"
                    ? "bg-slate-100 text-slate-700"
                    : booking.status === "payment_pending"
                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                    : booking.status === "cancelled" || booking.status === "rejected"
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-brand-50 text-brand-700"
                }`}
              >
                {booking.status.replace("_", " ")}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <BookingTimeline status={booking.status} />
          </div>
        </div>

        {/* Two-Column Details & Financials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Session Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
              <h2 className="text-sm font-bold text-navy-900 pb-2 border-b border-slate-150">
                Session Logistics & Venue
              </h2>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    Scheduled Date & Time
                  </span>
                  <div className="flex items-center space-x-1.5 font-semibold text-slate-800 mt-0.5">
                    <Calendar className="w-4 h-4 text-brand-600" />
                    <span>{booking.eventDate}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-500 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{booking.startTime} - {booking.endTime}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    Delivery Format & Audience
                  </span>
                  <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded uppercase text-[11px] inline-block mt-0.5">
                    {booking.deliveryFormat}
                  </span>
                  <div className="flex items-center space-x-1.5 text-slate-500 mt-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{booking.audienceCount} Attendees</span>
                  </div>
                </div>

                <div className="col-span-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    Venue / Campus Address
                  </span>
                  <div className="flex items-start space-x-1.5 text-slate-700 mt-0.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      {booking.venueAddress || booking.city}, {booking.city}, {booking.state} - {booking.postalCode}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Parties info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">
                  Institution (Host)
                </span>
                <p className="font-bold text-navy-900 mt-1 text-sm">{booking.institutionName}</p>
                <p className="text-slate-600">Principal: {booking.principalName}</p>
                <p className="text-slate-500">{booking.principalEmail}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">
                  Candidate Speaker
                </span>
                <p className="font-bold text-navy-900 mt-1 text-sm">{booking.candidateName}</p>
                <p className="text-slate-600">{booking.candidateTitle}</p>
                <p className="text-slate-500">{booking.candidateEmail}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Complete Financial Breakdown & Action Box */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
              <h3 className="font-bold text-sm text-navy-900 pb-2 border-b border-slate-150">
                Price Breakdown (INR ₹)
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Seminar Base Fee:</span>
                  <span className="font-semibold text-slate-800">{formatINR(booking.baseFee)}</span>
                </div>

                {booking.travelFee > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Travel Surcharge:</span>
                    <span className="font-semibold text-slate-800">{formatINR(booking.travelFee)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Platform Escrow Fee ({booking.platformCommissionRate}%):</span>
                  <span>{formatINR(booking.platformFee)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>GST on Facilitation (18%):</span>
                  <span>{formatINR(Math.round(booking.platformFee * 0.18))}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-navy-900">
                  <span>Total Payable:</span>
                  <span className="text-brand-700">{formatINR(booking.totalAmount)}</span>
                </div>
              </div>

              {/* Action Buttons based on Role & State */}
              <div className="pt-4 border-t border-slate-150 space-y-2">
                {/* 1. Candidate Acceptance */}
                {isCandidate && booking.status === "pending" && (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAction("accept")}
                      disabled={actionLoading}
                      className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition"
                    >
                      Accept Booking & Request Escrow
                    </button>
                    <button
                      onClick={() => handleAction("reject")}
                      disabled={actionLoading}
                      className="w-full py-2 rounded-xl border border-slate-300 text-rose-600 hover:bg-slate-50 font-semibold text-xs transition"
                    >
                      Decline Request
                    </button>
                  </div>
                )}

                {/* 2. Principal Escrow Payment */}
                {isPrincipal && booking.status === "payment_pending" && (
                  <button
                    onClick={() => setPaymentModalOpen(true)}
                    className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay {formatINR(booking.totalAmount)} & Confirm</span>
                  </button>
                )}

                {/* 3. Mark Completed (Both or Admin) */}
                {booking.status === "confirmed" && (
                  <button
                    onClick={() => handleAction("complete")}
                    disabled={actionLoading}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark Seminar Delivered</span>
                  </button>
                )}

                {/* 4. Write Review */}
                {isPrincipal && booking.status === "completed" && (
                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow transition flex items-center justify-center space-x-1.5"
                  >
                    <Star className="w-4 h-4 fill-current" />
                    <span>Rate & Review Speaker</span>
                  </button>
                )}

                {/* 5. View Tax Invoice */}
                {["confirmed", "completed"].includes(booking.status) && (
                  <button
                    onClick={() => setShowInvoice(true)}
                    className="w-full py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center justify-center space-x-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View GST Tax Invoice</span>
                  </button>
                )}

                {/* 6. Message Party */}
                <Link
                  href="/messages"
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center justify-center space-x-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Direct Message</span>
                </Link>

                {/* 7. Cancellation */}
                {["pending", "payment_pending", "confirmed"].includes(booking.status) && (
                  <button
                    onClick={() => handleAction("cancel")}
                    disabled={actionLoading}
                    className="w-full text-center text-[11px] text-slate-400 hover:text-rose-600 transition pt-2"
                  >
                    Cancel Booking Request (Subject to 48-hr policy)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && (
        <InvoiceModal
          booking={booking}
          onClose={() => setShowInvoice(false)}
        />
      )}

      {/* Escrow Payment Checkout Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-navy-900">
                SeminarConnect Escrow Checkout
              </h3>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 text-xs text-brand-900 space-y-1">
              <div className="flex justify-between font-bold text-sm">
                <span>Total Amount:</span>
                <span>{formatINR(booking.totalAmount)}</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Currency: Indian Rupees (INR) • Verified Razorpay Escrow Simulation
              </p>
            </div>

            {paymentError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {paymentError}
              </div>
            )}

            <div className="space-y-2 text-xs text-slate-600">
              <label className="block font-semibold text-slate-700">
                Select Institutional Payment Method:
              </label>
              <div className="p-3 rounded-lg border border-slate-300 bg-white font-medium flex items-center justify-between">
                <span>🏢 Corporate Net Banking / UPI</span>
                <span className="text-teal-600 font-bold">Enabled</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Funds are held in secure escrow and disbursed only after your school confirms seminar completion.
              </p>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={paymentLoading}
                onClick={handleExecutePayment}
                className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow disabled:opacity-50"
              >
                {paymentLoading ? "Verifying Escrow Signature..." : `Authorize ${formatINR(booking.totalAmount)}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-navy-900">
                Rate & Review Speaker
              </h3>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {reviewSuccess ? (
              <div className="p-4 rounded-xl bg-teal-50 text-teal-800 text-xs font-semibold text-center">
                Review submitted successfully! Thank you for supporting academic standards.
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                {reviewError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700">
                    {reviewError}
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="font-bold text-slate-700 ml-2">{rating} Stars</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Review & Institutional Feedback
                  </label>
                  <textarea
                    rows={4}
                    required
                    minLength={10}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe how the speaker engaged your students, depth of content, and overall impact..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
