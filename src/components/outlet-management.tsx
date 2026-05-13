
"use client"

import * as React from "react"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  ChevronRight, 
  Building2, 
  Store, 
  ChevronsUpDown,
  X,
  ArrowLeft
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface OutletManagementProps {
  tenant?: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
  onViewUsers: (outlet: Outlet) => void;
}

export function OutletManagement({ tenant, isOpen, onClose, onViewUsers }: OutletManagementProps) {
  const [outlets] = React.useState<Outlet[]>(initialOutlets)
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
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[1200px] p-0 border-l border-slate-200 bg-[#f8f9fc] flex flex-col">
        {/* Header with Breadcrumbs */}
        <SheetHeader className="px-8 py-6 bg-white border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button 
                onClick={onClose}
                className="p-1 hover:bg-slate-50 rounded-md transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-slate-400" />
              </button>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> Tenants</span>
                  <ChevronRight className="h-2.5 w-2.5 opacity-50" />
                  <span className="text-slate-900">{tenant?.tenantName || "All Tenants"}</span>
                  <ChevronRight className="h-2.5 w-2.5 opacity-50" />
                  <span className="text-slate-400">Outlets</span>
                </div>
                <SheetTitle className="text-2xl font-bold text-[#1e293b] tracking-tight">
                  Outlet Management
                </SheetTitle>
              </div>
            </div>
            {!isAddingNew && (
              <Button 
                size="sm" 
                className="h-10 px-5 font-bold bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-lg shadow-sm"
                onClick={() => setIsAddingNew(true)}
              >
                <Plus className="h-4 w-4 mr-2" /> New Outlet
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Content Area */}
        <div className="flex-1 flex min-h-0 overflow-hidden bg-[#f8f9fc] p-6 gap-6">
          {/* Form Side - Animated */}
          {isAddingNew && (
            <div className="w-[380px] flex-shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col animate-in slide-in-from-left duration-300">
              <div className="p-5 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-lg text-[#1e293b]">Add New Outlet</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-400" onClick={() => setIsAddingNew(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1 px-6 py-4">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Outlet Name</Label>
                    <Input placeholder="e.g. Downtown Branch" className="h-11 bg-slate-50/50 border-slate-200 focus-visible:bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Slug</Label>
                    <Input placeholder="e.g. downtown-branch" className="h-11 bg-slate-50/50 border-slate-200 focus-visible:bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Phone</Label>
                    <Input placeholder="+971..." className="h-11 bg-slate-50/50 border-slate-200 focus-visible:bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Timezone</Label>
                    <Select>
                      <SelectTrigger className="h-11 bg-slate-50/50 border-slate-200">
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
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">City</Label>
                      <Input placeholder="Dubai" className="h-11 bg-slate-50/50 border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Country</Label>
                      <Input placeholder="UAE" className="h-11 bg-slate-50/50 border-slate-200" />
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="p-5 border-t border-slate-50 flex gap-3">
                <Button variant="outline" className="flex-1 h-11 border-slate-200 font-bold text-slate-600" onClick={() => setIsAddingNew(false)}>Cancel</Button>
                <Button className="flex-1 h-11 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold">Create Outlet</Button>
              </div>
            </div>
          )}

          {/* Table Side */}
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-0">
            <div className="p-5 flex flex-col md:flex-row gap-4 border-b border-slate-50">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Nihal" 
                  className="pl-10 h-11 text-sm bg-white border-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select onValueChange={(v) => setStatusFilter(v === 'all' ? null : v)}>
                <SelectTrigger className="w-56 h-11 bg-white border-slate-200">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Select Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="flex-1">
              <Table>
                <TableHeader className="bg-white">
                  <TableRow className="bg-white hover:bg-white border-b border-slate-100">
                    <TableHead className="text-[12px] font-medium text-slate-400 h-14 px-8">
                      <div className="flex items-center gap-1">Name <ChevronsUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="text-[12px] font-medium text-slate-400 h-14 px-4">
                      Phone
                    </TableHead>
                    <TableHead className="text-[12px] font-medium text-slate-400 h-14 px-4">
                      <div className="flex items-center gap-1">Timezone <ChevronsUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="text-[12px] font-medium text-slate-400 h-14 px-4">
                      <div className="flex items-center gap-1">City <ChevronsUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="text-[12px] font-medium text-slate-400 h-14 px-4">
                      <div className="flex items-center gap-1">Country <ChevronsUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="text-[12px] font-medium text-slate-400 h-14 px-4">
                      <div className="flex items-center justify-center gap-1">Status <ChevronsUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="text-[12px] font-medium text-slate-400 h-14 px-8 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOutlets.map((outlet) => (
                    <TableRow 
                      key={outlet.id} 
                      className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 cursor-pointer"
                      onClick={() => onViewUsers(outlet)}
                    >
                      <TableCell className="py-5 px-8">
                        <div className="font-bold text-[15px] text-[#1e293b] border-b border-[#1e293b] inline-block leading-tight mb-1">{outlet.name}</div>
                        <div className="text-[11px] text-slate-400 font-medium tracking-wide">{outlet.slug}</div>
                      </TableCell>
                      <TableCell className="px-4 text-[14px] text-[#1e293b]">
                        {outlet.phone}
                      </TableCell>
                      <TableCell className="px-4 text-[14px] text-[#1e293b]">
                        {outlet.timezone}
                      </TableCell>
                      <TableCell className="px-4 text-[14px] text-[#1e293b]">
                        {outlet.city}
                      </TableCell>
                      <TableCell className="px-4 text-[14px] text-[#1e293b]">
                        {outlet.country}
                      </TableCell>
                      <TableCell className="text-center px-4">
                        <div className="flex justify-center">
                          <Badge className={cn(
                            "rounded-full px-3 py-1 text-[11px] font-medium flex items-center gap-2 border border-[#e1f9ef] shadow-none capitalize",
                            outlet.status === 'Active' 
                              ? "bg-[#e1f9ef] text-[#22c55e]" 
                              : "bg-slate-100 text-slate-500"
                          )}>
                            <div className={cn("h-1.5 w-1.5 rounded-full", outlet.status === 'Active' ? "bg-[#22c55e]" : "bg-slate-400")} />
                            {outlet.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 rounded-full border border-slate-100 text-slate-400 hover:text-[#1e293b] hover:bg-white" 
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
                <div className="py-32 text-center">
                  <Store className="h-12 w-12 text-slate-100 mx-auto mb-4" />
                  <p className="text-sm text-slate-400 font-medium">No outlets found for this tenant</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
