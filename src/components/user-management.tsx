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
  PlayCircle,
  Mail,
  Phone,
  Check,
  ChevronLeft,
  Loader2,
  Eye,
  EyeOff,
  RotateCcw,
  Info,
  UserPlus,
  HelpCircle
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
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const ITEMS_PER_PAGE = 10

interface UserAssignment {
  id: string;
  outletId: string;
  role: string;
}

interface UserManagementProps {
  tenant?: Tenant | null;
  editingUser?: User | null;
  isOpen: boolean;
  defaultAdding?: boolean;
  onClose: () => void;
}

export function UserManagement({ tenant, editingUser: propEditingUser, isOpen, defaultAdding = false, onClose }: UserManagementProps) {
  const { toast } = useToast()
  const [users, setUsers] = React.useState<User[]>(initialUsers)
  const [userFilter, setUserFilter] = React.useState("")
  const [tenantFilter, setTenantFilter] = React.useState<string | null>(null)
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)
  const [roleFilter, setRoleFilter] = React.useState<string | null>(null)
  const [outletFilter, setOutletFilter] = React.useState<string | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  
  const [isAddingNew, setIsAddingNew] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<User | null>(null)
  const [isFormLoading, setIsFormLoading] = React.useState(false)
  
  const [tenantSearch, setTenantSearch] = React.useState("")
  const [isTenantPopoverOpen, setIsTenantPopoverOpen] = React.useState(false)

  // Dialog states
  const [confirmSuspend, setConfirmSuspend] = React.useState<User | null>(null)
  const [confirmReset, setConfirmReset] = React.useState<User | null>(null)
  const [confirmReactivate, setConfirmReactivate] = React.useState<User | null>(null)

  // Form State
  const [formFullName, setFormFullName] = React.useState("")
  const [formUsername, setFormUsername] = React.useState("")
  const [formEmail, setFormEmail] = React.useState("")
  const [formPhone, setFormPhone] = React.useState("")
  const [formEmployeeId, setFormEmployeeId] = React.useState("")
  const [formPrimaryRole, setFormPrimaryRole] = React.useState<string>("Staff")
  const [formTenantId, setFormTenantId] = React.useState("")
  const [formPassword, setFormPassword] = React.useState("")
  const [formConfirmPassword, setFormConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [assignments, setAssignments] = React.useState<UserAssignment[]>([])

  const getTenantName = (tenantId: string) => {
    return initialTenants.find(t => t.id === tenantId)?.tenantName || "Unknown Tenant"
  }

  const resetForm = React.useCallback(() => {
    setFormFullName("")
    setFormUsername("")
    setFormEmail("")
    setFormPhone("")
    setFormEmployeeId("")
    setFormPrimaryRole('Staff')
    setFormTenantId(tenant?.id || "")
    setFormPassword("")
    setFormConfirmPassword("")
    setShowPassword(false)
    setShowConfirmPassword(false)
    setAssignments([])
  }, [tenant])

  const restoreUI = React.useCallback(() => {
    setTimeout(() => {
      document.body.style.pointerEvents = '';
      document.body.style.overflow = '';
      const html = document.documentElement;
      if (html) {
        html.style.pointerEvents = '';
        html.style.overflow = '';
      }
    }, 300);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      if (propEditingUser) {
        setEditingUser(propEditingUser)
        setIsAddingNew(true)
        setFormFullName(propEditingUser.fullName)
        setFormUsername(propEditingUser.username)
        setFormEmail(propEditingUser.email)
        setFormPhone(propEditingUser.phone)
        setFormPrimaryRole(propEditingUser.role)
        setFormTenantId(propEditingUser.tenantId)
        setFormEmployeeId(`EMP-${propEditingUser.id.split('-').pop()}`)
        setFormPassword("")
        setFormConfirmPassword("")
        
        if (propEditingUser.outletId) {
          setAssignments([{
            id: '1',
            outletId: propEditingUser.outletId,
            role: propEditingUser.role
          }])
        } else {
          setAssignments([])
        }
      } else if (defaultAdding) {
        setIsAddingNew(true)
        setEditingUser(null)
        resetForm()
      } else {
        setIsAddingNew(false)
        setEditingUser(null)
      }
    }
  }, [propEditingUser, defaultAdding, isOpen, resetForm])

  const tenantsWithCounts = React.useMemo(() => {
    return initialTenants.map(t => ({
      ...t,
      count: users.filter(u => u.tenantId === t.id).length
    })).filter(t => t.count > 0)
  }, [users])

  const activeTenantId = formTenantId || tenant?.id
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
    setIsFormLoading(true)
    setEditingUser(user)
    setIsAddingNew(true)
    setFormFullName(user.fullName)
    setFormUsername(user.username)
    setFormEmail(user.email)
    setFormPhone(user.phone)
    setFormPrimaryRole(user.role)
    setFormTenantId(user.tenantId)
    setFormEmployeeId(`EMP-${user.id.split('-').pop()}`)
    setFormPassword("")
    setFormConfirmPassword("")
    
    if (user.outletId) {
      setAssignments([{ id: '1', outletId: user.outletId, role: user.role }])
    } else {
      setAssignments([])
    }
    setTimeout(() => setIsFormLoading(false), 500)
  }

  const handleAddNewUser = () => {
    setIsFormLoading(true)
    setEditingUser(null)
    setIsAddingNew(true)
    resetForm()
    setTimeout(() => setIsFormLoading(false), 400)
  }

  const handleAddAssignment = () => {
    const newId = Date.now().toString();
    setAssignments([...assignments, { id: newId, outletId: "all", role: "Staff" }]);
  }

  const handleRemoveAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
  }

  const handleUpdateAssignment = (id: string, field: keyof UserAssignment, value: string) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, [field]: value } : a));
  }

  const handleSaveUser = () => {
    if (!formFullName || !formUsername || !formEmail || !formTenantId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields, including the Parent Tenant.",
        variant: "destructive"
      })
      return
    }

    if (!editingUser && (formPassword !== formConfirmPassword)) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      })
      return
    }

    const firstAssignment = assignments[0];

    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? {
        ...u,
        fullName: formFullName,
        username: formUsername,
        email: formEmail,
        phone: formPhone,
        role: (firstAssignment?.role || formPrimaryRole) as any,
        tenantId: formTenantId,
        outletId: (!firstAssignment || firstAssignment.outletId === "all") ? undefined : firstAssignment.outletId
      } : u))
      toast({
        title: "Staff Profile Updated",
        description: `${formFullName}'s details have been saved.`
      })
    } else {
      const newUser: User = {
        id: `u-${Math.random().toString(36).substr(2, 9)}`,
        fullName: formFullName,
        username: formUsername,
        email: formEmail,
        phone: formPhone,
        role: (firstAssignment?.role || formPrimaryRole) as any,
        tenantId: formTenantId,
        outletId: (!firstAssignment || firstAssignment.outletId === "all") ? undefined : firstAssignment.outletId,
        status: 'Active',
        lastActive: 'Just now'
      }
      setUsers(prev => [newUser, ...prev])
      toast({
        title: "Staff Member Enrolled",
        description: `${formFullName} has been successfully added to the system.`
      })
    }
    setIsAddingNew(false)
    setEditingUser(null)
  }

  const handleSuspendUser = (user: User) => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'Suspended' } : u))
    toast({
      title: "User Suspended",
      description: `${user.fullName}'s access has been successfully suspended.`
    })
    setConfirmSuspend(null)
    restoreUI()
  }

  const handleReactivateUser = (user: User) => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'Active' } : u))
    toast({
      title: "User Reactivated",
      description: `${user.fullName}'s access has been restored.`
    })
    setConfirmReactivate(null)
    restoreUI()
  }

  const handleResetPassword = (user: User) => {
    toast({
      title: "Password Reset Sent",
      description: `A secure credentials reset link has been successfully dispatched to ${user.email}.`,
    })
    setConfirmReset(null)
    restoreUI()
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId))
    toast({
      title: "User Deleted",
      description: "Staff member has been successfully removed from the platform."
    })
    restoreUI()
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

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const paginatedUsers = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredUsers, currentPage])

  const selectedTenantName = React.useMemo(() => {
    const tid = formTenantId || tenant?.id
    if (!tid) return null
    return initialTenants.find(t => t.id === tid)?.tenantName
  }, [tenant, formTenantId])

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(val) => {
        if (!val) {
          onClose()
          restoreUI()
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
                    <span className="text-[#1a73e8] font-black">{tenant?.tenantName.toUpperCase() || (selectedTenantName?.toUpperCase() || "GLOBAL MANAGEMENT")}</span>
                    <ChevronRight className="h-2.5 w-2.5 opacity-30" />
                    <span className="opacity-80">USERS</span>
                  </div>
                  <SheetTitle className="text-2xl font-black text-[#1e293b] tracking-tight">
                    {editingUser 
                      ? `Edit ${editingUser.fullName}` 
                      : isAddingNew 
                        ? (selectedTenantName ? `Add New Staff to ${selectedTenantName}` : "Add New Staff Member")
                        : tenant 
                          ? `User Management of ${tenant.tenantName}` 
                          : "User Management"}
                  </SheetTitle>
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
                          <SelectItem value="Suspended">Suspended</SelectItem>
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
                                <span className="text-[14px] text-slate-600 font-bold">{initialOutlets.find(o => o.id === user.outletId)?.name || "Global Access"}</span>
                              </div>
                            </TableCell>
                            <TableCell className="px-4">
                              <div className="flex flex-col gap-2">
                                <Badge className="w-fit bg-slate-100 text-slate-600 border-none px-2.5 py-0.5 text-[10px] font-bold shadow-none rounded-md uppercase tracking-wider">
                                  {user.role}
                                </Badge>
                                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                                  <ShieldCheck className="h-3.5 w-3.5 text-[#1a73e8]" /> Verified Staff
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-4">
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
                      <div className="py-32 text-center">
                        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                          <UsersIcon className="h-8 w-8 text-slate-200" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">No Users Detected</h3>
                        <p className="text-xs text-slate-500 mt-1">Refine your search or add a new team member.</p>
                      </div>
                    )}
                  </ScrollArea>
                  
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
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum = i + 1;
                          if (totalPages > 5 && currentPage > 3) {
                            pageNum = currentPage - 2 + i;
                            if (pageNum > totalPages) pageNum = totalPages - (4 - i);
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
                    {isFormLoading ? (
                      <div className="flex flex-col items-center justify-center py-40 space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin text-[#1a73e8]" />
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Preparing Profile...</p>
                      </div>
                    ) : (
                      <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="space-y-10">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-8 w-8 rounded-xl bg-[#1a73e8]/10 flex items-center justify-center">
                                <UserPlus className="h-4 w-4 text-[#1a73e8]" />
                              </div>
                              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Personal Information</h3>
                            </div>
                            <p className="text-sm text-slate-400 font-medium">Enter the fundamental identity details for this staff member.</p>
                          </div>

                          <div className="space-y-6">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label className="text-[13px] font-bold text-slate-700">Step 1: Parent Tenant <span className="text-red-500">*</span></Label>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="h-3.5 w-3.5 text-slate-300 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[250px]">
                                      The selection here determines which restaurant locations and brands will be available for role assignment in Step 2.
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <Select value={formTenantId} onValueChange={(val) => { setFormTenantId(val); setAssignments([]); }}>
                                <SelectTrigger className="h-12 bg-[#1a73e8]/5 border-[#1a73e8]/20 font-black text-[#1a73e8]">
                                  <SelectValue placeholder="Select Parent Organization" />
                                </SelectTrigger>
                                <SelectContent>
                                  {initialTenants.map(t => (
                                    <SelectItem key={t.id} value={t.id}>{t.tenantName}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <p className="text-[11px] text-[#1a73e8] font-bold uppercase tracking-tight mt-1">This user will belong to this organization.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label className="text-[13px] font-bold text-slate-700">Username <span className="text-red-500">*</span></Label>
                                <Input 
                                  value={formUsername} 
                                  onChange={(e) => setFormUsername(e.target.value)}
                                  placeholder="e.g. jdoe_01" 
                                  className="h-12 border-slate-200 bg-slate-50/30 focus-visible:bg-white" 
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[13px] font-bold text-slate-700">Full Name <span className="text-red-500">*</span></Label>
                                <Input 
                                  value={formFullName} 
                                  onChange={(e) => setFormFullName(e.target.value)}
                                  placeholder="Enter Full Name" 
                                  className="h-12 border-slate-200 bg-slate-50/30 focus-visible:bg-white" 
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-[13px] font-bold text-slate-700">Email Address <span className="text-red-500">*</span></Label>
                              <Input 
                                type="email" 
                                value={formEmail} 
                                onChange={(e) => setFormEmail(e.target.value)}
                                placeholder="email@brand.com" 
                                className="h-12 border-slate-200 bg-slate-50/30 focus-visible:bg-white" 
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-[13px] font-bold text-slate-700">Phone Number <span className="text-red-500">*</span></Label>
                              <div className="flex gap-2">
                                <Select defaultValue="+971">
                                  <SelectTrigger className="w-[100px] h-12 border-slate-200 font-bold bg-slate-50/30">
                                    <SelectValue placeholder="+971" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="+971">+971</SelectItem>
                                    <SelectItem value="+1">+1</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Input 
                                  value={formPhone} 
                                  onChange={(e) => setFormPhone(e.target.value)}
                                  placeholder="50 000 0000" 
                                  className="h-12 flex-1 border-slate-200 bg-slate-50/30 focus-visible:bg-white" 
                                />
                              </div>
                            </div>

                            {!editingUser && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-[13px] font-bold text-slate-700">Password <span className="text-red-500">*</span></Label>
                                  <div className="relative">
                                    <Input 
                                      type={showPassword ? "text" : "password"} 
                                      value={formPassword} 
                                      onChange={(e) => setFormPassword(e.target.value)}
                                      placeholder="••••••••" 
                                      className="h-12 border-slate-200 bg-slate-50/30 focus-visible:bg-white pr-10" 
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-[13px] font-bold text-slate-700">Confirm <span className="text-red-500">*</span></Label>
                                  <div className="relative">
                                    <Input 
                                      type={showConfirmPassword ? "text" : "password"} 
                                      value={formConfirmPassword} 
                                      onChange={(e) => setFormConfirmPassword(e.target.value)}
                                      placeholder="••••••••" 
                                      className="h-12 border-slate-200 bg-slate-50/30 focus-visible:bg-white pr-10" 
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-10 border-l border-dashed border-slate-200 pl-16">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-8 w-8 rounded-xl bg-[#1a73e8]/10 flex items-center justify-center">
                                <ShieldCheck className="h-4 w-4 text-[#1a73e8]" />
                              </div>
                              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Step 2: Role Assignment</h3>
                            </div>
                            <p className="text-sm text-slate-400 font-medium">Map this staff member to specific restaurant locations with defined access levels.</p>
                          </div>

                          {!formTenantId ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 p-8">
                              <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-slate-50">
                                <Building2 className="h-8 w-8 text-slate-200" />
                              </div>
                              <h4 className="font-extrabold text-[#1e293b] text-lg">Parent Tenant Required</h4>
                              <p className="text-xs text-slate-400 mt-2 max-w-[280px] leading-relaxed">
                                Please complete <strong>Step 1</strong> by selecting a parent organization to unlock location assignments for this user.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <Table>
                                <TableHeader>
                                  <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest h-10">Restaurant Outlet</TableHead>
                                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest h-10">Access Role</TableHead>
                                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest h-10 text-right">Action</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {assignments.map((assignment) => (
                                    <TableRow key={assignment.id} className="border-none hover:bg-transparent">
                                      <TableCell className="p-1 pb-4 pr-4">
                                        <Select value={assignment.outletId} onValueChange={(val) => handleUpdateAssignment(assignment.id, 'outletId', val)}>
                                          <SelectTrigger className="h-12 border-slate-200 bg-slate-50/30 focus-visible:bg-white font-bold">
                                            <SelectValue placeholder="Select Location" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="all" className="font-bold text-[#1a73e8]">Global Access (All Current & Future Locations)</SelectItem>
                                            <DropdownMenuSeparator />
                                            {tenantOutlets.map(o => (
                                              <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </TableCell>
                                      <TableCell className="p-1 pb-4">
                                        <Select value={assignment.role} onValueChange={(val) => handleUpdateAssignment(assignment.id, 'role', val)}>
                                          <SelectTrigger className="h-12 border-slate-200 bg-slate-50/30 focus-visible:bg-white font-bold min-w-[160px]">
                                            <SelectValue placeholder="Assign Role" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Staff">Staff</SelectItem>
                                            <SelectItem value="Manager">Manager</SelectItem>
                                            <SelectItem value="Organization Admin">Organization Admin</SelectItem>
                                            <SelectItem value="Partner Admin">Partner Admin</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </TableCell>
                                      <TableCell className="p-1 pb-4 text-right">
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <button 
                                                className="h-12 w-12 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all flex items-center justify-center active:scale-90"
                                                onClick={() => handleRemoveAssignment(assignment.id)}
                                              >
                                                <Trash2 className="h-5 w-5" />
                                              </button>
                                            </TooltipTrigger>
                                            <TooltipContent>Remove Assignment</TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                              <Button 
                                variant="outline" 
                                className="w-full h-14 border-2 border-dashed border-[#1a73e8]/20 text-[#1a73e8] hover:text-[#1a73e8] hover:border-[#1a73e8] hover:bg-[#1a73e8]/5 font-black transition-all rounded-2xl"
                                onClick={handleAddAssignment}
                              >
                                <PlusCircle className="h-5 w-5 mr-3" /> 
                                Add New Access Assignment
                              </Button>
                              <div className="flex gap-3 p-5 bg-amber-50 rounded-2xl border border-amber-100">
                                <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-amber-700 font-bold leading-relaxed uppercase tracking-tight">
                                  Assigning multiple outlets allows this staff member to switch between branch views in their management portal.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </ScrollArea>

                  <div className="p-8 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/30 flex-shrink-0">
                    <Button 
                      variant="outline" 
                      className="h-12 px-8 font-black text-slate-500 border-slate-200 hover:bg-white active:scale-95 transition-all"
                      onClick={() => { setIsAddingNew(false); setEditingUser(null); restoreUI(); }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="h-12 px-10 font-black bg-[#1a73e8] hover:bg-[#1557b0] text-white border-none shadow-lg shadow-[#1a73e8]/20 active:scale-95 transition-all"
                      onClick={handleSaveUser}
                    >
                      {editingUser ? "Save Profile Changes" : "Finalize Staff Enrollment"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialogs */}
      <AlertDialog open={!!confirmSuspend} onOpenChange={(open) => {
        if (!open) {
          setConfirmSuspend(null);
          restoreUI();
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Staff Access?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately revoke <strong>{confirmSuspend?.fullName}</strong>'s access to the platform. 
              They will not be able to log in until their access is restored.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={restoreUI}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-rose-500 hover:bg-rose-600" onClick={() => confirmSuspend && handleSuspendUser(confirmSuspend)}>
              Confirm Suspension
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!confirmReactivate} onOpenChange={(open) => {
        if (!open) {
          setConfirmReactivate(null);
          restoreUI();
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate Staff Access?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore platform access for <strong>{confirmReactivate?.fullName}</strong>. 
              They will be able to log in using their existing credentials.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={restoreUI}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-green-600 hover:bg-green-700" onClick={() => confirmReactivate && handleReactivateUser(confirmReactivate)}>
              Reactivate Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!confirmReset} onOpenChange={(open) => {
        if (!open) {
          setConfirmReset(null);
          restoreUI();
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset User Password?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to send a password reset link to <strong>{confirmReset?.email}</strong>? 
              Their current password will remain active until they choose a new one.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={restoreUI}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmReset && handleResetPassword(confirmReset)}>
              Send Reset Link
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
