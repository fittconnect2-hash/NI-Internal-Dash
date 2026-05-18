"use client"

import * as React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardHeader() {
  return (
    <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-6 shrink-0 z-30">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-9 w-9 border border-slate-200 bg-white hover:bg-slate-50 shadow-sm rounded-lg" />
      </div>
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-sm select-none shadow-sm">
          S
        </div>
      </div>
    </header>
  )
}
