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
  SidebarGroupLabel,
  useSidebar,
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
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 bg-[#f8f9fc]">
      <SidebarHeader className="p-0 flex flex-row items-center justify-between">
        <div className="flex items-center w-full">
          <div className={cn(
            "flex items-center justify-center transition-all duration-300 ease-in-out shrink-0 overflow-hidden",
            isCollapsed ? "h-9 w-9 p-2" : "h-20 w-full"
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6718 2172" className="h-full w-full object-contain">
              <path fill="#05a" d="M2591 767c0 150.2.3 227.3 1.1 233.8 3.7 34.3 17 63.8 36.2 80.5 22.3 19.3 49.1 27.9 87.2 28 23.2.1 43.8-2.5 62.3-7.8l5.2-1.6v-35c0-33-.1-35.1-1.7-34.4-1 .3-6.5 2-12.2 3.6-26.9 7.5-54.4 5.6-70.7-4.9-9.8-6.3-15.6-15.4-19.6-30.4l-2.2-8.3-.3-125.3-.4-125.2H2784v-65h-108V543h-85zm1695 56v280l42.8-.2 42.7-.3.5-105.5.5-105.5 8.6 10c4.7 5.5 43.5 51.4 86.3 102s79.5 93.7 81.4 95.7l3.6 3.8h51.9c43.7 0 51.8-.2 51.4-1.4-.3-.7-40.4-48.5-89.2-106-48.7-57.6-88.5-105.1-88.3-105.6s40.8-48.7 90.3-107.1 90.2-106.5 90.3-107c.2-.5-22.3-.9-52.1-.9h-52.4l-90.2 106.5c-49.6 58.5-90.6 106.7-91.1 107-.6.4-1-63.3-1-172.4V543h-86zM2315 662.6c-1.9.2-7.3.9-12 1.4-47.1 5.7-93 26.9-125.4 58-18.1 17.3-33.2 37.9-43.6 59.5-28 57.5-31.4 131.6-8.9 191.5 23.6 62.8 70.7 107.1 136.6 128.3 23.8 7.8 47.2 11.1 77.3 11 65.8 0 117.9-19.3 160.1-59 7.7-7.3 24.9-26.8 24.9-28.2 0-.9-56.3-45.9-58.5-46.7-.7-.3-3.6 2.6-6.5 6.3-7.7 9.9-21.4 22.9-31.9 30.3-25.3 17.9-48.9 25.6-82.1 26.7-26.8.9-46.4-2.7-66.4-12.1-25-11.7-43.3-26.9-57.5-47.6-13.4-19.4-20.7-39.4-22.7-61.3l-.7-7.7H2542v-20.4c0-33.2-2.6-57.2-8.9-81.2-7.2-27.4-20.7-56-35.8-75.7-7.1-9.3-24.8-27.2-33.3-33.7-25.1-19.2-55.9-31.6-92.2-37.1-12.7-1.9-47.9-3.4-56.8-2.3m44.4 69c30.7 4.8 57.7 21.3 73.5 44.9 12.2 18.3 19.4 40.4 21.6 66.2l.7 8.3h-257.5l.7-7.2c2.3-23 13-46.2 31.6-68.3 17-20.3 44.4-36.3 73.5-43.1 13.9-3.2 38.2-3.5 55.9-.8m-468.4-68c-29.1 2.6-62.2 15-84.5 31.7-12 8.9-34.1 31.3-41 41.6l-5 7.3-.5-34.3-.5-34.4-39.7-.3-39.8-.2v428h85V987.6c0-71 .4-120.2 1-128.1 3.3-40.1 16.3-70.9 39.6-94.1 12.9-12.8 28.2-21.6 46.4-26.6 7.7-2.1 10.5-2.3 29.5-2.2 18.4 0 22 .3 29 2.2 10.4 2.8 24.5 9.8 32 15.9 15.7 12.7 27.8 36.4 32.4 63.4 3.8 22.1 4.1 34.9 4.1 161.6V1103h86.1l-.4-145.8c-.3-134-.4-146.5-2.1-156.2-8.2-48.6-27.4-83.1-59.9-107.7-19.6-14.7-42.4-23.9-68.7-27.7-10.8-1.6-35-2.7-43-2m1801 2c-59.9 7.1-112.9 34.2-149.2 76.3-21.1 24.3-37.3 55.6-45.3 87-5.3 20.8-5.9 27.6-5.9 58.6s.6 37.8 5.9 58.5c7.8 30.8 23 62 41.6 84.9 34.9 43.5 87.5 72.3 147.4 80.8 17.3 2.4 56.9 2.4 72.8 0 53.7-8.2 97.3-29.2 131.2-63.2 34.9-34.8 56.3-77.5 62.9-125.4 8-57.4-3.4-113.1-32.2-157.1-37.5-57.4-95.7-92-168.7-100.5-15.9-1.8-44.8-1.8-60.5.1m62.5 72.3c27.4 6.4 49 18.3 68.5 38 28.7 28.7 43 66.1 43.1 112.3 0 18.9-1.1 29-4.8 43.2-15.6 60-56 99.1-112.8 109.2-13.2 2.3-40.3 2.4-53 .1-14.8-2.6-26.3-6.4-39-12.7-26.8-13.3-47.8-34.4-61.5-61.8-13.2-26.6-18.8-53.5-17.7-85.2.9-23.3 4.5-40.2 13-60 20.3-47.4 58.1-77.1 108.4-85 3.2-.5 15-.7 26.3-.5 16.3.3 22.3.8 29.5 2.4m435.5-72.4c-29.1 4.8-57.8 19.8-81.3 42.4-11.8 11.4-19.5 21-25.4 31.7l-3.8 6.9-.3-35.8-.2-35.7h-81l.2 213.7.3 213.8h85l.5-123.5c.5-122.2.6-123.6 2.8-134.6 4.8-24.2 10.4-38.5 21.7-55.5 14.5-21.7 39.7-39.1 65.1-45 17-3.9 52.3-3.5 68.2.7l2.2.6-.2-39.3-.3-39.3-3-.9c-5.2-1.6-41-1.8-50.5-.2m-1371.7 10.8c.3.7 32.3 95.6 71.2 210.8s71.3 210.9 72.1 212.7l1.3 3.2 44.2-.2 44.2-.3 52.7-159.8c29-87.9 53-160.1 53.4-160.4.3-.4.8-.4 1.1-.1s24.6 72.5 53.9 160.4l53.3 159.9 44.5.3 44.6.2 6.5-19.2c3.5-10.6 35.6-106.4 71.2-212.8s65-194.1 65.2-194.8c.4-1-8.7-1.2-44.8-1l-45.3.3-48.2 162.2c-50.7 170.9-49.2 165.8-49.9 165.2-.2-.3-20.7-63.7-45.5-140.9-24.8-77.3-48.5-151-52.6-163.8l-7.5-23.2-45.2.2-45.1.3-51.2 162c-28.2 89.1-51.5 162.9-51.9 164l-.6 2-1-2c-.5-1.1-22.5-74.2-48.9-162.5-26.5-88.3-48.3-161.3-48.6-162.3-.5-1.6-3.6-1.7-47.1-1.7-37.9 0-46.4.2-46 1.3M4048 1384.6v64.5l-6-7.5c-14.5-18-33.8-30.3-55.1-35.3-11.1-2.5-35.8-2.3-46.1.5-18.5 5-34.5 14.2-48.1 27.7-9.8 9.8-15.6 17.8-21.1 29.6-8.3 17.5-11.2 33.9-10.3 57.9.7 17.2 2.3 26.3 7.1 39.1 5.6 15.1 11 23.3 23.1 35.5 14.4 14.5 26.1 22 42.5 27.2 16.8 5.4 37.9 6.1 54.2 1.9 19.8-5.2 38.6-17.7 52.7-35.3l6.6-8.2.3 20.9.2 20.9h33v-304h-33zm-61.8 49.9c27.7 5.8 51.2 27.5 59.7 54.9 6.5 21.1 4.4 47.1-5.4 66.6-7 13.8-18.1 25.6-32.3 33.9-16.3 9.6-37.9 12.5-56.7 7.6-26-6.7-47.3-28.5-54.7-56-3.1-11.7-3.1-37.3 0-49.7 7.6-30.4 28.2-50.8 57.7-57.3 8-1.8 23.4-1.8 31.7 0m149-90.8.3 17.8h36l.3-17.8.2-17.7h-37zm183.3 61.4c-22.2 3.2-40.8 14.7-54.8 33.8l-4.7 6.3V1409h-33v215h33v-67.3c0-63.9.1-67.8 2-75.1 4-15.7 13.2-28.9 26.2-37.7 14.4-9.8 35.8-13.2 54.8-8.7 15.3 3.6 28 13.7 34.9 28 7.1 14.5 7.1 15 7.1 92.3v68.5h33.1l-.4-75.3c-.4-81.6-.3-79.6-6.2-95.3-5.6-14.9-18.8-30.9-31.7-38.2-16.2-9.3-39.2-13.2-60.3-10.1m224.3 0c-23 3.3-41.1 13-57.9 30.8-11 11.6-18.9 23.7-23.6 36.2-5.9 15.7-6.8 21.9-6.7 45.4 0 19.4.2 21.8 2.6 30.7 5.2 18.9 12.8 33.1 25.3 46.5 19.7 21.3 44 32.5 74.1 34 33.8 1.8 66.5-10.8 89.6-34.4l5.7-5.8-10-8.8-10-8.9-4.7 4.4c-11.5 10.7-26.2 19-40.7 23-6.4 1.7-10.9 2.2-22.5 2.2-16.8.1-23-1.2-35.5-7.3-22.8-11.2-37.2-31.6-41.4-58.3l-.8-4.8h85.9c80.8 0 85.9-.1 86.6-1.8 1.2-3 .4-25.5-1.3-35.7-6.1-35.7-25.6-64-54-78.3-16.9-8.5-40.7-12-60.7-9.1m33.7 28.5c8 2.1 17.9 7.4 24.2 13 7.2 6.2 16.3 20.2 20.2 30.8 3.3 9.4 6.5 24.6 5.2 25.9-.4.4-32 .6-70.2.5l-69.4-.3.3-3c.5-6 3.6-17.2 6.7-24.5 9.6-23 29.7-40 52-44 6.9-1.2 23.7-.4 31 1.6m-439.5 82.9V1624h33v-215h-33z"/><path fill="red" d="M4753.2 675.7c.8 1 41.7 49.2 90.7 107.1l89.2 105.3-3.4 4.2c-1.9 2.3-42 49.6-89.1 105.2-47.1 55.5-85.6 101.3-85.6 101.8 0 .4 23.5.6 52.2.5l52.2-.3 86.6-102.3c47.7-56.2 88-103.7 89.6-105.6l3-3.3-90.6-106.9-90.6-106.9-52.9-.3c-50.3-.2-52.8-.1-51.3 1.5"/></svg>
          </div>
        </div>
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
      </SidebarFooter>
    </Sidebar>
  )
}
