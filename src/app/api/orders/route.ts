import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getMemberSession } from "@/lib/member-auth";
import { generateOrderNumber } from "@/lib/order-number";

export async function GET() {
  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("member_id", session.memberId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { items, shipping } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!shipping?.firstName || !shipping?.lastName || !shipping?.addressLine1 || !shipping?.city || !shipping?.state || !shipping?.postcode) {
      return NextResponse.json({ error: "Shipping details are incomplete" }, { status: 400 });
    }

    // Validate items against current prices
    const variantIds = items.map((i: { variantId: string }) => i.variantId);
    const { data: variants } = await supabaseAdmin
      .from("product_variants")
      .select("*, products(name)")
      .in("id", variantIds);

    if (!variants || variants.length !== items.length) {
      return NextResponse.json(
        { error: "Some items are no longer available" },
        { status: 400 }
      );
    }

    // Calculate totals
    let subtotalCents = 0;
    const orderItems = items.map((item: { variantId: string; quantity: number }) => {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) throw new Error("Variant not found");

      const lineTotalCents = variant.price_cents * item.quantity;
      subtotalCents += lineTotalCents;

      return {
        product_variant_id: variant.id,
        product_name: (variant as Record<string, unknown>).products
          ? ((variant as Record<string, unknown>).products as { name: string }).name
          : "Unknown Product",
        variant_description: `${variant.thickness} / ${variant.size} / ${variant.face_color}`,
        quantity: item.quantity,
        unit_price_cents: variant.price_cents,
        line_total_cents: lineTotalCents,
      };
    });

    // Get discount (max of member discount and global discount)
    const { data: settings } = await supabaseAdmin
      .from("global_settings")
      .select("*")
      .limit(1)
      .single();

    const globalDiscount = settings ? Number(settings.global_discount_percent) : 0;
    const memberDiscount = session.discountPercent;
    const appliedDiscount = Math.max(globalDiscount, memberDiscount);
    const discountAmountCents = Math.round(
      subtotalCents * (appliedDiscount / 100)
    );
    const totalCents = subtotalCents - discountAmountCents;

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        member_id: session.memberId,
        order_number: generateOrderNumber(),
        status: "pending",
        subtotal_cents: subtotalCents,
        discount_percent: appliedDiscount,
        discount_amount_cents: discountAmountCents,
        total_cents: totalCents,
        shipping_first_name: shipping.firstName,
        shipping_last_name: shipping.lastName,
        shipping_company: shipping.company || null,
        shipping_address_line1: shipping.addressLine1,
        shipping_address_line2: shipping.addressLine2 || null,
        shipping_city: shipping.city,
        shipping_state: shipping.state,
        shipping_postcode: shipping.postcode,
        shipping_country: shipping.country || "Australia",
        shipping_phone: shipping.phone || null,
        notes: shipping.notes || null,
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // Create order items
    const itemsWithOrderId = orderItems.map((item: Record<string, unknown>) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(itemsWithOrderId);

    if (itemsError) {
      // Rollback order
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
