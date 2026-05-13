"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Building2,
  Store,
  Users,
  CreditCard,
  Key,
  UserCheck
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
    label: "OVERVIEW",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
    ]
  },
  {
    label: "MANAGEMENT",
    items: [
      { icon: Building2, label: "Tenants", id: "tenants" },
      { icon: Store, label: "Outlets", id: "outlets" },
      { icon: Users, label: "Users", id: "users" },
    ]
  },
  {
    label: "PAYMENT",
    items: [
      { icon: CreditCard, label: "Gateways", id: "gateways" },
      { icon: Key, label: "Credentials", id: "credentials" },
      { icon: UserCheck, label: "Merchants", id: "merchants" },
    ]
  }
]

export function DashboardSidebar() {
  const [activeTab, setActiveTab] = React.useState("tenants")

  return (
    <Sidebar className="border-r border-slate-100 bg-white">
      <SidebarHeader className="p-8 pb-10">
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-[#0071BC] font-black text-3xl tracking-tighter">network</span>
            <span className="text-[#EE3124] font-black text-3xl tracking-tighter mx-0.5">&gt;</span>
          </div>
          <span className="text-[#0071BC] font-bold text-[10px] tracking-[0.3em] -mt-1.5 ml-8 opacity-80 uppercase">dine</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-0 py-0">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-4">
            <SidebarGroupLabel className="px-8 text-[11px] font-bold tracking-[0.15em] text-slate-400 mb-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeTab === item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full px-8 py-7 rounded-none transition-all duration-300 border-l-[4px] border-transparent",
                        activeTab === item.id 
                          ? "bg-[#E3F2FD] text-[#0071BC] border-l-[#0071BC] font-bold" 
                          : "text-slate-500 hover:bg-slate-50 font-medium"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5 mr-4", activeTab === item.id ? "text-[#0071BC]" : "text-slate-400")} />
                      <span className="text-sm">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-6">
        <div className="bg-[#121A26] rounded-2xl p-4 flex items-center gap-4 shadow-lg">
          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-[#121A26] font-bold text-xs shrink-0">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-xs truncate">Sys Admin emenu</p>
            <p className="text-white/40 text-[10px] font-medium truncate mt-0.5">Administrator</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
