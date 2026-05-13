"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Building2,
  Store,
  Users,
  CreditCard,
  Key,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar
} from "@/components/ui/sidebar"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Building2, label: "Tenants", id: "tenants" },
  { icon: Store, label: "Outlets", id: "outlets" },
  { icon: Users, label: "Users", id: "users" },
  { icon: CreditCard, label: "Gateways", id: "gateways" },
  { icon: Key, label: "Credentials", id: "credentials" },
  { icon: UserCheck, label: "Merchants", id: "merchants" },
]

export function DashboardSidebar() {
  const [activeTab, setActiveTab] = React.useState("tenants")

  return (
    <Sidebar className="border-r shadow-sm">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">D</span>
          </div>
          <span className="font-headline font-bold text-xl tracking-tight">DineNet</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full px-4 py-6 rounded-xl transition-all duration-200",
                  activeTab === item.id 
                    ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-6 space-y-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
              <Settings className="h-5 w-5 mr-3" />
              <span className="font-medium">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-muted-foreground hover:text-destructive transition-colors px-4 py-2">
              <LogOut className="h-5 w-5 mr-3" />
              <span className="font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}