import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/dataStore";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");
    const messages = db.getMessages(bookingId || undefined);
    return NextResponse.json({ messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { conversationId, receiverId, messageText } = body;

    if (!messageText || !conversationId) {
      return NextResponse.json({ error: "Missing required message parameters" }, { status: 400 });
    }

    const newMsg = db.sendMessage({
      conversationId,
      senderId: user.id,
      senderName: user.fullName,
      senderRole: user.role,
      receiverId: receiverId || "user-principal-1",
      messageText,
    });

    return NextResponse.json({ success: true, message: newMsg });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
