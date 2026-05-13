"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  Store,
  User,
  Mail,
  Key,
  Building2,
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
} from "@/components/ui/sidebar"

const navGroups = [
  {
    label: "OVERVIEW",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
    ]
  },
  {
    label: "MANAGEMENT",
    items: [
      { icon: Users, label: "Tenants", id: "tenants" },
      { icon: Store, label: "Outlets", id: "outlets" },
      { icon: User, label: "Users", id: "users" },
    ]
  },
  {
    label: "PAYMENT",
    items: [
      { icon: Mail, label: "Gateways", id: "gateways" },
      { icon: Key, label: "Credentials", id: "merchants" },
      { icon: Building2, label: "Merchants", id: "merchants-list" },
    ]
  }
]

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  return (
    <Sidebar className="border-r border-slate-200 bg-[#f8f9fc] w-64">
      <SidebarHeader className="pt-8 pb-4 flex flex-col items-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <span className="text-[#1a73e8] text-[28px] font-medium tracking-tight">network</span>
            <span className="text-[#e91e63] text-[28px] font-bold ml-1 leading-none">{">"}</span>
          </div>
          <span className="text-[#1a73e8] text-lg -mt-2 font-light">dine</span>
        </div>
        <div className="w-full h-px bg-slate-100 mt-6" />
      </SidebarHeader>

      <SidebarContent className="px-3">
        {navGroups.map((group, idx) => (
          <SidebarGroup key={group.label} className={cn("py-2", idx > 0 && "border-t border-dotted border-slate-300")}>
            <SidebarGroupLabel className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 h-8">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      "w-full px-3 py-6 rounded-md transition-all duration-200 relative group",
                      activeTab === item.id 
                        ? "bg-[#eef4ff] text-[#1a73e8]" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 mr-3", activeTab === item.id ? "text-[#1a73e8]" : "text-slate-400")} />
                    <span className="text-[15px] font-medium">{item.label}</span>
                    {activeTab === item.id && (
                      <div className="absolute right-0 top-1 bottom-1 w-[4px] bg-[#1a73e8] rounded-l-full" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="bg-[#0f172a] rounded-[24px] p-4 flex items-center gap-3 shadow-lg">
          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-[#0f172a] font-bold text-sm shrink-0">
            SA
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-white text-[13px] font-medium truncate">Sys Admin emenu</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
