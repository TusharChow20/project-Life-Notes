"use client";

import {
  LayoutDashboard,
  Home,
  PlusCircle,
  BookOpen,
  Heart,
  User,
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

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard Home", url: "/dashboard", icon: LayoutDashboard },
  { title: "Add Lesson", url: "/dashboard/add-lesson", icon: PlusCircle },
  { title: "My Lessons", url: "/dashboard/my-lesson", icon: BookOpen },
  { title: "My Favorites", url: "/dashboard/my-favourite", icon: Heart },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

export function AppSidebar() {
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
          {items.map((item) => {
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
                href="/dashboard/profile"
                className="flex items-center gap-3"
              >
                <div className="relative w-8 h-8 flex-shrink-0">
                  <Image
                    src={session?.user?.image || "/default-avatar.png"}
                    width={32}
                    height={32}
                    alt={session?.user?.name || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-sm font-medium truncate w-full">
                    {session?.user?.name || "User"}
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
