import { requireAdmin } from "@/lib/supabase/auth";
import AdminHeader from "../components/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will redirect to /account if not authenticated or not admin
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <AdminHeader userEmail={user.email || undefined} />
      <main>{children}</main>
    </div>
  );
}

