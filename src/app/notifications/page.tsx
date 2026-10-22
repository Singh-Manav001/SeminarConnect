"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Bell, Check, ArrowRight } from "lucide-react";
import { NotificationItem } from "@/lib/types";

export default function NotificationsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) setNotifications(data.notifications);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }
    fetchNotifs();
  }, [user, isLoading]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed marking read", err);
    }
  };

  if (isLoading || loading) {
    return <div className="p-12 text-center text-slate-500">Loading notifications...</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-brand-600">
            Activity Updates
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
            Notifications Center
          </h1>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <Bell className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-navy-900">No notifications</h3>
            <p className="text-xs text-slate-500">
              You are all caught up! New requests and updates will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card divide-y divide-slate-100 overflow-hidden">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 flex items-start justify-between gap-4 transition ${
                  n.isRead ? "bg-white" : "bg-brand-50/30"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-xs text-navy-900">{n.title}</h3>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{n.message}</p>
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {n.link && (
                    <Link
                      href={n.link}
                      onClick={() => handleMarkAsRead(n.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-xs font-semibold transition"
                    >
                      View
                    </Link>
                  )}
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
