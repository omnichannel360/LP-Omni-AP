import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("productId");

  let query = supabaseAdmin
    .from("product_variants")
    .select("*, products(name)")
    .order("created_at", { ascending: false });

  if (productId) {
    query = query.eq("product_id", productId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, thickness, size, faceColor, colorwayCode, sku, priceCents } = body;

    if (!productId || !thickness || !size || !faceColor || !priceCents) {
      return NextResponse.json(
        { error: "Product, thickness, size, face color, and price are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("product_variants")
      .insert({
        product_id: productId,
        thickness,
        size,
        face_color: faceColor,
        colorway_code: colorwayCode || null,
        sku: sku || null,
        price_cents: priceCents,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
