"use client"

import * as React from "react"
import { Search, Plus, MoreHorizontal, ChevronDown, ChevronsUpDown, ChevronRight, Building2, Store, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Outlet, Tenant } from "@/lib/types"
import { initialOutlets } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface OutletManagementProps {
  tenant?: Tenant | null;
  onBack: () => void;
  onViewUsers: (outlet: Outlet) => void;
}

export function OutletManagement({ tenant, onBack, onViewUsers }: OutletManagementProps) {
  const [outlets] = React.useState<Outlet[]>(initialOutlets)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)

  const filteredOutlets = outlets.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || o.status === statusFilter
    const matchesTenant = !tenant || o.tenantId === tenant.id
    return matchesSearch && matchesStatus && matchesTenant
  })

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6 text-xs font-semibold text-slate-400">
          <button onClick={onBack} className="hover:text-primary transition-colors flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5" /> Tenants
          </button>
          {tenant && (
            <>
              <ChevronRight className="h-3 w-3 opacity-30" />
              <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{tenant.tenantName}</span>
            </>
          )}
          <ChevronRight className="h-3 w-3 opacity-30" />
          <span className="text-slate-400">Outlets</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {tenant ? "Outlet Portfolio" : "Global Outlets"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage locations and operational statuses.
            </p>
          </div>
          <Button size="sm" className="h-9 px-4 font-semibold">
            <Plus className="h-4 w-4 mr-2" /> Register Outlet
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
          <div className="p-4 flex flex-col md:flex-row gap-3 border-b border-border bg-slate-50/50">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search outlets..." 
                className="pl-9 h-9 text-sm bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 text-xs font-semibold uppercase tracking-wider">
                  {statusFilter || "All Statuses"}
                  <ChevronDown className="h-3 w-3 ml-2 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Outlets</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('Active')}>Active</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('Inactive')}>Inactive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 px-6">Outlet Entity</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 px-4">Contact Info</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 px-4">Territory</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 px-4 text-center">Personnel</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 px-4">Status</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 px-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOutlets.map((outlet) => (
                  <TableRow 
                    key={outlet.id} 
                    className="group hover:bg-slate-50 transition-colors border-b border-border cursor-pointer"
                    onClick={() => onViewUsers(outlet)}
                  >
                    <TableCell className="py-4 px-6">
                      <div className="font-bold text-sm text-slate-900">{outlet.name}</div>
                      <div className="text-[10px] text-primary font-bold uppercase tracking-tight">/{outlet.slug}</div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-500">{outlet.phone}</TableCell>
                    <TableCell>
                      <div className="text-xs font-bold text-slate-900">{outlet.city}</div>
                      <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{outlet.country}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-700">
                        <Users className="h-3 w-3 opacity-40" /> {outlet.userCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("rounded px-2 py-0.5 text-[10px] font-bold uppercase", outlet.status === 'Active' ? "active-status" : "bg-slate-100 text-slate-500")}>
                        {outlet.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredOutlets.length === 0 && (
            <div className="py-20 text-center">
              <Store className="h-10 w-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400 font-semibold">No outlets found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
