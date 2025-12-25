import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/Component/app-sidebar";

export default async function DashboardLayout({ children }) {
  //   const session = await getServerSession(authOptions);

  //   if (!session) {
  //     redirect("/login");
  //   }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full max-w-7xl">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 bg-base-100 border-b border-base-300 p-4">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
