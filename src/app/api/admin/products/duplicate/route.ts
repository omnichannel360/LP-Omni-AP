import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    // Fetch original product
    const { data: original, error: fetchErr } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !original) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Remove id and timestamps
    const { id: _id, created_at: _ca, updated_at: _ua, ...productData } = original;

    // Create duplicate with modified name/slug
    const { data: duplicate, error: insertErr } = await supabaseAdmin
      .from("products")
      .insert({
        ...productData,
        name: `${original.name} (Copy)`,
        slug: `${original.slug}-copy-${Date.now().toString(36)}`,
        status: "draft",
      })
      .select()
      .single();

    if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });

    // Duplicate designs
    const { data: designs } = await supabaseAdmin
      .from("designs")
      .select("*")
      .eq("product_id", id);

    if (designs && designs.length > 0) {
      const designRows = designs.map((d) => ({
        product_id: duplicate.id,
        name: d.name,
        image_url: d.image_url,
        position: d.position,
      }));
      await supabaseAdmin.from("designs").insert(designRows);
    }

    // Duplicate variants
    const { data: variants } = await supabaseAdmin
      .from("product_variants")
      .select("*")
      .eq("product_id", id);

    if (variants && variants.length > 0) {
      const variantRows = variants.map((v) => ({
        product_id: duplicate.id,
        thickness: v.thickness,
        size: v.size,
        face_color: v.face_color,
        colorway_code: v.colorway_code,
        sku: v.sku ? `${v.sku}-COPY` : null,
        price_cents: v.price_cents,
        is_available: v.is_available,
      }));
      await supabaseAdmin.from("product_variants").insert(variantRows);
    }

    return NextResponse.json(duplicate, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
