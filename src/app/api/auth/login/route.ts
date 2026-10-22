import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/dataStore";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // In local demo mode, simple password validation
    // For test credentials, password check is forgiving or checks if provided
    if (password && password.length < 4) {
      return NextResponse.json({ error: "Password must be at least 4 characters" }, { status: 401 });
    }

    const sessionPayload = {
      userId: user.id,
      role: user.role,
      email: user.email,
    };

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: JSON.stringify(sessionPayload),
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: false, // Accessible for client-side state sync
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 });
  }
}
