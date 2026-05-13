"use client"

import * as React from "react"
import { Search, Plus, MoreHorizontal, ChevronDown, ChevronsUpDown, ArrowLeft, Users, ChevronRight, Building2 } from "lucide-react"
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
    const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         o.phone.includes(searchQuery)
    const matchesStatus = !statusFilter || o.status === statusFilter
    const matchesTenant = !tenant || o.tenantId === tenant.id
    return matchesSearch && matchesStatus && matchesTenant
  })

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Context */}
        <div className="flex items-center gap-2 mb-6 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
          <button onClick={onBack} className="hover:text-primary transition-colors flex items-center gap-1.5">
            <Building2 className="h-3 w-3" /> TENANTS
          </button>
          {tenant && (
            <>
              <ChevronRight className="h-3 w-3 opacity-30" />
              <span className="text-slate-900">{tenant.tenantName}</span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-[32px] font-black tracking-tight text-[#1A1A1A] mb-1">Outlet Management</h1>
            <p className="text-slate-500 font-medium text-lg">
              {tenant ? `Outlets configured for ${tenant.tenantName}` : "Manage outlets across all restaurant tenants."}
            </p>
          </div>
          <Button className="h-11 rounded-lg px-6 bg-[#0071BC] hover:bg-[#005a96] text-white font-bold gap-2 text-sm shadow-sm transition-all active:scale-95">
            <Plus className="h-4 w-4" />
            Add Outlet
          </Button>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 flex flex-col md:flex-row gap-4 border-b border-slate-100 bg-white">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by name, slug or phone..." 
                className="pl-11 h-12 bg-slate-50 border-transparent rounded-xl w-full text-sm focus-visible:bg-white focus-visible:border-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-12 px-5 rounded-xl bg-white border-slate-200 text-slate-500 justify-between min-w-[180px] text-sm font-bold">
                  <span>{statusFilter || "Filter Status"}</span>
                  <ChevronDown className="h-4 w-4 opacity-40 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] rounded-xl p-2 shadow-xl border-slate-100">
                <DropdownMenuItem className="rounded-lg py-2" onClick={() => setStatusFilter(null)}>All Statuses</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg py-2" onClick={() => setStatusFilter('Active')}>Active</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg py-2" onClick={() => setStatusFilter('Inactive')}>Inactive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  <TableHead className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] py-5 pl-8">
                    <div className="flex items-center gap-2">OUTLET NAME <ChevronsUpDown className="h-3 w-3 opacity-30" /></div>
                  </TableHead>
                  <TableHead className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] py-5">
                    <div className="flex items-center gap-2">PHONE <ChevronsUpDown className="h-3 w-3 opacity-30" /></div>
                  </TableHead>
                  <TableHead className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] py-5">
                    <div className="flex items-center gap-2">LOCATION <ChevronsUpDown className="h-3 w-3 opacity-30" /></div>
                  </TableHead>
                  <TableHead className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] py-5">
                    <div className="flex items-center gap-2">ASSIGNED USERS <ChevronsUpDown className="h-3 w-3 opacity-30" /></div>
                  </TableHead>
                  <TableHead className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] py-5">
                    <div className="flex items-center gap-2">STATUS <ChevronsUpDown className="h-3 w-3 opacity-30" /></div>
                  </TableHead>
                  <TableHead className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] py-5 text-right pr-8">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOutlets.map((outlet) => (
                  <TableRow key={outlet.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                    <TableCell className="py-6 pl-8">
                      <div className="font-bold text-[15px] text-slate-900 mb-0.5">{outlet.name}</div>
                      <div className="text-[11px] text-[#0071BC] font-bold uppercase tracking-wider bg-[#E3F2FD] w-fit px-1.5 rounded-sm">/{outlet.slug}</div>
                    </TableCell>
                    <TableCell className="text-[14px] font-medium text-slate-600">{outlet.phone}</TableCell>
                    <TableCell>
                      <div className="text-[14px] font-bold text-slate-900">{outlet.city}</div>
                      <div className="text-[11px] text-slate-400 font-medium uppercase tracking-tight">{outlet.country}</div>
                    </TableCell>
                    <TableCell>
                      <button 
                        onClick={() => onViewUsers(outlet)}
                        className="flex items-center gap-2.5 group"
                      >
                        <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-[#E3F2FD] transition-colors">
                          <Users className="h-4 w-4 text-slate-400 group-hover:text-[#0071BC]" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-[14px] font-black text-slate-900 leading-none">{outlet.userCount}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mt-1">Users</span>
                        </div>
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-[#E8F5E9] text-[#2E7D32] border-none shadow-none rounded-md px-3 py-1.5 flex items-center w-fit gap-2 text-[10px] font-black uppercase tracking-widest">
                        <div className="h-2 w-2 rounded-full bg-[#2E7D32]" />
                        {outlet.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border border-slate-100 bg-white hover:border-slate-200 shadow-sm transition-all">
                        <MoreHorizontal className="h-4 w-4 text-slate-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredOutlets.length === 0 && (
            <div className="py-20 text-center">
              <Store className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-bold text-lg">No outlets found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
