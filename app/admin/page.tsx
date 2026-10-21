import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { listMedia, storageMode } from "@/lib/media";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin | Nagpal Tour & Travels", robots: { index: false } };

export default async function AdminPage() {
  if (!adminConfigured()) {
    return (
      <main className="adm-login">
        <div className="adm-login-card">
          <h1>Admin is not set up yet</h1>
          <p>
            Add an <code>ADMIN_PASSWORD</code> environment variable (in <code>.env.local</code> on your computer, or in Vercel → Project → Settings →
            Environment Variables), then restart or redeploy the site.
          </p>
        </div>
      </main>
    );
  }
  if (!(await isAdmin())) redirect("/admin/login");
  return <AdminDashboard initialItems={await listMedia()} storage={storageMode} />;
}
