"use client"

import * as React from "react"
import { 
  Search, 
  MoreHorizontal, 
  ChevronRight, 
  Building2, 
  Globe, 
  ChevronsUpDown,
  FilterX,
  X,
  ArrowLeft
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { User, Tenant } from "@/lib/types"
import { initialUsers } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface UserManagementProps {
  tenant?: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserManagement({ tenant, isOpen, onClose }: UserManagementProps) {
  const [users] = React.useState<User[]>(initialUsers)
  const [tenantSearch, setTenantSearch] = React.useState(tenant?.tenantName || "")
  const [userFilter, setUserFilter] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)
  const [outletFilter, setOutletFilter] = React.useState<string | null>(null)

  const handleClearFilters = () => {
    setTenantSearch("")
    setUserFilter("")
    setStatusFilter(null)
    setOutletFilter(null)
  }

  const filteredUsers = users.filter(u => {
    const matchesTenant = !tenantSearch || u.tenantId.includes(tenantSearch) // Mock matching
    const matchesUser = !userFilter || 
                       u.fullName.toLowerCase().includes(userFilter.toLowerCase()) || 
                       u.email.toLowerCase().includes(userFilter.toLowerCase())
    const matchesStatus = !statusFilter || u.status === statusFilter
    const matchesOutlet = !outletFilter || u.outletId === outletFilter
    return matchesTenant && matchesUser && matchesStatus && matchesOutlet
  })

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[1200px] p-0 border-l border-slate-200 bg-[#f8f9fc] flex flex-col">
        {/* Header */}
        <SheetHeader className="px-8 py-6 bg-white border-b border-slate-100 flex-shrink-0">
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
                <span className="text-slate-400">Personnel</span>
              </div>
              <SheetTitle className="text-2xl font-bold text-[#1e293b] tracking-tight">
                User Management
              </SheetTitle>
            </div>
          </div>
        </SheetHeader>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#f8f9fc] p-6">
          {/* High Fidelity Filters */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tenant</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input 
                    placeholder="Khazana" 
                    className="pl-9 h-10 text-sm bg-white border-slate-200" 
                    value={tenantSearch}
                    onChange={(e) => setTenantSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Outlet</label>
                <Select onValueChange={setOutletFilter} value={outletFilter || undefined}>
                  <SelectTrigger className="h-10 bg-white border-slate-200 text-sm">
                    <SelectValue placeholder="Select an Outlet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="o1">Outburst Main</SelectItem>
                    <SelectItem value="o2">Crave Lounge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</label>
                <Select onValueChange={setStatusFilter} value={statusFilter || undefined}>
                  <SelectTrigger className="h-10 bg-white border-slate-200 text-sm">
                    <SelectValue placeholder="Select a Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input 
                    placeholder="Filter by name, email or phone" 
                    className="pl-9 h-10 text-sm bg-white border-slate-200" 
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Button 
                  variant="ghost" 
                  className="w-full h-10 text-rose-500 hover:text-rose-600 hover:bg-rose-50 gap-2 font-semibold"
                  onClick={handleClearFilters}
                >
                  <FilterX className="h-4 w-4" /> Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-0 overflow-hidden">
            <ScrollArea className="flex-1">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-b border-slate-100">
                    <TableHead className="text-[11px] font-bold text-slate-400 h-12 px-8">
                      <div className="flex items-center gap-1">Username <ChevronsUpDown className="h-3 w-3 opacity-50" /></div>
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 h-12 px-4">
                      <div className="flex items-center gap-1">Email <ChevronsUpDown className="h-3 w-3 opacity-50" /></div>
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 h-12 px-4">
                      <div className="flex items-center gap-1">Phone <ChevronsUpDown className="h-3 w-3 opacity-50" /></div>
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 h-12 px-4">
                      <div className="flex items-center gap-1">Role & Assignments <ChevronsUpDown className="h-3 w-3 opacity-50" /></div>
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 h-12 px-4">
                      <div className="flex items-center gap-1">Status <ChevronsUpDown className="h-3 w-3 opacity-50" /></div>
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 h-12 px-4">
                      <div className="flex items-center gap-1">Last Login <ChevronsUpDown className="h-3 w-3 opacity-50" /></div>
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 h-12 px-8 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                      <TableCell className="py-5 px-8 font-bold text-[#1e293b]">
                        {user.fullName}
                      </TableCell>
                      <TableCell className="px-4 text-[14px] text-slate-600">
                        {user.email}
                      </TableCell>
                      <TableCell className="px-4 text-[14px] text-slate-600">
                        +971521650458
                      </TableCell>
                      <TableCell className="px-4">
                        <div className="flex flex-col gap-1.5">
                          <Badge className="w-fit bg-slate-100 text-slate-600 hover:bg-slate-200 border-none px-2 py-0.5 text-[10px] font-bold shadow-none rounded">
                            {user.role === 'Admin' ? 'Tenant Admin' : user.role}
                          </Badge>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                            <Globe className="h-3 w-3" /> All outlet
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4">
                        <Badge className={cn(
                          "rounded-full px-3 py-1 text-[11px] font-medium border border-[#e1f9ef] shadow-none capitalize",
                          user.status === 'Active' 
                            ? "bg-[#e1f9ef] text-[#22c55e]" 
                            : "bg-slate-100 text-slate-500"
                        )}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 text-[14px] text-slate-600">
                        {user.lastActive || "May 12, 2026"}
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-slate-50 text-slate-400">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
