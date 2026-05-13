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
  const [userFilter, setUserFilter] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)
  const [roleFilter, setRoleFilter] = React.useState<string | null>(null)

  const handleClearFilters = () => {
    setUserFilter("")
    setStatusFilter(null)
    setRoleFilter(null)
  }

  const filteredUsers = users.filter(u => {
    // If we have a specific tenant, only show users for that tenant
    const matchesTenant = !tenant || u.tenantId === tenant.id
    
    const matchesUser = !userFilter || 
                       u.fullName.toLowerCase().includes(userFilter.toLowerCase()) || 
                       u.email.toLowerCase().includes(userFilter.toLowerCase())
    
    const matchesStatus = !statusFilter || u.status === statusFilter
    const matchesRole = !roleFilter || u.role === roleFilter
    
    return matchesTenant && matchesUser && matchesStatus && matchesRole
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
          {/* Logical Filters */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Search User</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input 
                    placeholder="Name, email or phone" 
                    className="pl-9 h-10 text-sm bg-white border-slate-200" 
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</label>
                <Select onValueChange={setRoleFilter} value={roleFilter || undefined}>
                  <SelectTrigger className="h-10 bg-white border-slate-200 text-sm">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</label>
                <Select onValueChange={setStatusFilter} value={statusFilter || undefined}>
                  <SelectTrigger className="h-10 bg-white border-slate-200 text-sm">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Button 
                  variant="ghost" 
                  className="w-full h-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100 gap-2 font-semibold"
                  onClick={handleClearFilters}
                >
                  <FilterX className="h-4 w-4" /> Reset Filters
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
                      <div className="flex items-center gap-1">Name <ChevronsUpDown className="h-3 w-3 opacity-50" /></div>
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 h-12 px-4">
                      Contact Info
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 h-12 px-4">
                      Role & Access
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 h-12 px-4">
                      Status
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 h-12 px-4">
                      Last Activity
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 h-12 px-8 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                      <TableCell className="py-5 px-8">
                        <div className="font-bold text-[#1e293b] text-[15px]">{user.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-medium">UID: {user.id}</div>
                      </TableCell>
                      <TableCell className="px-4">
                        <div className="text-[14px] text-slate-700 font-medium">{user.email}</div>
                        <div className="text-[12px] text-slate-400">+971 52 165 0458</div>
                      </TableCell>
                      <TableCell className="px-4">
                        <div className="flex flex-col gap-1.5">
                          <Badge className="w-fit bg-slate-100 text-slate-600 hover:bg-slate-200 border-none px-2 py-0.5 text-[10px] font-bold shadow-none rounded">
                            {user.role}
                          </Badge>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                            <Globe className="h-3 w-3" /> Full Access
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4">
                        <Badge className={cn(
                          "rounded-full px-3 py-1 text-[11px] font-medium border shadow-none capitalize",
                          user.status === 'Active' 
                            ? "bg-[#e1f9ef] text-[#22c55e] border-[#e1f9ef]" 
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        )}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 text-[13px] text-slate-600">
                        {user.lastActive || "Recently"}
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-slate-100 text-slate-400">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
                            <DropdownMenuItem>Deactivate User</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredUsers.length === 0 && (
                <div className="py-24 text-center">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 w-6 text-slate-300" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">No personnel found</h3>
                  <p className="text-xs text-slate-500 mt-1">Try adjusting your filters to find who you're looking for.</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
