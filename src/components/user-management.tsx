"use client"

import * as React from "react"
import { 
  Search, 
  MoreHorizontal, 
  ChevronRight, 
  Building2, 
  Store, 
  ChevronsUpDown,
  FilterX,
  ArrowLeft,
  Users as UsersIcon,
  ShieldCheck,
  Plus,
  X,
  Trash2,
  PlusCircle,
  Edit2,
  PauseCircle,
  Mail,
  Phone,
  User as UserIcon,
  Check,
  ChevronLeft
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
  SheetDescription,
} from "@/components/ui/sheet"
import { User, Tenant, Outlet } from "@/lib/types"
import { initialUsers, initialOutlets, initialTenants } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const ITEMS_PER_PAGE = 10

interface UserManagementProps {
  tenant?: Tenant | null;
  editingUser?: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserManagement({ tenant, editingUser: propEditingUser, isOpen, onClose }: UserManagementProps) {
  const [users, setUsers] = React.useState<User[]>(initialUsers)
  const [userFilter, setUserFilter] = React.useState("")
  const [tenantFilter, setTenantFilter] = React.useState<string | null>(null)
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)
  const [roleFilter, setRoleFilter] = React.useState<string | null>(null)
  const [outletFilter, setOutletFilter] = React.useState<string | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  
  const [isAddingNew, setIsAddingNew] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<User | null>(null)
  
  const [tenantSearch, setTenantSearch] = React.useState("")
  const [isTenantPopoverOpen, setIsTenantPopoverOpen] = React.useState(false)

  React.useEffect(() => {
    if (propEditingUser) {
      setEditingUser(propEditingUser)
      setIsAddingNew(true)
    }
  }, [propEditingUser])

  // Calculate user counts for each tenant for the filter
  const tenantsWithCounts = React.useMemo(() => {
    return initialTenants.map(t => ({
      ...t,
      count: initialUsers.filter(u => u.tenantId === t.id).length
    })).filter(t => t.count > 0)
  }, [])

  // Filter outlets by current tenant (or selected tenant filter)
  const activeTenantId = tenant?.id || tenantFilter
  const tenantOutlets = React.useMemo(() => {
    return initialOutlets.filter(o => !activeTenantId || o.tenantId === activeTenantId)
  }, [activeTenantId])

  const filteredTenantsForDropdown = React.useMemo(() => {
    return tenantsWithCounts.filter(t => 
      t.tenantName.toLowerCase().includes(tenantSearch.toLowerCase())
    )
  }, [tenantsWithCounts, tenantSearch])

  const handleClearFilters = () => {
    setUserFilter("")
    setTenantFilter(null)
    setStatusFilter(null)
    setRoleFilter(null)
    setOutletFilter(null)
    setTenantSearch("")
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsAddingNew(true)
  }

  const handleAddNewUser = () => {
    setEditingUser(null)
    setIsAddingNew(true)
  }

