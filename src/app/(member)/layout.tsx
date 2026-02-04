import { getMemberSession } from "@/lib/member-auth";
import MemberNav from "@/components/member-nav";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getMemberSession();

  // Not logged in — show only the login page wrapper
  if (!session) {
    return (
      <div className="min-h-screen bg-[#111] text-white">{children}</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <MemberNav
        firstName={session.firstName}
        lastName={session.lastName}
        pointsBalance={session.pointsBalance}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
