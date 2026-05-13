
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
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
    <TooltipProvider delayDuration={0}>
      <Sidebar className="border-r border-slate-200 bg-[#f8f9fc] w-16 flex-shrink-0">
        <SidebarHeader className="pt-4 pb-4 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center h-9 w-9 bg-[#1a73e8] rounded-xl shadow-lg shadow-[#1a73e8]/20">
            <span className="text-white text-lg font-black leading-none">{">"}</span>
          </div>
          <div className="w-6 h-px bg-slate-200 mt-4" />
        </SidebarHeader>

        <SidebarContent className="px-1.5 overflow-x-hidden">
          {navGroups.map((group, idx) => (
            <SidebarGroup key={group.label} className="py-1 flex flex-col items-center">
              <SidebarMenu className="gap-1">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          isActive={activeTab === item.id}
                          onClick={() => onTabChange(item.id)}
                          className={cn(
                            "h-10 w-10 flex items-center justify-center rounded-lg transition-all duration-300 relative group",
                            activeTab === item.id 
                              ? "bg-white text-[#1a73e8] shadow-sm ring-1 ring-slate-200" 
                              : "text-slate-400 hover:text-slate-900 hover:bg-white/50"
                          )}
                        >
                          <item.icon className={cn("h-4.5 w-4.5", activeTab === item.id ? "text-[#1a73e8]" : "text-slate-400 group-hover:scale-110 transition-transform")} />
                          {activeTab === item.id && (
                            <div className="absolute left-[-6px] top-2 bottom-2 w-[3px] bg-[#1a73e8] rounded-r-full" />
                          )}
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={12} className="bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 border-none shadow-xl">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
              {idx < navGroups.length - 1 && <div className="w-4 h-px bg-slate-100 my-2" />}
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="pb-6 flex flex-col items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-9 w-9 rounded-xl bg-[#0f172a] flex items-center justify-center text-white font-black text-[10px] cursor-pointer hover:scale-105 transition-transform shadow-lg">
                SA
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12} className="bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 border-none">
              Sys Admin
            </TooltipContent>
          </Tooltip>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  )
}
