"use client"

import { Tenant } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Store, Users, ChevronRight, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface TenantCardProps {
  tenant: Tenant;
  viewMode: 'grid' | 'list';
  onEdit: (tenant: Tenant) => void;
  onViewOutlets: () => void;
}

export function TenantCard({ tenant, viewMode, onEdit, onViewOutlets }: TenantCardProps) {
  const isPending = tenant.configurationStatus === "Configuration pending"
  const initials = tenant.tenantName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  if (viewMode === 'list') {
    return (
      <Card 
        className="group hover:border-primary/30 transition-all duration-200 border-border bg-white cursor-pointer"
        onClick={onViewOutlets}
      >
        <CardContent className="flex items-center p-4 gap-4">
          <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-slate-900 truncate">{tenant.tenantName}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center text-xs text-slate-500 gap-1 truncate max-w-[150px]">
                <Mail className="h-3 w-3" /> {tenant.contactEmail}
              </span>
              <span className="flex items-center text-xs text-slate-500 gap-1">
                <Phone className="h-3 w-3" /> {tenant.contactPhone}
              </span>
            </div>
          </div>
          
          <div className="flex gap-8 items-center px-6 border-x border-slate-100">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Outlets</span>
              <span className="text-sm font-bold text-slate-900">{tenant.numberOfOutlets}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Users</span>
              <span className="text-sm font-bold text-slate-900">{tenant.numberOfUsers}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge className={cn("rounded px-2 py-0.5 text-[10px] font-bold uppercase", isPending ? "pending-status" : "active-status")}>
              {tenant.configurationStatus}
            </Badge>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className="group flex flex-col h-full border-border bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={onViewOutlets}
    >
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="h-12 w-12 rounded bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-bold text-lg">
            {initials}
          </div>
          <Badge className={cn("rounded px-2 py-0.5 text-[10px] font-bold uppercase", isPending ? "pending-status" : "active-status")}>
            {tenant.configurationStatus}
          </Badge>
        </div>
        
        <h3 className="font-bold text-base text-slate-900 mb-1 group-hover:text-primary transition-colors">{tenant.tenantName}</h3>
        <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
          <MapPin className="h-3 w-3" /> Hospitality Partner
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center text-xs text-slate-600 gap-2">
            <Mail className="h-3.5 w-3.5 opacity-50 shrink-0" />
            <span className="truncate">{tenant.contactEmail}</span>
          </div>
          <div className="flex items-center text-xs text-slate-600 gap-2">
            <Phone className="h-3.5 w-3.5 opacity-50 shrink-0" />
            <span>{tenant.contactPhone}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-auto">
          <div className="p-3 bg-slate-50 rounded border border-slate-100 flex flex-col items-center">
            <span className="text-[9px] text-slate-400 font-bold uppercase mb-1">Outlets</span>
            <span className="text-sm font-bold text-slate-900">{tenant.numberOfOutlets}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-100 flex flex-col items-center">
            <span className="text-[9px] text-slate-400 font-bold uppercase mb-1">Users</span>
            <span className="text-sm font-bold text-slate-900">{tenant.numberOfUsers}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
