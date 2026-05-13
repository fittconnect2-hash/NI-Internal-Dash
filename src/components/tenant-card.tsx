"use client"

import { Tenant } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, MoreVertical, Eye, Edit2, Settings2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface TenantCardProps {
  tenant: Tenant;
  viewMode: 'grid' | 'list';
  onEdit: (tenant: Tenant) => void;
  onView: (tenant: Tenant) => void;
  onConfigure: (tenant: Tenant) => void;
  onDelete: (id: string) => void;
  onOutletsClick: (tenant: Tenant) => void;
  onUsersClick: (tenant: Tenant) => void;
}

export function TenantCard({ 
  tenant, 
  viewMode, 
  onEdit, 
  onView, 
  onConfigure, 
  onDelete, 
  onOutletsClick,
  onUsersClick 
}: TenantCardProps) {
  const isPending = tenant.configurationStatus === "Configuration pending"
  const initials = tenant.tenantName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  const ActionsMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full hover:bg-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 p-2">
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(tenant); }} className="py-2.5">
          <Eye className="mr-3 h-4 w-4 text-slate-600" /> 
          <span className="font-medium">View Detail</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(tenant); }} className="py-2.5">
          <Edit2 className="mr-3 h-4 w-4 text-slate-600" /> 
          <span className="font-medium">Edit Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onConfigure(tenant); }} className="py-2.5">
          <Settings2 className="mr-3 h-4 w-4 text-slate-600" /> 
          <span className="font-medium">Configure</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem 
          className="text-destructive focus:text-destructive py-2.5" 
          onClick={(e) => { e.stopPropagation(); onDelete(tenant.id); }}
        >
          <Trash2 className="mr-3 h-4 w-4" /> 
          <span className="font-medium">Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const StatusDot = () => (
    <div className={cn(
      "absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm",
      isPending ? "bg-amber-400" : "bg-green-500"
    )} />
  )

  const CountBox = ({ label, count, onClick }: { label: string, count: number, onClick: (e: React.MouseEvent) => void }) => (
    <div 
      className="flex-1 p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col items-center justify-center transition-all duration-200 hover:bg-white hover:border-primary/20 hover:shadow-sm cursor-pointer group/count"
      onClick={onClick}
    >
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 group-hover/count:text-primary transition-colors">
        {label}
      </span>
      <span className="text-xl font-bold text-slate-900">
        {count}
      </span>
    </div>
  )

  if (viewMode === 'list') {
    return (
      <Card 
        className="group hover:border-primary/30 transition-all duration-200 border-border bg-white cursor-pointer"
        onClick={() => onView(tenant)}
      >
        <CardContent className="flex items-center p-4 gap-4">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0 relative">
            {initials}
            <StatusDot />
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
          
          <div className="flex gap-4 items-center px-6 border-x border-slate-100 min-w-[280px]">
            <CountBox 
              label="Outlets" 
              count={tenant.numberOfOutlets} 
              onClick={(e) => { e.stopPropagation(); onOutletsClick(tenant); }} 
            />
            <CountBox 
              label="Users" 
              count={tenant.numberOfUsers} 
              onClick={(e) => { e.stopPropagation(); onUsersClick(tenant); }} 
            />
          </div>

          <div className="flex items-center gap-4">
            <Badge className={cn("rounded px-2 py-0.5 text-[10px] font-bold uppercase border-none", isPending ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700")}>
              {tenant.configurationStatus === "Configuration pending" ? "Pending" : "Active"}
            </Badge>
            <ActionsMenu />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className="group flex flex-col h-full border-border bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => onView(tenant)}
    >
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="h-14 w-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-bold text-lg relative">
            {initials}
            <StatusDot />
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn("rounded px-2 py-0.5 text-[10px] font-bold uppercase border-none", isPending ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700")}>
              {tenant.configurationStatus === "Configuration pending" ? "Pending" : "Active"}
            </Badge>
            <ActionsMenu />
          </div>
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

        <div className="flex gap-3 mt-auto">
          <CountBox 
            label="Outlets" 
            count={tenant.numberOfOutlets} 
            onClick={(e) => { e.stopPropagation(); onOutletsClick(tenant); }} 
          />
          <CountBox 
            label="Users" 
            count={tenant.numberOfUsers} 
            onClick={(e) => { e.stopPropagation(); onUsersClick(tenant); }} 
          />
        </div>
      </CardContent>
    </Card>
  )
}
