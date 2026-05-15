"use client"

import * as React from "react"
import { 
  Search, 
  Users, 
  Building2, 
  Store, 
  ShieldCheck, 
  MoreHorizontal, 
  ChevronsUpDown,
  FilterX,
  Plus,
  Mail,
  Phone,
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  PauseCircle,
  PlayCircle,
  Trash2,
  Edit2,
  RotateCcw
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { initialUsers, initialOutlets, initialTenants } from "@/lib/mock-data"
import { User, Tenant, Outlet } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const ITEMS_PER_PAGE = 10

interface UserListViewProps {
  onAddUser: () => void;
  onEditUser: (user: User) => void;
}

export function UserListView({ onAddUser, onEditUser }: UserListViewProps) {
  const { toast } = useToast()
  const [users, setUsers] = React.useState<User[]>(initialUsers)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [tenantFilter, setTenantFilter] = React.useState<string | null>(null)
  const [outletFilter, setOutletFilter] = React.useState<string | null>(null)
  const [roleFilter, setRoleFilter] = React.useState<string | null>(null)
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  
  const [tenantSearch, setTenantSearch] = React.useState("")
  const [isTenantPopoverOpen, setIsTenantPopoverOpen] = React.useState(false)

  // Dialog states
  const [confirmSuspend, setConfirmSuspend] = React.useState<User | null>(null)
  const [confirmReset, setConfirmReset] = React.useState<User | null>(null)
  const [confirmReactivate, setConfirmReactivate] = React.useState<User | null>(null)

  // Calculate user counts for each tenant for the filter
  const tenantsWithCounts = React.useMemo(() => {
    return initialTenants.map(t => ({
      ...t,
      count: users.filter(u => u.tenantId === t.id).length
    })).filter(t => t.count > 0)
  }, [users])

  const filteredTenantsForDropdown = React.useMemo(() => {
    return tenantsWithCounts.filter(t => 
      t.tenantName.toLowerCase().includes(tenantSearch.toLowerCase())
    )
  }, [tenantsWithCounts, tenantSearch])

  const filteredUsers = React.useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesTenant = !tenantFilter || user.tenantId === tenantFilter
      const matchesOutlet = !outletFilter || user.outletId === outletFilter
      const matchesRole = !roleFilter || user.role === roleFilter
      const matchesStatus = !statusFilter || user.status === statusFilter
      
      return matchesSearch && matchesTenant && matchesOutlet && matchesRole && matchesStatus
    })
  }, [users, searchQuery, tenantFilter, outletFilter, roleFilter, statusFilter])

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const paginatedUsers = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredUsers, currentPage])

  // Reset page when filtering/searching
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, tenantFilter, outletFilter, roleFilter, statusFilter])

  const getTenantName = (tenantId: string) => {
    return initialTenants.find(t => t.id === tenantId)?.tenantName || "Unknown Tenant"
  }

  const getOutletName = (outletId?: string) => {
    if (!outletId) return "Global Access"
    return initialOutlets.find(o => o.id === outletId)?.name || "Unknown Outlet"
  }

  const resetFilters = () => {
    setSearchQuery("")
    setTenantFilter(null)
    setOutletFilter(null)
    setRoleFilter(null)
    setStatusFilter(null)
    setTenantSearch("")
  }

  const handleResetPassword = (user: User) => {
    toast({
      title: "Password Reset Sent",
      description: `A secure credentials reset link has been successfully dispatched to ${user.email}.`,
    })
    setConfirmReset(null)
  }

  const handleSuspendUser = (user: User) => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'Suspended' } : u))
    toast({
      title: "User Suspended",
      description: `${user.fullName}'s access has been successfully suspended.`
    })
    setConfirmSuspend(null)
  }

  const handleReactivateUser = (user: User) => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'Active' } : u))
    toast({
      title: "User Reactivated",
      description: `${user.fullName}'s access has been restored.`
    })
    setConfirmReactivate(null)
  }

  return (
    <div className="p-6 md:p-8 flex flex-col h-full overflow-hidden bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
            <p className="text-sm text-slate-500 mt-1">Manage platform administrators, brand managers, and outlet staff.</p>
          </div>
          <Button size="sm" className="h-10 px-6 font-black bg-[#1a73e8] hover:bg-[#1557b0] shadow-lg shadow-[#1a73e8]/20" onClick={onAddUser}>
            <Plus className="h-4 w-4 mr-2" /> Add New User
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end">
            <div className="md:col-span-2 space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Search Staff</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input 
                  placeholder="Name, username or email..." 
                  className="pl-9 h-11 text-sm bg-white border-slate-200" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Filter by Tenant</label>
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
                          setOutletFilter(null);
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

            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Role</label>
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
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Status</label>
              <Select onValueChange={(v) => setStatusFilter(v === 'all' ? null : v)} value={statusFilter || 'all'}>
                <SelectTrigger className="h-11 bg-white border-slate-200 text-sm">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
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
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors">Username <ChevronsUpDown className="h-3 w-3 opacity-50" /></div>
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest">
                    Email & Phone
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest">
                    Role & Assignments
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest">
                    Last Login
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-8 text-right uppercase tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="group hover:bg-slate-50/50 transition-all border-b border-slate-50">
                    <TableCell className="py-5 px-8">
                      <div className="font-extrabold text-[#1e293b] text-[15px] group-hover:text-[#1a73e8] transition-colors">{user.fullName}</div>
                      <div className="text-[11px] text-[#1a73e8] font-bold uppercase tracking-tight opacity-70">{user.username}</div>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <Mail className="h-3 w-3 text-slate-400" /> {user.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                          <Phone className="h-3 w-3" /> {user.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex flex-col gap-2">
                        <Badge className="w-fit bg-slate-100 text-slate-600 border-none px-2.5 py-0.5 text-[10px] font-bold shadow-none rounded-md uppercase tracking-wider">
                          {user.role}
                        </Badge>
                        <div className="flex items-center gap-1.5">
                          <Store className="h-3 w-3 text-slate-300" />
                          <span className="text-[12px] text-slate-500 font-bold">{getOutletName(user.outletId)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                          <Building2 className="h-3 w-3" /> {getTenantName(user.tenantId)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 text-center">
                      <div className="flex justify-center">
                        <Badge className={cn(
                          "rounded-full px-4 py-1 text-[10px] font-bold border shadow-none uppercase tracking-wider",
                          user.status === 'Active' 
                            ? "bg-[#e1f9ef] text-[#22c55e] border-[#e1f9ef]" 
                            : user.status === 'Suspended'
                              ? "bg-rose-100 text-rose-500 border-rose-200"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                        )}>
                          {user.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Clock className="h-3.5 w-3.5 text-slate-300" />
                        {user.lastActive || "Never logged in"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-white border border-transparent hover:border-slate-100 text-slate-400 transition-all">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-2">
                          <DropdownMenuItem className="font-bold py-2.5" onClick={() => onEditUser(user)}>
                            <Edit2 className="h-4 w-4 mr-3 text-slate-400" /> Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="font-bold py-2.5" onClick={() => setConfirmReset(user)}>
                            <RotateCcw className="h-4 w-4 mr-3 text-slate-400" /> Reset Password
                          </DropdownMenuItem>
                          
                          {user.status === 'Suspended' ? (
                            <DropdownMenuItem className="font-bold py-2.5 text-green-600" onClick={() => setConfirmReactivate(user)}>
                              <PlayCircle className="h-4 w-4 mr-3" /> Reactivate Access
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="font-bold py-2.5 text-rose-500" onClick={() => setConfirmSuspend(user)}>
                              <PauseCircle className="h-4 w-4 mr-3" /> Suspend Access
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator className="my-1" />
                          <DropdownMenuItem className="text-destructive font-black py-2.5">
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
                  <Users className="h-8 w-8 text-slate-200" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">No Users Detected</h3>
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

      {/* Confirmation Dialogs */}
      <AlertDialog open={!!confirmSuspend} onOpenChange={() => setConfirmSuspend(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Staff Access?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately revoke <strong>{confirmSuspend?.fullName}</strong>'s access to the platform. 
              They will not be able to log in until their access is restored.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-rose-500 hover:bg-rose-600" onClick={() => confirmSuspend && handleSuspendUser(confirmSuspend)}>
              Confirm Suspension
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!confirmReactivate} onOpenChange={() => setConfirmReactivate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate Staff Access?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore platform access for <strong>{confirmReactivate?.fullName}</strong>. 
              They will be able to log in using their existing credentials.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-green-600 hover:bg-green-700" onClick={() => confirmReactivate && handleReactivateUser(confirmReactivate)}>
              Reactivate Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!confirmReset} onOpenChange={() => setConfirmReset(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset User Password?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to send a password reset link to <strong>{confirmReset?.email}</strong>? 
              Their current password will remain active until they choose a new one.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmReset && handleResetPassword(confirmReset)}>
              Send Reset Link
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
