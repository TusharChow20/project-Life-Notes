import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppSidebar } from "@/Component/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // 🚫 BLOCK ADMINS FROM USER DASHBOARD
  if (session.user.role === "admin") {
    redirect("/dashboard/admin");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
