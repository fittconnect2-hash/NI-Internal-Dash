
"use client"

import * as React from "react"
import { Search, Plus, MoreHorizontal, ChevronDown, ChevronsUpDown, ArrowLeft, Users, ChevronRight, Building2, Store } from "lucide-react"
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
    const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         o.phone.includes(searchQuery)
    const matchesStatus = !statusFilter || o.status === statusFilter
    const matchesTenant = !tenant || o.tenantId === tenant.id
    return matchesSearch && matchesStatus && matchesTenant
  })

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-3 mb-10 text-[11px] font-black tracking-[0.2em] text-slate-300 uppercase">
          <button onClick={onBack} className="hover:text-[#0071BC] transition-colors flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5" /> TENANT HUB
          </button>
          {tenant && (
            <>
              <ChevronRight className="h-3 w-3 opacity-30" />
              <span className="text-slate-900 bg-[#E3F2FD] px-3 py-1 rounded-full">{tenant.tenantName}</span>
            </>
          )}
          <ChevronRight className="h-3 w-3 opacity-30" />
          <span className="text-slate-400">OUTLETS</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-[42px] font-black tracking-tight text-[#121A26] leading-none mb-3">
              {tenant ? "Outlet Portfolio" : "Global Outlets"}
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              {tenant ? `Managed locations for ${tenant.tenantName}` : "Consolidated view of all registered restaurant outlets."}
            </p>
          </div>
          <Button className="h-14 rounded-2xl px-10 bg-[#0071BC] hover:bg-[#005a96] text-white font-black gap-3 text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
            <Plus className="h-5 w-5" />
            REGISTER OUTLET
          </Button>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
          <div className="p-6 flex flex-col md:flex-row gap-4 border-b border-slate-50 bg-white">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#0071BC] transition-colors" />
              <Input 
                placeholder="Search by outlet name, slug or phone..." 
                className="pl-14 h-14 bg-slate-50/50 border-transparent rounded-2xl w-full text-base font-bold placeholder:text-slate-300 focus-visible:bg-white focus-visible:border-slate-100 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-14 px-8 rounded-2xl bg-white border-slate-100 text-slate-500 justify-between min-w-[200px] text-sm font-black tracking-widest uppercase">
                  <span>{statusFilter || "FILTER STATUS"}</span>
                  <ChevronDown className="h-4 w-4 opacity-40 ml-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] rounded-2xl p-2 shadow-2xl border-slate-50">
                <DropdownMenuItem className="rounded-xl py-3 font-bold" onClick={() => setStatusFilter(null)}>All Outlets</DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl py-3 font-bold text-green-600" onClick={() => setStatusFilter('Active')}>Active Only</DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl py-3 font-bold text-slate-400" onClick={() => setStatusFilter('Inactive')}>Inactive Only</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="hover:bg-transparent border-b border-slate-50">
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] py-6 pl-10">
                    <div className="flex items-center gap-2">BRAND ENTITY <ChevronsUpDown className="h-3 w-3 opacity-20" /></div>
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] py-6">
                    <div className="flex items-center gap-2">CONTACT <ChevronsUpDown className="h-3 w-3 opacity-20" /></div>
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] py-6">
                    <div className="flex items-center gap-2">TERRITORY <ChevronsUpDown className="h-3 w-3 opacity-20" /></div>
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] py-6 text-center">
                    <div className="flex items-center justify-center gap-2">PERSONNEL <ChevronsUpDown className="h-3 w-3 opacity-20" /></div>
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] py-6">
                    <div className="flex items-center gap-2">OPERATIONAL STATUS <ChevronsUpDown className="h-3 w-3 opacity-20" /></div>
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] py-6 text-right pr-10">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOutlets.map((outlet) => (
                  <TableRow 
                    key={outlet.id} 
                    className="group hover:bg-[#E3F2FD]/10 transition-colors border-b border-slate-50/50 cursor-pointer"
                    onClick={() => onViewUsers(outlet)}
                  >
                    <TableCell className="py-7 pl-10">
                      <div className="font-black text-[17px] text-[#121A26] mb-1 group-hover:text-[#0071BC] transition-colors">{outlet.name}</div>
                      <div className="text-[10px] text-[#0071BC] font-black uppercase tracking-widest bg-[#E3F2FD] w-fit px-2 py-0.5 rounded-md">/{outlet.slug}</div>
                    </TableCell>
                    <TableCell className="text-[14px] font-bold text-slate-500">{outlet.phone}</TableCell>
                    <TableCell>
                      <div className="text-[14px] font-black text-slate-900 leading-tight">{outlet.city}</div>
                      <div className="text-[10px] text-slate-300 font-black uppercase tracking-widest">{outlet.country}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex flex-col items-center group/btn hover:scale-105 transition-transform">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-[#0071BC] group-hover:text-white transition-all">
                          <Users className="h-5 w-5 text-slate-300 group-hover:text-white" />
                        </div>
                        <span className="text-[14px] font-black text-[#121A26] mt-1.5">{outlet.userCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-white text-green-700 border border-green-100 shadow-sm rounded-lg px-4 py-2 flex items-center w-fit gap-2.5 text-[10px] font-black uppercase tracking-[0.15em]">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        {outlet.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-10">
                      <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg transition-all" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-5 w-5 text-slate-300" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredOutlets.length === 0 && (
            <div className="py-32 text-center">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Store className="h-10 w-10 text-slate-200" />
              </div>
              <p className="text-slate-400 font-black text-2xl">No outlets found in this context</p>
              <p className="text-slate-300 font-bold mt-2">Try clearing your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
