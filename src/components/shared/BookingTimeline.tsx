import React from "react";
import { Check, Clock, AlertCircle, XCircle } from "lucide-react";
import { BookingStatus } from "@/lib/types";

interface TimelineProps {
  status: BookingStatus;
}

export default function BookingTimeline({ status }: TimelineProps) {
  const steps = [
    { key: "pending", label: "Request Sent" },
    { key: "payment_pending", label: "Speaker Accepted" },
    { key: "confirmed", label: "Escrow Funded" },
    { key: "completed", label: "Seminar Delivered" },
  ];

  const getStepState = (stepKey: string) => {
    if (status === "cancelled" || status === "rejected") {
      return "cancelled";
    }

    const order = ["pending", "accepted", "payment_pending", "confirmed", "completed"];
    const currentIndex = order.indexOf(status === "accepted" ? "payment_pending" : status);
    const stepIndex = order.indexOf(stepKey);

    if (stepIndex < currentIndex) return "done";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  if (status === "cancelled" || status === "rejected") {
    return (
      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-3 text-rose-800">
        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
        <div>
          <h4 className="text-sm font-semibold capitalize">Booking {status}</h4>
          <p className="text-xs text-rose-600 mt-0.5">
            This booking was {status}. No further charges or obligations apply.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-slate-200 z-0"></div>

        {steps.map((step, idx) => {
          const state = getStepState(step.key);
          const isDone = state === "done";
          const isCurrent = state === "current";

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                  isDone
                    ? "bg-teal-600 text-white"
                    : isCurrent
                    ? "bg-brand-600 text-white ring-4 ring-brand-100"
                    : "bg-white border-2 border-slate-300 text-slate-400"
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span
                className={`text-[11px] font-medium mt-1.5 text-center ${
                  isCurrent
                    ? "text-brand-700 font-bold"
                    : isDone
                    ? "text-teal-700"
                    : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
