"use client";

import { Calendar, Home, Inbox, Search, Settings, User, X } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "My Lessons", url: "/dashboard/my-lesson", icon: Inbox },
  { title: "Calendar", url: "/dashboard/calendar", icon: Calendar },
  { title: "Search", url: "/dashboard/search", icon: Search },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const { setOpenMobile, isMobile } = useSidebar();

  return (
    <Sidebar>
      {isMobile && (
        <SidebarHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold px-2">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenMobile(false)}
              className="md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SidebarHeader>
      )}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3"
              >
                <Image
                  src={session?.user?.image || "/default-avatar.png"}
                  width={8}
                  height={8}
                  alt={session?.user?.name || "User"}
                  className="w-8 h-8 rounded-full"
                />
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
