"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Send, MessageSquare, User, CheckCircle2 } from "lucide-react";
import { ConversationMessage } from "@/lib/types";

export default function MessagesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) setMessages(data.messages);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }
    fetchMessages();
  }, [user, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: "general-inquiry",
          messageText: inputText,
          receiverId: user.role === "principal" ? "user-speaker-1" : "user-principal-1",
        }),
      });

      if (res.ok) {
        setInputText("");
        fetchMessages();
      }
    } catch (err) {
      console.error("Message send failed", err);
    }
  };

  if (isLoading || loading) {
    return <div className="p-12 text-center text-slate-500">Loading messages...</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-brand-600">
            Institutional Communications
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
            Seminar Discussion Channel
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Coordinate session details, lab equipment, and student preparation with resource faculty.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-card flex flex-col h-[650px] overflow-hidden">
          {/* Thread Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                {user?.role === "principal" ? "DR" : "PS"}
              </div>
              <div>
                <h3 className="font-bold text-xs text-navy-900">
                  {user?.role === "principal" ? "Dr. Ananya Roy (AI Faculty)" : "Dr. Rajesh Sharma (Principal, DPS)"}
                </h3>
                <span className="text-[10px] text-teal-600 font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  <span>Active & Verified</span>
                </span>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-16 text-xs text-slate-400">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>No messages yet. Send a query regarding lab setup or syllabus customization!</p>
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.senderId === user?.id;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1 text-[11px] text-slate-400">
                      <span className="font-bold text-slate-600">{m.senderName}</span>
                      <span>•</span>
                      <span>
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? "bg-brand-600 text-white rounded-br-none shadow-sm"
                          : "bg-slate-100 text-slate-800 rounded-bl-none"
                      }`}
                    >
                      {m.messageText}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-slate-200">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message or question about the seminar..."
                className="flex-1 p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
              />
              <button
                type="submit"
                className="p-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
