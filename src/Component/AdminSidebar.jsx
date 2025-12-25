"use client";

import {
  LayoutDashboard,
  Home,
  Users,
  BookOpen,
  Flag,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Image from "next/image";

const adminItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard Home", url: "/dashboard/admin", icon: LayoutDashboard },
  { title: "Manage Users", url: "/dashboard/admin/manage-users", icon: Users },
  {
    title: "Manage Lessons",
    url: "/dashboard/admin/manage-lessons",
    icon: BookOpen,
  },
  {
    title: "Reported/Flagged Lessons",
    url: "/dashboard/admin/reported-lessons",
    icon: Flag,
  },
  { title: "Admin Profile", url: "/dashboard/admin/profile", icon: UserCog },
];

export function AdminSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border py-4">
        <div className="flex items-center justify-center px-2">
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarMenu>
          {adminItems.map((item) => {
            const isActive = pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className="data-[active=true]:bg-primary data-[active=true]:text-primary-content hover:bg-primary hover:text-primary-content"
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip={session?.user?.name || "Account"}
            >
              <Link
                href="/dashboard/admin/profile"
                className="flex items-center gap-3"
              >
                <div className="relative w-8 h-8 flex-shrink-0">
                  <Image
                    src={session?.user?.image || "/default-avatar.png"}
                    width={32}
                    height={32}
                    alt={session?.user?.name || "Admin"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-sm font-medium truncate w-full">
                    {session?.user?.name || "Admin"}
                  </span>
                  <span className="text-xs text-sidebar-foreground/70 truncate w-full">
                    {session?.user?.email || ""}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
