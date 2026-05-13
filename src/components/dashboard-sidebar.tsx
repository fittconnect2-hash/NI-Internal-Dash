
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
  ChevronLeft,
  ChevronRight,
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
  SidebarTrigger,
  useSidebar,
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
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 bg-[#f8f9fc]">
      <SidebarHeader className="py-4 px-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 bg-[#1a73e8] rounded-xl shadow-lg shadow-[#1a73e8]/20 shrink-0">
            <span className="text-white text-lg font-black leading-none">{">"}</span>
          </div>
          {!isCollapsed && (
            <span className="font-black text-slate-900 tracking-tight text-sm animate-in fade-in slide-in-from-left-2 duration-300">
              NETWORKDINE
            </span>
          )}
        </div>
        {!isCollapsed && (
          <SidebarTrigger className="h-8 w-8 p-0 border border-slate-200 bg-white hover:bg-slate-50 shadow-sm" />
        )}
      </SidebarHeader>

      <SidebarContent className="px-2">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-2 px-0">
            {!isCollapsed && (
              <SidebarGroupLabel className="text-[10px] font-bold text-slate-400 tracking-widest px-2 mb-1">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarMenu className="gap-0.5">
              {group.items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    tooltip={item.label}
                    className={cn(
                      "h-10 transition-all duration-300 relative group px-2",
                      activeTab === item.id 
                        ? "bg-white text-[#1a73e8] shadow-sm ring-1 ring-slate-200 font-bold" 
                        : "text-slate-400 hover:text-slate-900 hover:bg-white/50"
                    )}
                  >
                    <item.icon className={cn("h-4.5 w-4.5", activeTab === item.id ? "text-[#1a73e8]" : "text-slate-400 group-hover:scale-110 transition-transform")} />
                    <span className="ml-2">{item.label}</span>
                    {activeTab === item.id && isCollapsed && (
                      <div className="absolute left-[-8px] top-2 bottom-2 w-[3px] bg-[#1a73e8] rounded-r-full" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-slate-100 bg-slate-50/30">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="h-9 w-9 rounded-xl bg-[#0f172a] flex items-center justify-center text-white font-black text-[10px] shrink-0 shadow-lg">
            SA
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2">
              <span className="text-xs font-black text-slate-900 leading-none mb-0.5">Sys Admin</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Level 4</span>
            </div>
          )}
        </div>
        {isCollapsed && (
          <div className="mt-4 flex justify-center">
            <SidebarTrigger className="h-8 w-8 p-0 border border-slate-200 bg-white hover:bg-slate-50 shadow-sm" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
