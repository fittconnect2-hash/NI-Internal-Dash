
"use client"

import { Tenant } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MoreVertical, Store, Users, ExternalLink, ChevronRight } from "lucide-react"
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
        className="group hover:shadow-xl hover:translate-x-1 transition-all duration-300 border border-slate-100 bg-white rounded-2xl overflow-hidden cursor-pointer"
        onClick={onViewOutlets}
      >
        <CardContent className="flex items-center p-6 gap-6">
          <div className="h-14 w-14 rounded-2xl bg-slate-50 group-hover:bg-[#E3F2FD] flex items-center justify-center text-slate-300 group-hover:text-[#0071BC] font-black text-lg shrink-0 border border-slate-100/50 transition-colors">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-lg text-slate-900 leading-none mb-2">{tenant.tenantName}</h3>
            <div className="flex items-center gap-3">
              <span className="flex items-center text-xs text-slate-400 gap-1.5 font-bold uppercase tracking-wider">
                <Mail className="h-3 w-3 opacity-40" /> {tenant.contactEmail}
              </span>
              <div className="h-1 w-1 rounded-full bg-slate-200" />
              <span className="flex items-center text-xs text-slate-400 gap-1.5 font-bold uppercase tracking-wider">
                <Phone className="h-3 w-3 opacity-40" /> {tenant.contactPhone}
              </span>
            </div>
          </div>
          
          <div className="flex gap-12 items-center px-8 border-x border-slate-100 h-12">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-300 font-black tracking-[0.2em] mb-1">OUTLETS</span>
              <span className="text-xl font-black text-[#0071BC]">{tenant.numberOfOutlets}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-300 font-black tracking-[0.2em] mb-1">STAFF</span>
              <span className="text-xl font-black text-slate-900">{tenant.numberOfUsers}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 justify-end ml-8">
            <Badge 
              className={cn(
                "rounded-lg px-4 py-2 text-[10px] font-black border-none shadow-none uppercase tracking-[0.15em]",
                isPending ? "pending-status" : "bg-green-50 text-green-600 border border-green-100"
              )}
            >
              {tenant.configurationStatus}
            </Badge>
            <ChevronRight className="h-5 w-5 text-slate-200 group-hover:text-[#0071BC] transition-colors" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className="group flex flex-col h-full border border-slate-100 bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
      onClick={onViewOutlets}
    >
      <CardContent className="p-0 flex flex-col h-full">
        <div className="p-8 pb-6">
          <div className="flex justify-between items-start mb-8">
            <div className="h-16 w-16 rounded-[24px] bg-slate-50 group-hover:bg-[#E3F2FD] flex items-center justify-center text-slate-300 group-hover:text-[#0071BC] font-black text-xl border border-slate-100 transition-colors">
              {initials}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 -mr-2 text-slate-200 hover:text-slate-900 rounded-full" 
              onClick={(e) => { e.stopPropagation(); onEdit(tenant); }}
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
          
          <h3 className="font-black text-2xl text-[#121A26] leading-tight mb-2 group-hover:text-[#0071BC] transition-colors">{tenant.tenantName}</h3>
          <div className="flex items-center gap-2 mb-8">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">HOSPITALITY BRAND</span>
          </div>

          <div className="space-y-4 mb-10">
            <div className="flex items-center text-xs text-slate-500 gap-4 font-bold uppercase tracking-widest">
              <Mail className="h-4 w-4 text-slate-200 shrink-0" />
              <span className="truncate">{tenant.contactEmail}</span>
            </div>
            <div className="flex items-center text-xs text-slate-500 gap-4 font-bold uppercase tracking-widest">
              <Phone className="h-4 w-4 text-slate-200 shrink-0" />
              <span>{tenant.contactPhone}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-2 bg-slate-50/50 rounded-2xl mb-8">
            <div className="flex flex-col items-center py-4 bg-white rounded-xl shadow-sm border border-slate-100">
              <span className="text-[9px] text-slate-400 font-black tracking-[0.2em] mb-1">OUTLETS</span>
              <span className="text-2xl font-black text-[#0071BC]">{tenant.numberOfOutlets}</span>
            </div>
            <div className="flex flex-col items-center py-4 bg-white rounded-xl shadow-sm border border-slate-100">
              <span className="text-[9px] text-slate-400 font-black tracking-[0.2em] mb-1">USERS</span>
              <span className="text-2xl font-black text-slate-900">{tenant.numberOfUsers}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge 
              className={cn(
                "rounded-lg px-4 py-2 text-[10px] font-black border-none shadow-none uppercase tracking-[0.15em]",
                isPending ? "pending-status" : "bg-green-50 text-green-600 border border-green-100"
              )}
            >
              {tenant.configurationStatus}
            </Badge>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#0071BC] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
              EXPLORE <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="mt-auto px-8 py-5 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-bold italic">Active since 2024</span>
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
