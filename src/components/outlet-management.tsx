"use client"

import * as React from "react"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  ChevronDown, 
  ChevronRight, 
  Building2, 
  Store, 
  Users, 
  ChevronsUpDown,
  X
} from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface OutletManagementProps {
  tenant?: Tenant | null;
  onBack: () => void;
  onViewUsers: (outlet: Outlet) => void;
}

export function OutletManagement({ tenant, onBack, onViewUsers }: OutletManagementProps) {
  const [outlets, setOutlets] = React.useState<Outlet[]>(initialOutlets)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)
  const [isAddingNew, setIsAddingNew] = React.useState(false)

  const filteredOutlets = outlets.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || o.status === statusFilter
    const matchesTenant = !tenant || o.tenantId === tenant.id
    return matchesSearch && matchesStatus && matchesTenant
  })

  return (
    <div className="p-6 md:p-8 flex flex-col h-full bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full min-h-0">
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
            <h1 className="text-3xl font-bold text-slate-900">Outlet Management</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage outlets and their addresses for each tenant.
            </p>
          </div>
          {!isAddingNew && (
            <Button 
              size="sm" 
              className="h-10 px-4 font-semibold bg-[#1a73e8] hover:bg-[#1557b0] text-white"
              onClick={() => setIsAddingNew(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> New Outlet
            </Button>
          )}
        </div>

        <div className={cn("flex flex-1 gap-6 min-h-0", isAddingNew ? "flex-row" : "flex-col")}>
          {/* Left Side: Form */}
          {isAddingNew && (
            <div className="w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col animate-in slide-in-from-left duration-300">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-900">Add New Outlet</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsAddingNew(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Outlet Name</Label>
                  <Input placeholder="e.g. Downtown Branch" className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Slug</Label>
                  <Input placeholder="e.g. downtown-branch" className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Phone</Label>
                  <Input placeholder="+971..." className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Timezone</Label>
                  <Select>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dubai">Asia/Dubai</SelectItem>
                      <SelectItem value="london">Europe/London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">City</Label>
                    <Input placeholder="Dubai" className="h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Country</Label>
                    <Input placeholder="UAE" className="h-10" />
                  </div>
                </div>
              </div>
              <div className="p-6 mt-auto border-t border-slate-100 flex gap-3">
                <Button variant="outline" className="flex-1 h-10" onClick={() => setIsAddingNew(false)}>Cancel</Button>
                <Button className="flex-1 h-10 bg-[#1a73e8] hover:bg-[#1557b0] text-white">Create</Button>
              </div>
            </div>
          )}

          {/* Right Side: Table */}
          <div className={cn("bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col min-h-0", isAddingNew ? "w-2/3" : "w-full")}>
            <div className="p-4 flex flex-col md:flex-row gap-3 border-b border-slate-100 bg-white">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Nihal" 
                  className="pl-9 h-10 text-sm bg-slate-50 border-none focus-visible:ring-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select onValueChange={(v) => setStatusFilter(v === 'all' ? null : v)}>
                <SelectTrigger className="w-56 h-10 bg-white border-slate-200 text-slate-500">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto flex-1 scrollbar-hide">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/30 hover:bg-slate-50/30 border-b border-slate-100">
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-tight py-4 px-6 h-auto">
                      <div className="flex items-center gap-1">Name <ChevronsUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-tight py-4 px-4 h-auto">
                      <div className="flex items-center gap-1">Phone <ChevronsUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-tight py-4 px-4 h-auto">
                      <div className="flex items-center gap-1">Timezone <ChevronsUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-tight py-4 px-4 h-auto">
                      <div className="flex items-center gap-1">City <ChevronsUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-tight py-4 px-4 h-auto">
                      <div className="flex items-center gap-1">Country <ChevronsUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-tight py-4 px-4 h-auto">
                      <div className="flex items-center gap-1">Status <ChevronsUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-tight py-4 px-6 h-auto text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOutlets.map((outlet) => (
                    <TableRow 
                      key={outlet.id} 
                      className="group hover:bg-[#f8faff] transition-colors border-b border-slate-50 cursor-pointer"
                      onClick={() => onViewUsers(outlet)}
                    >
                      <TableCell className="py-5 px-6">
                        <div className="font-bold text-[15px] text-slate-900 border-b-2 border-slate-900 inline-block leading-tight">{outlet.name}</div>
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5">{outlet.slug}</div>
                      </TableCell>
                      <TableCell className="text-[13px] font-medium text-slate-600">{outlet.phone}</TableCell>
                      <TableCell className="text-[13px] font-medium text-slate-600">{outlet.timezone}</TableCell>
                      <TableCell className="text-[13px] font-bold text-slate-900">{outlet.city}</TableCell>
                      <TableCell className="text-[13px] font-medium text-slate-600">{outlet.country}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "rounded-full px-3 py-1 text-[11px] font-bold flex items-center gap-1.5 w-fit border-none shadow-none",
                          outlet.status === 'Active' 
                            ? "bg-[#e1f9ef] text-[#22c55e]" 
                            : "bg-slate-100 text-slate-500"
                        )}>
                          <div className={cn("h-2 w-2 rounded-full", outlet.status === 'Active' ? "bg-[#22c55e]" : "bg-slate-400")} />
                          {outlet.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-6">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full border border-slate-200 text-slate-400 hover:text-slate-900 bg-white" 
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredOutlets.length === 0 && (
                <div className="py-24 text-center">
                  <Store className="h-12 w-12 text-slate-100 mx-auto mb-4" />
                  <p className="text-sm text-slate-400 font-medium">No outlets found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
