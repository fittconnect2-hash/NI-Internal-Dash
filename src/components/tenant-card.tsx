"use client"

import { Tenant } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MoreVertical, Store, Users, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { AIStatusAssistant } from "./ai-status-assistant"

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
      <Card className="hover:shadow-md transition-all duration-300 border border-slate-200 bg-white rounded-xl overflow-hidden">
        <CardContent className="flex items-center p-4 gap-6">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm shrink-0 border border-slate-200/50">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-slate-900">{tenant.tenantName}</h3>
            <p className="text-xs text-slate-400 font-medium">Hospitality</p>
          </div>
          <div className="flex gap-8 items-center px-4">
            <div className="flex flex-col gap-1">
              <span className="flex items-center text-xs text-slate-500 gap-2 font-medium">
                <Mail className="h-3.5 w-3.5 opacity-40" /> {tenant.contactEmail}
              </span>
              <span className="flex items-center text-xs text-slate-500 gap-2 font-medium">
                <Phone className="h-3.5 w-3.5 opacity-40" /> {tenant.contactPhone}
              </span>
            </div>
          </div>
          <div className="flex gap-8 items-center px-4 border-l border-slate-100 h-10">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors" onClick={onViewOutlets}>
              <Store className="h-4 w-4 text-[#0071BC]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold leading-none">OUTLETS</span>
                <span className="text-xs font-bold text-slate-700">{tenant.numberOfOutlets}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-300" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold leading-none">USERS</span>
                <span className="text-xs font-bold text-slate-700">{tenant.numberOfUsers}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-end ml-auto">
            <AIStatusAssistant tenant={tenant} />
            <Badge 
              className={cn(
                "rounded-md px-2.5 py-1 text-[10px] font-bold border-none shadow-none uppercase tracking-wider",
                isPending ? "pending-status" : "bg-green-100 text-green-700"
              )}
            >
              {tenant.configurationStatus}
            </Badge>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-300 hover:text-slate-900" onClick={() => onEdit(tenant)}>
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col h-full border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Top Info */}
        <div className="p-6 pb-5">
          <div className="flex justify-between items-start mb-5">
            <div className="flex gap-4 items-center">
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-base border border-slate-200/50">
                {initials}
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">{tenant.tenantName}</h3>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="text-xs text-slate-400 font-medium">{tenant.merchantId ? 'Hospitality' : 'N/A'}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9 -mr-2 text-slate-300 hover:text-slate-900" onClick={() => onEdit(tenant)}>
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-3.5 mb-6">
            <div className="flex items-center text-[13px] text-slate-500 gap-3 font-medium">
              <Mail className="h-4 w-4 text-slate-300" />
              <span className="truncate">{tenant.contactEmail}</span>
            </div>
            <div className="flex items-center text-[13px] text-slate-500 gap-3 font-medium">
              <Phone className="h-4 w-4 text-slate-300" />
              <span>{tenant.contactPhone}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 mb-6">
            <div 
              className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors"
              onClick={onViewOutlets}
            >
              <div className="h-8 w-8 rounded-lg bg-[#E3F2FD] flex items-center justify-center">
                <Store className="h-4 w-4 text-[#0071BC]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#0071BC] font-bold leading-none tracking-wider">OUTLETS</span>
                <span className="text-sm font-bold text-slate-700">{tenant.numberOfOutlets}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-2">
              <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <Users className="h-4 w-4 text-slate-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold leading-none tracking-wider">USERS</span>
                <span className="text-sm font-bold text-slate-700">{tenant.numberOfUsers}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge 
              className={cn(
                "rounded-md px-2.5 py-1 text-[10px] font-bold border-none shadow-none uppercase tracking-wider",
                isPending ? "pending-status" : "bg-green-100 text-green-700"
              )}
            >
              {tenant.configurationStatus}
            </Badge>
            <div className="flex gap-2">
              <AIStatusAssistant tenant={tenant} />
              <Button variant="ghost" size="sm" className="text-[10px] font-bold text-[#0071BC] gap-1 px-2" onClick={onViewOutlets}>
                VIEW OUTLETS <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto px-6 py-4 card-footer-gray bg-white border-t border-slate-50">
          <p className="text-slate-400 font-medium italic">Managed since 2024</p>
        </div>
      </CardContent>
    </Card>
  )
}
