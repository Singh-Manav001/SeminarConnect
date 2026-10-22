import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/dataStore";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ favorites: [] });
    }
    const favorites = db.getFavorites(user.id);
    return NextResponse.json({ favorites });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "principal") {
      return NextResponse.json({ error: "Only principals can save favorite speakers" }, { status: 403 });
    }

    const body = await req.json();
    const { candidateId } = body;

    if (!candidateId) {
      return NextResponse.json({ error: "Candidate ID is required" }, { status: 400 });
    }

    const isFav = db.toggleFavorite(user.id, candidateId);
    return NextResponse.json({ success: true, isFavorite: isFav });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
