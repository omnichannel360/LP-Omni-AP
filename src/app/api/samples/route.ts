import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getMemberSession } from "@/lib/member-auth";
import { generateSampleRequestNumber } from "@/lib/sample-request-number";

export async function GET() {
  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("sample_requests")
    .select("*")
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
      return NextResponse.json(
        { error: "No samples selected" },
        { status: 400 }
      );
    }

    if (
      !shipping?.firstName ||
      !shipping?.lastName ||
      !shipping?.addressLine1 ||
      !shipping?.city ||
      !shipping?.state ||
      !shipping?.postcode
    ) {
      return NextResponse.json(
        { error: "Shipping details are incomplete" },
        { status: 400 }
      );
    }

    // Create one sample request per product
    const created = [];
    for (const item of items) {
      const { data, error } = await supabaseAdmin
        .from("sample_requests")
        .insert({
          member_id: session.memberId,
          request_number: generateSampleRequestNumber(),
          product_id: item.productId,
          product_name: item.productName,
          selected_colorways: item.colorways,
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

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      created.push(data);
    }

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
