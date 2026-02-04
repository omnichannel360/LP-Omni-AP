import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { isAuthenticated } from "@/lib/auth";

// GET /api/products/[id] — get single product (public)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Also fetch designs
  const { data: designs } = await supabaseAdmin
    .from("designs")
    .select("*")
    .eq("product_id", id)
    .order("sort_order", { ascending: true });

  return NextResponse.json({ ...data, designs: designs || [] });
}

// PUT /api/products/[id] — update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    body.updated_at = new Date().toISOString();

    // Separate designs from product data
    const { designs, ...productData } = body;

    const { data, error } = await supabaseAdmin
      .from("products")
      .update(productData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Update designs if provided
    if (designs && Array.isArray(designs)) {
      // Delete existing designs
      await supabaseAdmin.from("designs").delete().eq("product_id", id);

      // Insert new designs
      if (designs.length > 0) {
        const designsWithProductId = designs.map(
          (d: Record<string, unknown>, i: number) => ({
            ...d,
            product_id: id,
            sort_order: i,
            id: undefined, // Let Supabase generate new IDs
          })
        );

        await supabaseAdmin.from("designs").insert(designsWithProductId);
      }
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

// DELETE /api/products/[id] — delete product (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