  const handleSuspendUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Inactive' } : u))
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId))
  }

  const filteredUsers = React.useMemo(() => {
    return users.filter(u => {
      const matchesTenant = tenant ? u.tenantId === tenant.id : (!tenantFilter || u.tenantId === tenantFilter)
      const matchesUser = !userFilter || 
                         u.fullName.toLowerCase().includes(userFilter.toLowerCase()) || 
                         u.email.toLowerCase().includes(userFilter.toLowerCase())
      const matchesStatus = !statusFilter || u.status === statusFilter
      const matchesRole = !roleFilter || u.role === roleFilter
      const matchesOutlet = !outletFilter || u.outletId === outletFilter
      return matchesTenant && matchesUser && matchesStatus && matchesRole && matchesOutlet
    })
  }, [users, tenant, tenantFilter, userFilter, statusFilter, roleFilter, outletFilter])

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const paginatedUsers = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredUsers, currentPage])

  // Reset page when filtering/searching
  React.useEffect(() => {
    setCurrentPage(1)
  }, [userFilter, tenantFilter, statusFilter, roleFilter, outletFilter])

  const getOutletName = (outletId?: string) => {
    if (!outletId) return "Global / Unassigned"
    return initialOutlets.find(o => o.id === outletId)?.name || "Unknown Outlet"
  }

  const getTenantName = (tenantId: string) => {
    return initialTenants.find(t => t.id === tenantId)?.tenantName || "Unknown Tenant"
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setIsAddingNew(false)
        setEditingUser(null)
        onClose()
      }
    }}>
      <SheetContent side="right" className="w-full sm:max-w-[1200px] p-0 border-l border-slate-200 bg-[#f8f9fc] flex flex-col transition-all duration-500">
        <SheetHeader className="px-8 py-6 bg-white border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button 
                onClick={isAddingNew ? () => { setIsAddingNew(false); setEditingUser(null); } : onClose}
                className="p-2 hover:bg-slate-50 rounded-lg transition-colors group"
              >
                <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-slate-900" />
              </button>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5 opacity-80"><Building2 className="h-3 w-3" /> TENANTS</span>
                  <ChevronRight className="h-2.5 w-2.5 opacity-30" />
                  <span className="text-slate-900">{tenant?.tenantName.toUpperCase() || "GLOBAL MANAGEMENT"}</span>
                  <ChevronRight className="h-2.5 w-2.5 opacity-30" />
                  <span className="opacity-80">USERS</span>
                </div>
                <SheetTitle className="text-2xl font-black text-[#1e293b] tracking-tight">
                  {editingUser 
                    ? `Edit ${editingUser.fullName}` 
                    : isAddingNew 
                      ? "Add New Staff Member" 
                      : tenant 
                        ? `User Management of ${tenant.tenantName}` 
                        : "User Management"}
                </SheetTitle>
                {isAddingNew && (
                  <SheetDescription className="text-xs text-slate-500 font-medium">
                    {editingUser ? `Update permissions and profile for ${editingUser.fullName}.` : "Enter the details for the new user. They will receive an email to set their password."}
                  </SheetDescription>
                )}
              </div>
            </div>
            {!isAddingNew && (
              <Button 
                onClick={handleAddNewUser}
                className="h-10 px-6 font-black bg-[#1a73e8] hover:bg-[#1557b0] shadow-lg shadow-[#1a73e8]/20"
              >
                <Plus className="h-4 w-4 mr-2" /> New User
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 flex flex-col min-h-0 bg-[#f8f9fc]">
          {!isAddingNew ? (
            <div className="flex flex-col flex-1 p-6 overflow-hidden">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 p-5">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Search Users</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <Input 
                        placeholder="Name or email..." 
                        className="pl-9 h-11 text-sm bg-white border-slate-200 focus-visible:ring-1 ring-[#1a73e8]/20" 
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                      />
                    </div>
                  </div>

                  {!tenant && (
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter by Tenant</label>
                      <Popover open={isTenantPopoverOpen} onOpenChange={setIsTenantPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            role="combobox"
                            className="w-full h-11 justify-between bg-white border-slate-200 text-sm font-medium px-3"
                          >
                            <span className="truncate">
                              {tenantFilter 
                                ? initialTenants.find(t => t.id === tenantFilter)?.tenantName 
                                : "All Tenants"}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                          <div className="flex items-center border-b px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                              placeholder="Search tenants..."
                              value={tenantSearch}
                              onChange={(e) => setTenantSearch(e.target.value)}
                            />
                          </div>
                          <ScrollArea className="h-60">
                            <div className="p-1">
                              <Button
                                variant="ghost"
                                className="w-full justify-start font-normal text-sm h-10"
                                onClick={() => {
                                  setTenantFilter(null);
                                  setIsTenantPopoverOpen(false);
                                  setTenantSearch("");
                                }}
                              >
                                <Check className={cn("mr-2 h-4 w-4 text-[#1a73e8]", !tenantFilter ? "opacity-100" : "opacity-0")} />
                                All Tenants
                              </Button>
                              {filteredTenantsForDropdown.map((t) => (
                                <Button
                                  key={t.id}
                                  variant="ghost"
                                  className="w-full justify-start font-normal text-sm h-10"
                                  onClick={() => {
                                    setTenantFilter(t.id);
                                    setOutletFilter(null);
                                    setIsTenantPopoverOpen(false);
                                    setTenantSearch("");
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4 text-[#1a73e8]", tenantFilter === t.id ? "opacity-100" : "opacity-0")} />
                                  <span className="truncate flex-1 text-left">{t.tenantName}</span>
                                  <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                    {t.count} Staff
                                  </span>
                                </Button>
                              ))}
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                  
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned Outlet</label>
                    <Select onValueChange={(v) => setOutletFilter(v === 'all' ? null : v)} value={outletFilter || 'all'}>
                      <SelectTrigger className="h-11 bg-white border-slate-200 text-sm">
                        <SelectValue placeholder="All Outlets" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Outlets</SelectItem>
                        {tenantOutlets.map(outlet => (
                          <SelectItem key={outlet.id} value={outlet.id}>{outlet.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Access Role</label>
                    <Select onValueChange={(v) => setRoleFilter(v === 'all' ? null : v)} value={roleFilter || 'all'}>
                      <SelectTrigger className="h-11 bg-white border-slate-200 text-sm">
                        <SelectValue placeholder="All Roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="Organization Admin">Organization Admin</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Partner Admin">Partner Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</label>
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
                      onClick={handleClearFilters}
                    >
                      <FilterX className="h-4 w-4" /> Reset
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-0 overflow-hidden">
                <ScrollArea className="flex-1">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent border-b border-slate-100">
                        <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-8 uppercase tracking-widest">
                          <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors">User <ChevronsUpDown className="h-3 w-3 opacity-50" /></div>
                        </TableHead>
                        <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest">
                          Contact Details
                        </TableHead>
                        {!tenant && (
                          <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest">
                            Parent Tenant
                          </TableHead>
                        )}
                        <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest">
                          Assigned Outlet
                        </TableHead>
                        <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest">
                          Role & Permissions
                        </TableHead>
                        <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest text-center">
                          Status
                        </TableHead>
                        <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-8 text-right uppercase tracking-widest">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedUsers.map((user) => (
                        <TableRow key={user.id} className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 cursor-pointer" onClick={() => handleEditUser(user)}>
                          <TableCell className="py-5 px-8">
                            <div className="font-extrabold text-[#1e293b] text-[15px] group-hover:text-[#1a73e8] transition-colors">{user.fullName}</div>
                            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-tight opacity-70">UID: {user.id}</div>
                          </TableCell>
                          <TableCell className="px-4">
                            <div className="text-[14px] text-slate-700 font-bold leading-tight mb-0.5">{user.email}</div>
                            <div className="text-[12px] text-slate-400 font-medium">{user.phone}</div>
                          </TableCell>
                          {!tenant && (
                            <TableCell className="px-4">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-3.5 w-3.5 text-slate-300" />
                                <span className="text-[14px] text-slate-600 font-bold">{getTenantName(user.tenantId)}</span>
                              </div>
                            </TableCell>
                          )}
                          <TableCell className="px-4">
                            <div className="flex items-center gap-2">
                              <Store className="h-3.5 w-3.5 text-slate-300" />
                              <span className="text-[14px] text-slate-600 font-bold">{getOutletName(user.outletId)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-4">
                            <div className="flex flex-col gap-2">
                              <Badge className="w-fit bg-slate-100 text-slate-600 border-none px-2.5 py-0.5 text-[10px] font-bold shadow-none rounded-md uppercase tracking-wider">
                                {user.role}
                              </Badge>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                                <ShieldCheck className="h-3.5 w-3.5 text-[#1a73e8]" /> Full System Access
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-4">
                            <div className="flex justify-center">
                              <Badge className={cn(
                                "rounded-full px-4 py-1 text-[10px] font-bold border shadow-none uppercase tracking-wider",
                                user.status === 'Active' 
                                  ? "bg-[#e1f9ef] text-[#22c55e] border-[#e1f9ef]" 
                                  : "bg-slate-100 text-slate-500 border-slate-200"
                              )}>
                                {user.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right px-8">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-9 w-9 rounded-full border border-slate-100 text-slate-400 hover:text-[#1e293b] hover:bg-white active:scale-90 transition-all" 
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 p-2">
                                <DropdownMenuItem className="font-bold py-2.5" onClick={() => handleEditUser(user)}>
                                  <Edit2 className="h-4 w-4 mr-3 text-slate-400" /> Edit Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className="font-bold py-2.5" onClick={() => handleSuspendUser(user.id)}>
                                  <PauseCircle className="h-4 w-4 mr-3 text-slate-400" /> Suspend Access
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1" />
                                <DropdownMenuItem className="text-destructive font-black py-2.5" onClick={() => handleDeleteUser(user.id)}>
                                  <Trash2 className="h-4 w-4 mr-3" /> Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredUsers.length === 0 && (
                    <div className="py-24 text-center">
                      <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <UsersIcon className="h-8 w-8 text-slate-200" />
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900">No Users Found</h3>
                      <p className="text-xs text-slate-500 mt-1">Adjust your filters or invite new team members.</p>
                    </div>
                  )}
                </ScrollArea>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                      Showing <span className="text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}</span> of <span className="text-slate-900">{filteredUsers.length}</span> staff
                    </p>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2 border-slate-200"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        if (totalPages > 5) {
                          if (
                            pageNum !== 1 && 
                            pageNum !== totalPages && 
                            Math.abs(pageNum - currentPage) > 1
                          ) {
                            if (pageNum === 2 && currentPage > 3) return <span key="start-ellipsis" className="px-2 text-slate-300">...</span>;
                            if (pageNum === totalPages - 1 && currentPage < totalPages - 2) return <span key="end-ellipsis" className="px-2 text-slate-300">...</span>;
                            return null;
                          }
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "h-8 w-8 p-0 text-[11px] font-black border-slate-200", 
                              currentPage === pageNum ? "bg-slate-900 border-slate-900 text-white" : "text-slate-500"
                            )}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2 border-slate-200"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 p-8 overflow-hidden animate-in fade-in slide-in-from-right duration-500">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col flex-1">
                <ScrollArea className="flex-1">
                  <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-10">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">
                          {tenant ? tenant.tenantName : "Account Admin"}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          {tenant ? "Tenant Admin Profile" : "Administrative Enrollment"}
                        </p>
                        <div className="h-1 w-10 bg-[#1a73e8] rounded-full mt-2" />
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name <span className="text-red-500">*</span></Label>
                          <Input 
                            defaultValue={editingUser?.fullName || ""} 
                            placeholder="Enter full name" 
                            className="h-12 border-slate-200 bg-slate-50/30 focus-visible:bg-white focus-visible:ring-1 ring-[#1a73e8]/20 transition-all font-bold" 
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Username <span className="text-red-500">*</span></Label>
                          <Input 
                            defaultValue={editingUser?.username || ""} 
                            placeholder="@username" 
                            className="h-12 border-slate-200 bg-slate-50/30 font-bold" 
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</Label>
                          <Input 
                            type="email" 
                            defaultValue={editingUser?.email || ""} 
                            placeholder="Enter email address" 
                            className="h-12 border-slate-200 bg-slate-50/30 font-medium" 
                          />
                        </div>

                        {!editingUser && (
                          <>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password <span className="text-red-500">*</span></Label>
                              <Input type="password" placeholder="Enter password" className="h-12 border-slate-200 bg-slate-50/30" />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confirm Password <span className="text-red-500">*</span></Label>
                              <Input type="password" placeholder="Confirm password" className="h-12 border-slate-200 bg-slate-50/30" />
                            </div>
                          </>
                        )}

                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number <span className="text-red-500">*</span></Label>
                          <div className="flex gap-3">
                            <Select defaultValue="+971">
                              <SelectTrigger className="w-[110px] h-12 border-slate-200 bg-slate-50/30 font-bold">
                                <SelectValue placeholder="+971" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="+971">+971</SelectItem>
                                <SelectItem value="+1">+1</SelectItem>
                                <SelectItem value="+44">+44</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input defaultValue={editingUser?.phone || ""} placeholder="000-000-0000" className="h-12 flex-1 border-slate-200 bg-slate-50/30 font-bold tracking-widest" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-10 border-l border-slate-100 pl-16">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">Role Assignment</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Quickly add a new role and assign it to one or multiple restaurants</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-9 border-slate-200 text-[#1a73e8] font-bold gap-2 hover:bg-[#1a73e8]/5"
                        >
                          <PlusCircle className="h-4 w-4" /> Add New Role
                        </Button>
                      </div>

                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <Table>
                          <TableHeader className="bg-slate-50/50">
                            <TableRow className="border-b border-slate-100">
                              <TableHead className="text-[10px] font-bold text-slate-400 h-10 px-4 uppercase tracking-widest">Outlet</TableHead>
                              <TableHead className="text-[10px] font-bold text-slate-400 h-10 px-4 uppercase tracking-widest">Role</TableHead>
                              <TableHead className="text-[10px] font-bold text-slate-400 h-10 px-4 text-right uppercase tracking-widest">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {editingUser?.outletId ? (
                              <TableRow className="border-b-0">
                                <TableCell className="px-4 py-4 text-xs font-bold text-slate-900">{getOutletName(editingUser.outletId)}</TableCell>
                                <TableCell className="px-4 py-4 text-xs font-medium text-slate-500">{editingUser.role}</TableCell>
                                <TableCell className="px-4 py-4 text-right">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ) : (
                              <TableRow className="border-b-0">
                                <TableCell colSpan={3} className="py-20 text-center">
                                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No assignments yet</p>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <div className="p-8 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/30 flex-shrink-0">
                  <Button 
                    variant="outline" 
                    className="h-12 px-8 font-black text-slate-500 border-slate-200 hover:bg-white active:scale-95 transition-all"
                    onClick={() => { setIsAddingNew(false); setEditingUser(null); }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="h-12 px-10 font-black bg-[#1a73e8] hover:bg-[#1557b0] text-white border-none shadow-lg shadow-[#1a73e8]/20 active:scale-95 transition-all"
                    onClick={() => { setIsAddingNew(false); setEditingUser(null); }}
                  >
                    {editingUser ? "Save Changes" : "Add User"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
