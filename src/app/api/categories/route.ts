import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/dataStore";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const categories = db.getCategories();
    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user?.role !== "admin") {
      return NextResponse.json({ error: "Only administrators can manage categories" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, iconName, displayOrder } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newCategory = db.addCategory({
      name,
      slug,
      description: description || "",
      iconName: iconName || "BookOpen",
      displayOrder: displayOrder || 99,
      isActive: true,
    });

    db.addAuditLog({
      adminId: user.id,
      action: "CREATE_CATEGORY",
      targetType: "category",
      targetId: newCategory.id,
      details: { name: newCategory.name },
    });

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user?.role !== "admin") {
      return NextResponse.json({ error: "Only administrators can modify categories" }, { status: 403 });
    }

    const body = await req.json();
    const { id, name, description, isActive, displayOrder } = body;

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const updated = db.updateCategory(id, {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(isActive !== undefined && { isActive }),
      ...(displayOrder !== undefined && { displayOrder }),
    });

    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    db.addAuditLog({
      adminId: user.id,
      action: "UPDATE_CATEGORY",
      targetType: "category",
      targetId: id,
      details: body,
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
