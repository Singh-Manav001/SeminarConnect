"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SpeakerCard from "@/components/shared/SpeakerCard";
import { Heart, Search, ArrowRight } from "lucide-react";

export default function FavoritesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [favorites, setFavorites] = useState<string[]>([]);
  const [speakers, setSpeakers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    Promise.all([
      fetch("/api/favorites").then((r) => r.json()),
      fetch("/api/speakers").then((r) => r.json()),
    ])
      .then(([favRes, spkRes]) => {
        if (favRes.favorites) setFavorites(favRes.favorites);
        if (spkRes.speakers) setSpeakers(spkRes.speakers);
      })
      .finally(() => setLoading(false));
  }, [user, isLoading, router]);

  if (isLoading || loading) {
    return <div className="p-12 text-center text-slate-500">Loading favorites...</div>;
  }

  const favoriteSpeakers = speakers.filter((s) => favorites.includes(s.id));

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-brand-600">
            Saved Candidates
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
            Favorite Academic Speakers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Speakers shortlisted by your institution for upcoming curriculum modules.
          </p>
        </div>

        {favoriteSpeakers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <Heart className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-navy-900">No favorite speakers saved yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore our verified faculty directory and click the heart icon to save speakers for future seminars.
            </p>
            <Link
              href="/speakers"
              className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow"
            >
              Discover Speakers
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteSpeakers.map((speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
