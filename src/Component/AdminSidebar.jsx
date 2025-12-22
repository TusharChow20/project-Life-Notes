"use client";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  Flag,
  UserCog,
} from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const adminItems = [
  {
    title: "Dashboard",
    url: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Users",
    url: "/dashboard/admin/manage-users",
    icon: Users,
  },
  {
    title: "Manage Lessons",
    url: "/dashboard/admin/manage-lessons",
    icon: BookOpen,
  },
  {
    title: "Reported Lessons",
    url: "/dashboard/admin/reported-lessons",
    icon: Flag,
  },
  {
    title: "Admin Profile",
    url: "/dashboard/admin/profile",
    icon: UserCog,
  },
];

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
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
    </Sidebar>
  );
}
