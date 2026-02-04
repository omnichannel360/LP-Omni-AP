import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import MemberForm from "@/components/admin/member-form";

export default async function EditMember({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: member } = await supabaseAdmin
    .from("members")
    .select("*")
    .eq("id", id)
    .single();

  if (!member) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Member</h1>
      <MemberForm member={member} />
    </div>
  );
}
