"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Building2,
  Store,
  Users,
  CreditCard,
  UserCheck,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"

const navGroups = [
  {
    label: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
    ]
  },
  {
    label: "Management",
    items: [
      { icon: Building2, label: "Tenants", id: "tenants" },
      { icon: Store, label: "Outlets", id: "outlets" },
      { icon: Users, label: "Users", id: "users" },
    ]
  },
  {
    label: "Configuration",
    items: [
      { icon: CreditCard, label: "Payments", id: "gateways" },
      { icon: UserCheck, label: "Merchants", id: "merchants" },
    ]
  }
]

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="px-6 py-8">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
            <span className="text-white font-black text-lg">D</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm tracking-tight">DineNet</span>
            <span className="text-white/40 text-[10px] font-medium tracking-wider uppercase">Network Admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 scrollbar-hide">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-2">
            <SidebarGroupLabel className="px-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeTab === item.id}
                      onClick={() => onTabChange(item.id)}
                      className={cn(
                        "w-full px-3 py-2 rounded-md transition-colors",
                        activeTab === item.id 
                          ? "bg-sidebar-accent text-white" 
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      <span className="text-sm font-medium">{item.label}</span>
                      {activeTab === item.id && <ChevronRight className="ml-auto h-3 w-3 opacity-50" />}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
            SA
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-white text-xs font-semibold truncate">System Administrator</p>
            <p className="text-white/40 text-[10px] truncate">Admin Account</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
