"use client"

import * as React from "react"
import { 
  Search, 
  Store, 
  Building2, 
  Users, 
  MoreHorizontal, 
  ChevronsUpDown,
  FilterX,
  Plus,
  MapPin,
  Globe,
  Phone,
  Clock
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  TableCaption
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { initialOutlets, initialTenants } from "@/lib/mock-data"
import { Outlet, Tenant } from "@/lib/types"
import { cn } from "@/lib/utils"

interface OutletListViewProps {
  onViewUsers: (outlet: Outlet) => void;
}

export function OutletListView({ onViewUsers }: OutletListViewProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [tenantFilter, setTenantFilter] = React.useState<string | null>(null)
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)

  // Calculate outlet counts for each tenant for the filter
  const tenantsWithCounts = React.useMemo(() => {
    return initialTenants.map(tenant => ({
      ...tenant,
      count: initialOutlets.filter(o => o.tenantId === tenant.id).length
    })).filter(t => t.count > 0)
  }, [])

  const filteredOutlets = React.useMemo(() => {
    return initialOutlets.filter(outlet => {
      const matchesSearch = outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           outlet.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           outlet.phone.includes(searchQuery)
      const matchesTenant = !tenantFilter || outlet.tenantId === tenantFilter
      const matchesStatus = !statusFilter || outlet.status === statusFilter
      return matchesSearch && matchesTenant && matchesStatus
    })
  }, [searchQuery, tenantFilter, statusFilter])

  const getTenantName = (tenantId: string) => {
    return initialTenants.find(t => t.id === tenantId)?.tenantName || "Unknown Tenant"
  }

  const resetFilters = () => {
    setSearchQuery("")
    setTenantFilter(null)
    setStatusFilter(null)
  }

  return (
    <div className="p-6 md:p-8 flex flex-col h-full overflow-hidden bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Outlet Management</h1>
            <p className="text-sm text-slate-500 mt-1">Monitor and organize your global brand properties and locations.</p>
          </div>
          <Button size="sm" className="h-10 px-6 font-black bg-[#1a73e8] hover:bg-[#1557b0] shadow-lg shadow-[#1a73e8]/20">
            <Plus className="h-4 w-4 mr-2" /> Add Outlet
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Search Outlets</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input 
                  placeholder="Name, city or phone..." 
                  className="pl-9 h-11 text-sm bg-white border-slate-200 focus-visible:ring-1 ring-[#1a73e8]/20" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Filter by Tenants</label>
              <Select onValueChange={(v) => setTenantFilter(v === 'all' ? null : v)} value={tenantFilter || 'all'}>
                <SelectTrigger className="h-11 bg-white border-slate-200 text-sm">
                  <SelectValue placeholder="All Tenants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tenants</SelectItem>
                  {tenantsWithCounts.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.tenantName} ({t.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Status</label>
              <Select onValueChange={(v) => setStatusFilter(v === 'all' ? null : v)} value={statusFilter || 'all'}>
                <SelectTrigger className="h-11 bg-white border-slate-200 text-sm">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Button 
                variant="ghost" 
                className="w-full h-11 text-slate-400 hover:text-[#1a73e8] hover:bg-[#1a73e8]/5 gap-2 font-bold transition-all"
                onClick={resetFilters}
              >
                <FilterX className="h-4 w-4" /> Reset Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-0 overflow-hidden">
          <ScrollArea className="flex-1">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-8 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors">Name & Slug <ChevronsUpDown className="h-3 w-3 opacity-50" /></div>
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest">
                    Parent Tenant
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest">
                    Contact & Timezone
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest text-center">
                    Users
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest">
                    Location
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-8 text-right uppercase tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOutlets.map((outlet) => (
                  <TableRow key={outlet.id} className="group hover:bg-slate-50/50 transition-all border-b border-slate-50">
                    <TableCell className="py-5 px-8">
                      <div className="font-extrabold text-[#1e293b] text-[15px] group-hover:text-[#1a73e8] transition-colors">{outlet.name}</div>
                      <div className="text-[11px] text-slate-400 font-bold uppercase tracking-tight opacity-70">slug: {outlet.slug}</div>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-slate-300" />
                        <span className="text-[14px] text-slate-600 font-bold">{getTenantName(outlet.tenantId)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <Phone className="h-3 w-3 text-slate-400" /> {outlet.phone}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                          <Clock className="h-3 w-3" /> {outlet.timezone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                        <Users className="h-3.5 w-3.5 text-[#1a73e8]" />
                        <span className="text-[14px] font-black text-slate-900">{outlet.userCount}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="text-[13px] text-slate-700 font-bold flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-slate-300" /> {outlet.city}
                      </div>
                      <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                        <Globe className="h-3 w-3 text-slate-200" /> {outlet.country}
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex justify-center">
                        <Badge className={cn(
                          "rounded-full px-4 py-1 text-[10px] font-bold border shadow-none uppercase tracking-wider",
                          outlet.status === 'Active' 
                            ? "bg-[#e1f9ef] text-[#22c55e] border-[#e1f9ef]" 
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        )}>
                          {outlet.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-white border border-transparent hover:border-slate-100 text-slate-400">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-2">
                          <DropdownMenuItem className="font-bold py-2.5">Edit Details</DropdownMenuItem>
                          <DropdownMenuItem className="font-bold py-2.5" onClick={() => onViewUsers(outlet)}>View Staff</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive font-black py-2.5">Deactivate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredOutlets.length === 0 && (
              <div className="py-24 text-center">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <Store className="h-8 w-8 text-slate-200" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">No Outlets Detected</h3>
                <p className="text-xs text-slate-500 mt-1">Adjust your filters or add a new branch to your network.</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
