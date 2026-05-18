"use client"

import { Tenant } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, MoreVertical, Eye, Edit2, Settings2, Trash2, Store, Users, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

  const ExternalLinkButton = () => (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-primary"
            onClick={(e) => { 
              e.stopPropagation(); 
              window.open(`https://dine-net.app/portal/${tenant.id}`, '_blank');
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-900 text-slate-50 border-none px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
          Launch Portal
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  const StatusDot = () => (
    <div className={cn(
      "absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm",
      isPending ? "bg-amber-400" : "bg-green-500"
    )} />
  )

  const CountBox = ({ label, count, icon: Icon, onClick, tooltip }: { label: string, count: number, icon: any, onClick: (e: React.MouseEvent) => void, tooltip: string }) => (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="flex-1 p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col items-center justify-center transition-all duration-300 hover:bg-white hover:border-primary/30 hover:shadow-md cursor-pointer group/count"
            onClick={onClick}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-3 w-3 text-slate-400 group-hover/count:text-primary transition-colors" />
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest group-hover/count:text-primary transition-colors">
                {label}
              </span>
            </div>
            <span className="text-xl font-extrabold text-[#1e293b] group-hover/count:scale-110 transition-transform">
              {count}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-900 text-slate-50 border-none px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  if (viewMode === 'list') {
    return (
      <Card 
        className="group hover:border-primary/30 hover:shadow-sm transition-all duration-300 border-border bg-white cursor-pointer"
        onClick={() => onView(tenant)}
      >
        <CardContent className="flex items-center p-4 gap-4">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0 relative transition-transform group-hover:scale-105">
            {initials}
            <StatusDot />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[15px] text-slate-900 truncate group-hover:text-primary transition-colors">{tenant.tenantName}</h3>
            <div className="flex items-center gap-4 mt-1">
              <span className="flex items-center text-xs text-slate-500 gap-1.5 truncate max-w-[200px]">
                <Mail className="h-3 w-3 opacity-60" /> {tenant.contactEmail}
              </span>
              <span className="flex items-center text-xs text-slate-500 gap-1.5">
                <Phone className="h-3 w-3 opacity-60" /> {tenant.contactPhone}
              </span>
            </div>
          </div>
          
          <div className="flex gap-3 items-center px-6 border-x border-slate-100 min-w-[280px]">
            <CountBox 
              label="Outlets" 
              count={tenant.numberOfOutlets} 
              icon={Store}
              tooltip="Review and organize branch locations for this brand"
              onClick={(e) => { e.stopPropagation(); onOutletsClick(tenant); }} 
            />
            <CountBox 
              label="Users" 
              count={tenant.numberOfUsers} 
              icon={Users}
              tooltip="Manage administrative access and team personnel"
              onClick={(e) => { e.stopPropagation(); onUsersClick(tenant); }} 
            />
          </div>

          <div className="flex items-center gap-2">
            <Badge className={cn(
              "rounded-full px-3 py-1 text-[10px] font-bold uppercase border-none", 
              isPending ? "bg-amber-100 text-amber-700" : "bg-[#e1f9ef] text-[#22c55e]"
            )}>
              {tenant.configurationStatus === "Configuration pending" ? "Pending" : "Active"}
            </Badge>
            <div className="flex items-center gap-1">
              <ExternalLinkButton />
              <ActionsMenu />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className="group flex flex-col h-full border-border bg-white hover:shadow-xl hover:border-primary/20 transition-all duration-500 cursor-pointer overflow-hidden"
      onClick={() => onView(tenant)}
    >
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl relative transition-all duration-500 group-hover:bg-primary/5 group-hover:border-primary/10">
            {initials}
            <StatusDot />
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn(
              "rounded-full px-3 py-1 text-[10px] font-bold uppercase border-none", 
              isPending ? "bg-amber-100 text-amber-700" : "bg-[#e1f9ef] text-[#22c55e]"
            )}>
              {tenant.configurationStatus === "Configuration pending" ? "Pending" : "Active"}
            </Badge>
            <div className="flex items-center gap-1">
              <ExternalLinkButton />
              <ActionsMenu />
            </div>
          </div>
        </div>
        
        <h3 className="font-extrabold text-lg text-slate-900 mb-1 group-hover:text-primary transition-colors leading-tight">{tenant.tenantName}</h3>
        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-6">
          <MapPin className="h-3 w-3 opacity-60" /> Hospitality Partner
        </p>

        <div className="space-y-3 mb-8">
          <div className="flex items-center text-xs text-slate-600 gap-3 group/info">
            <div className="h-6 w-6 rounded bg-slate-50 flex items-center justify-center group-hover/info:bg-white transition-colors">
              <Mail className="h-3.5 w-3.5 opacity-40 shrink-0" />
            </div>
            <span className="truncate font-medium">{tenant.contactEmail}</span>
          </div>
          <div className="flex items-center text-xs text-slate-600 gap-3 group/info">
            <div className="h-6 w-6 rounded bg-slate-50 flex items-center justify-center group-hover/info:bg-white transition-colors">
              <Phone className="h-3.5 w-3.5 opacity-40 shrink-0" />
            </div>
            <span className="font-medium">{tenant.contactPhone}</span>
          </div>
        </div>

        <div className="flex gap-4 mt-auto">
          <CountBox 
            label="Outlets" 
            count={tenant.numberOfOutlets} 
            icon={Store}
            tooltip="Review and organize branch locations for this brand"
            onClick={(e) => { e.stopPropagation(); onOutletsClick(tenant); }} 
          />
          <CountBox 
            label="Users" 
            count={tenant.numberOfUsers} 
            icon={Users}
            tooltip="Manage administrative access and team personnel"
            onClick={(e) => { e.stopPropagation(); onUsersClick(tenant); }} 
          />
        </div>
      </CardContent>
    </Card>
  )
}
