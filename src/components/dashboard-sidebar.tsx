
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
    label: "SYSTEM",
    items: [
      { icon: CreditCard, label: "Pay Gateways", id: "gateways" },
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
    <Sidebar className="border-r border-slate-100 bg-white">
      <SidebarHeader className="p-8 pb-12">
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-[#0071BC] font-black text-3xl tracking-tighter">network</span>
            <span className="text-[#EE3124] font-black text-3xl tracking-tighter mx-0.5">&gt;</span>
          </div>
          <span className="text-[#0071BC] font-bold text-[10px] tracking-[0.35em] -mt-1.5 ml-8 opacity-60 uppercase">dine</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-0 py-0 scrollbar-hide">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-4">
            <SidebarGroupLabel className="px-8 text-[11px] font-black tracking-[0.2em] text-slate-300 mb-3">
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
                        "w-full px-8 py-8 rounded-none transition-all duration-300 border-l-[4px] border-transparent",
                        activeTab === item.id 
                          ? "bg-[#E3F2FD] text-[#0071BC] border-l-[#0071BC] font-black" 
                          : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50 font-bold"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5 mr-4", activeTab === item.id ? "text-[#0071BC]" : "text-slate-300")} />
                      <span className="text-[13px] uppercase tracking-wider">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-8">
        <div className="bg-[#121A26] rounded-[24px] p-5 flex items-center gap-4 shadow-xl border border-white/5 group hover:bg-[#1A2533] transition-colors cursor-pointer">
          <div className="h-11 w-11 rounded-2xl bg-[#0071BC] flex items-center justify-center text-white font-black text-xs shrink-0 shadow-lg shadow-blue-500/20">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-sm truncate leading-none mb-1">Sys Admin</p>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest truncate">Administrator</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
