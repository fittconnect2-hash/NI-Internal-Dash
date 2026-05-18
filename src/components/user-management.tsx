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
  const [isFormTenantPopoverOpen, setIsFormTenantPopoverOpen] = React.useState(false)
  const [formTenantSearch, setFormTenantSearch] = React.useState("")

  const [confirmSuspend, setConfirmSuspend] = React.useState<User | null>(null)
  const [confirmReset, setConfirmReset] = React.useState<User | null>(null)
  const [confirmReactivate, setConfirmReactivate] = React.useState<User | null>(null)

  const [formFullName, setFormFullName] = React.useState("")
  const [formUsername, setFormUsername] = React.useState("")
  const [formEmail, setFormEmail] = React.useState("")
  const [formPhone, setFormPhone] = React.useState("")
  const [formPrimaryRole, setFormPrimaryRole] = React.useState<string>("Staff")
  const [formTenantId, setFormTenantId] = React.useState("")
  const [formPassword, setFormPassword] = React.useState("")
  const [formConfirmPassword, setFormConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [assignments, setAssignments] = React.useState<UserAssignment[]>([])

  const getTenantName = (tid: string) => {
    return initialTenants.find(t => t.id === tid)?.tenantName || "Unknown Tenant"
  }

  // Restore interactivity to body when drawer closes
  const restoreInteractivity = React.useCallback(() => {
    document.body.style.pointerEvents = 'auto';
    document.body.style.overflow = 'auto';
  }, []);

  const resetForm = React.useCallback(() => {
    setFormFullName("")
    setFormUsername("")
    setFormEmail("")
    setFormPhone("")
    setFormPrimaryRole('Staff')
    setFormTenantId(tenant?.id || "")
    setFormPassword("")
    setFormConfirmPassword("")
    setShowPassword(false)
    setShowConfirmPassword(false)
    setAssignments([])
    setFormTenantSearch("")
  }, [tenant])

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
        setFormPassword("")
        setFormConfirmPassword("")
        if (propEditingUser.outletId) {
          setAssignments([{ id: '1', outletId: propEditingUser.outletId, role: propEditingUser.role }])
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
    } else {
      restoreInteractivity()
    }
  }, [propEditingUser, defaultAdding, isOpen, resetForm, restoreInteractivity])

  const ITEMS_PER_PAGE = 10
  const tenantOutlets = React.useMemo(() => {
    const activeTid = formTenantId || tenant?.id
    return initialOutlets.filter(o => !activeTid || o.tenantId === activeTid)
  }, [formTenantId, tenant])

  const filteredTenantsForDropdown = React.useMemo(() => {
    return initialTenants.filter(t => t.tenantName.toLowerCase().includes(tenantSearch.toLowerCase()))
  }, [tenantSearch])

  const filteredTenantsForForm = React.useMemo(() => {
    return initialTenants.filter(t => t.tenantName.toLowerCase().includes(formTenantSearch.toLowerCase()))
  }, [formTenantSearch])

  const filteredUsers = React.useMemo(() => {
    return users.filter(u => {
      const matchesTenant = tenant ? u.tenantId === tenant.id : (!tenantFilter || u.tenantId === tenantFilter)
      const matchesUser = !userFilter || u.fullName.toLowerCase().includes(userFilter.toLowerCase()) || u.email.toLowerCase().includes(userFilter.toLowerCase())
      const matchesStatus = !statusFilter || u.status === statusFilter
      const matchesRole = !roleFilter || u.role === roleFilter
      const matchesOutlet = !outletFilter || u.outletId === outletFilter
      return matchesTenant && matchesUser && matchesStatus && matchesRole && matchesOutlet
    })
  }, [users, tenant, tenantFilter, userFilter, statusFilter, roleFilter, outletFilter])

  const paginatedUsers = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredUsers, currentPage])

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)

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

  const handleSaveUser = () => {
    if (!formFullName || !formUsername || !formEmail || !formTenantId) {
      toast({ title: "Missing Information", description: "Please fill in all required fields.", variant: "destructive" })
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
      toast({ title: "Staff Profile Updated", description: `${formFullName}'s details have been saved.` })
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
      toast({ title: "Staff Member Enrolled", description: `${formFullName} has been added.` })
    }
    setIsAddingNew(false)
    setEditingUser(null)
  }

  const handleSuspendUser = (u: User) => {
    setUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, status: 'Suspended' } : usr))
    toast({ title: "User Suspended", description: `${u.fullName}'s access revoked.` })
    setConfirmSuspend(null)
    restoreInteractivity()
  }

  const handleReactivateUser = (u: User) => {
    setUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, status: 'Active' } : usr))
    toast({ title: "User Reactivated", description: `${u.fullName}'s access restored.` })
    setConfirmReactivate(null)
    restoreInteractivity()
  }

  const handleResetPassword = (u: User) => {
    toast({ title: "Password Reset Sent", description: `Reset link sent to ${u.email}.` })
    setConfirmReset(null)
    restoreInteractivity()
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(val) => { if (!val) { onClose(); restoreInteractivity(); } }}>
        <SheetContent side="right" className="w-full sm:max-w-[1200px] p-0 border-l border-slate-200 bg-[#f8f9fc] flex flex-col">
          <SheetHeader className="px-8 py-6 bg-white border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button onClick={isAddingNew ? () => { setIsAddingNew(false); setEditingUser(null); } : onClose} className="p-2 hover:bg-slate-50 rounded-lg transition-colors group">
                  <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-slate-900" />
                </button>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 opacity-80"><Building2 className="h-3 w-3" /> TENANTS</span>
                    <ChevronRight className="h-2.5 w-2.5 opacity-30" />
                    <span className="text-[#1a73e8] font-black">{tenant?.tenantName.toUpperCase() || "USER MANAGEMENT"}</span>
                  </div>
                  <SheetTitle className="text-2xl font-black text-[#1e293b] tracking-tight">
                    {isAddingNew ? (editingUser ? `Edit ${editingUser.fullName}` : "Add New Staff") : "Platform Users"}
                  </SheetTitle>
                </div>
              </div>
              {!isAddingNew && (
                <Button onClick={handleAddNewUser} className="h-10 px-6 font-black bg-[#1a73e8] hover:bg-[#1557b0] shadow-lg shadow-[#1a73e8]/20">
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
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Search Users</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input placeholder="Name or email..." className="pl-9 h-11 text-sm bg-white border-slate-200" value={userFilter} onChange={(e) => setUserFilter(e.target.value)} />
                      </div>
                    </div>
                    {!tenant && (
                      <div className="space-y-2.5">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tenant</Label>
                        <Popover open={isTenantPopoverOpen} onOpenChange={setIsTenantPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full h-11 justify-between bg-white border-slate-200 text-sm font-medium px-3">
                              <span className="truncate">{tenantFilter ? getTenantName(tenantFilter) : "All Tenants"}</span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-0 shadow-2xl border-slate-200" align="start">
                            <div className="flex items-center border-b px-3">
                              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                              <Input 
                                className="flex h-11 w-full border-none shadow-none focus-visible:ring-0 bg-transparent py-3 text-sm outline-none" 
                                placeholder="Search..." 
                                value={tenantSearch} 
                                onChange={(e) => setTenantSearch(e.target.value)} 
                              />
                            </div>
                            <ScrollArea className="h-60">
                              <div className="p-1">
                                <Button variant="ghost" className="w-full justify-start font-normal text-sm h-10" onClick={() => { setTenantFilter(null); setIsTenantPopoverOpen(false); }}>All Tenants</Button>
                                {filteredTenantsForDropdown.map(t => (
                                  <Button key={t.id} variant="ghost" className="w-full justify-start font-normal text-sm h-10" onClick={() => { setTenantFilter(t.id); setIsTenantPopoverOpen(false); }}>{t.tenantName}</Button>
                                ))}
                              </div>
                            </ScrollArea>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                    <div className="space-y-2.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</Label>
                      <Select onValueChange={(v) => setRoleFilter(v === 'all' ? null : v)} value={roleFilter || 'all'}>
                        <SelectTrigger className="h-11 bg-white border-slate-200 text-sm"><SelectValue placeholder="All Roles" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="Organization Admin">Organization Admin</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Partner Admin">Partner Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</Label>
                      <Select onValueChange={(v) => setStatusFilter(v === 'all' ? null : v)} value={statusFilter || 'all'}>
                        <SelectTrigger className="h-11 bg-white border-slate-200 text-sm"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Button variant="ghost" className="w-full h-11 text-slate-400 hover:text-[#1a73e8] gap-2 font-bold" onClick={() => { setUserFilter(""); setTenantFilter(null); setStatusFilter(null); setRoleFilter(null); setOutletFilter(null); }}>
                        <FilterX className="h-4 w-4" /> Reset
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-0">
                  <ScrollArea className="flex-1">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-b border-slate-100">
                          <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-8 uppercase tracking-widest">User</TableHead>
                          <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest">Contact</TableHead>
                          <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest">Role</TableHead>
                          <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest text-center">Status</TableHead>
                          <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-8 text-right uppercase tracking-widest">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedUsers.map((user) => (
                          <TableRow key={user.id} className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 cursor-pointer" onClick={() => handleEditUser(user)}>
                            <TableCell className="py-5 px-8">
                              <div className="font-extrabold text-[#1e293b] text-[15px] group-hover:text-[#1a73e8] transition-colors">{user.fullName}</div>
                              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-tight opacity-70">@{user.username}</div>
                            </TableCell>
                            <TableCell className="px-4">
                              <div className="text-[13px] text-slate-600 font-bold">{user.email}</div>
                              <div className="text-[11px] text-slate-400">{user.phone}</div>
                            </TableCell>
                            <TableCell className="px-4">
                              <Badge className="bg-slate-100 text-slate-600 border-none px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md">{user.role}</Badge>
                            </TableCell>
                            <TableCell className="px-4 text-center">
                              <Badge className={cn("rounded-full px-4 py-1 text-[10px] font-bold uppercase", user.status === 'Active' ? "bg-[#e1f9ef] text-[#22c55e]" : user.status === 'Suspended' ? "bg-rose-100 text-rose-500" : "bg-slate-100 text-slate-50")}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right px-8">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-400" onClick={(e) => e.stopPropagation()}><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 p-2">
                                  <DropdownMenuItem className="font-bold py-2.5" onClick={(e) => { e.stopPropagation(); handleEditUser(user); }}><Edit2 className="h-4 w-4 mr-3 text-slate-400" /> Edit Profile</DropdownMenuItem>
                                  <DropdownMenuItem className="font-bold py-2.5" onClick={(e) => { e.stopPropagation(); setConfirmReset(user); }}><RotateCcw className="h-4 w-4 mr-3 text-slate-400" /> Reset Password</DropdownMenuItem>
                                  {user.status === 'Suspended' ? (
                                    <DropdownMenuItem className="font-bold py-2.5 text-green-600" onClick={(e) => { e.stopPropagation(); setConfirmReactivate(user); }}><PlayCircle className="h-4 w-4 mr-3" /> Reactivate</DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem className="font-bold py-2.5 text-rose-500" onClick={(e) => { e.stopPropagation(); setConfirmSuspend(user); }}><PauseCircle className="h-4 w-4 mr-3" /> Suspend</DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                  {totalPages > 1 && (
                    <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Showing {currentPage} of {totalPages} Pages</p>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-8 px-2" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" className="h-8 px-2" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 p-8 overflow-hidden flex flex-col">
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
                              <div className="h-8 w-8 rounded-xl bg-[#1a73e8]/10 flex items-center justify-center"><UserPlus className="h-4 w-4 text-[#1a73e8]" /></div>
                              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Personal Information</h3>
                            </div>
                            <p className="text-sm text-slate-400 font-medium">Fundamental staff details.</p>
                          </div>

                          <div className="space-y-6">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label className="text-[13px] font-bold text-slate-700">Step 1: Parent Tenant <span className="text-red-500">*</span></Label>
                                <HelpCircle className="h-3.5 w-3.5 text-slate-300 cursor-help" />
                              </div>
                              <Popover modal={true} open={isFormTenantPopoverOpen} onOpenChange={setIsFormTenantPopoverOpen}>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" className="w-full h-12 justify-between bg-[#1a73e8]/5 border-[#1a73e8]/20 font-black text-[#1a73e8] px-3">
                                    <span className="truncate">{formTenantId ? getTenantName(formTenantId) : "Select Parent Organization"}</span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent 
                                  className="w-80 p-0 shadow-2xl border-slate-200 z-[110]" 
                                  align="start"
                                  onPointerDownOutside={(e) => e.preventDefault()}
                                  onInteractOutside={(e) => e.preventDefault()}
                                >
                                  <div className="p-2 border-b bg-slate-50/50">
                                    <div className="relative">
                                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                      <Input 
                                        autoFocus
                                        className="h-10 w-full pl-9 pr-3 rounded-md bg-white border border-slate-200 text-sm focus-visible:ring-1 ring-primary/20" 
                                        placeholder="Search tenants..." 
                                        value={formTenantSearch} 
                                        onChange={(e) => setFormTenantSearch(e.target.value)} 
                                      />
                                    </div>
                                  </div>
                                  <ScrollArea className="h-64">
                                    <div className="p-1 space-y-0.5">
                                      {filteredTenantsForForm.map(t => (
                                        <button 
                                          key={t.id} 
                                          className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors hover:bg-slate-100 group", formTenantId === t.id && "bg-primary/5 text-primary font-bold")}
                                          onClick={() => { setFormTenantId(t.id); setAssignments([]); setIsFormTenantPopoverOpen(false); setFormTenantSearch(""); }}
                                        >
                                          <span>{t.tenantName}</span>
                                          {formTenantId === t.id && <Check className="h-4 w-4" />}
                                        </button>
                                      ))}
                                      {filteredTenantsForForm.length === 0 && <div className="p-8 text-center text-xs text-slate-400">No organizations found.</div>}
                                    </div>
                                  </ScrollArea>
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2"><Label className="text-[13px] font-bold text-slate-700">Username</Label><Input value={formUsername} onChange={(e) => setFormUsername(e.target.value)} placeholder="e.g. jdoe" className="h-12 border-slate-200" /></div>
                              <div className="space-y-2"><Label className="text-[13px] font-bold text-slate-700">Full Name</Label><Input value={formFullName} onChange={(e) => setFormFullName(e.target.value)} placeholder="Jane Doe" className="h-12 border-slate-200" /></div>
                            </div>
                            <div className="space-y-2"><Label className="text-[13px] font-bold text-slate-700">Email Address</Label><Input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="email@brand.com" className="h-12 border-slate-200" /></div>
                            {!editingUser && (
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-[13px] font-bold text-slate-700">Password</Label>
                                  <div className="relative">
                                    <Input type={showPassword ? "text" : "password"} value={formPassword} onChange={(e) => setFormPassword(e.target.value)} className="h-12 border-slate-200 pr-10" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-[13px] font-bold text-slate-700">Confirm</Label>
                                  <div className="relative">
                                    <Input type={showConfirmPassword ? "text" : "password"} value={formConfirmPassword} onChange={(e) => setFormConfirmPassword(e.target.value)} className="h-12 border-slate-200 pr-10" />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-10 border-l border-dashed border-slate-200 pl-16">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-8 w-8 rounded-xl bg-[#1a73e8]/10 flex items-center justify-center"><ShieldCheck className="h-4 w-4 text-[#1a73e8]" /></div>
                              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Role Assignment</h3>
                            </div>
                            <p className="text-sm text-slate-400 font-medium">Map staff to locations.</p>
                          </div>

                          {!formTenantId ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 p-8">
                              <Building2 className="h-8 w-8 text-slate-200 mb-6" />
                              <h4 className="font-extrabold text-[#1e293b] text-lg">Parent Tenant Required</h4>
                              <p className="text-xs text-slate-400 mt-2 max-w-[280px]">Select an organization in Step 1 to unlock location mapping.</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <Table>
                                <TableHeader><TableRow className="border-none"><TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest h-10">Outlet</TableHead><TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest h-10">Role</TableHead><TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest h-10 text-right">Action</TableHead></TableRow></TableHeader>
                                <TableBody>
                                  {assignments.map((assignment) => (
                                    <TableRow key={assignment.id} className="border-none">
                                      <TableCell className="p-1 pb-4 pr-4">
                                        <Select value={assignment.outletId} onValueChange={(val) => setAssignments(assignments.map(a => a.id === assignment.id ? { ...a, outletId: val } : a))}>
                                          <SelectTrigger className="h-12 border-slate-200 font-bold"><SelectValue placeholder="Select Location" /></SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="all" className="font-bold text-primary">Global Access</SelectItem>
                                            {tenantOutlets.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
                                          </SelectContent>
                                        </Select>
                                      </TableCell>
                                      <TableCell className="p-1 pb-4">
                                        <Select value={assignment.role} onValueChange={(val) => setAssignments(assignments.map(a => a.id === assignment.id ? { ...a, role: val } : a))}>
                                          <SelectTrigger className="h-12 border-slate-200 font-bold"><SelectValue placeholder="Assign Role" /></SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Staff">Staff</SelectItem>
                                            <SelectItem value="Manager">Manager</SelectItem>
                                            <SelectItem value="Organization Admin">Organization Admin</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </TableCell>
                                      <TableCell className="p-1 pb-4 text-right"><button className="h-12 w-12 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-colors" onClick={() => setAssignments(assignments.filter(a => a.id !== assignment.id))}><Trash2 className="h-5 w-5" /></button></TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                              <Button variant="outline" className="w-full h-14 border-2 border-dashed border-primary/20 text-primary font-black transition-all rounded-2xl" onClick={() => setAssignments([...assignments, { id: Date.now().toString(), outletId: "all", role: "Staff" }])}><PlusCircle className="h-5 w-5 mr-3" /> Add Assignment</Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                  <div className="p-8 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/30 flex-shrink-0">
                    <Button variant="outline" className="h-12 px-8 font-black text-slate-500 border-slate-200" onClick={() => { setIsAddingNew(false); setEditingUser(null); restoreInteractivity(); }}>Cancel</Button>
                    <Button className="h-12 px-10 font-black bg-[#1a73e8] hover:bg-[#1557b0] text-white border-none shadow-lg shadow-[#1a73e8]/20 active:scale-95 transition-all" onClick={handleSaveUser}>{editingUser ? "Save Profile Changes" : "Finalize Staff Enrollment"}</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialogs moved outside Sheet structure to prevent focus conflicts */}
      <AlertDialog open={!!confirmSuspend} onOpenChange={(o) => { if (!o) { setConfirmSuspend(null); restoreInteractivity(); } }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Suspend Access?</AlertDialogTitle><AlertDialogDescription>Revoke access for <strong>{confirmSuspend?.fullName}</strong>?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel onClick={restoreInteractivity}>Cancel</AlertDialogCancel><AlertDialogAction className="bg-rose-500" onClick={() => confirmSuspend && handleSuspendUser(confirmSuspend)}>Confirm Suspension</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!confirmReactivate} onOpenChange={(o) => { if (!o) { setConfirmReactivate(null); restoreInteractivity(); } }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Reactivate Access?</AlertDialogTitle><AlertDialogDescription>Restore access for <strong>{confirmReactivate?.fullName}</strong>?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel onClick={restoreInteractivity}>Cancel</AlertDialogCancel><AlertDialogAction className="bg-green-600" onClick={() => confirmReactivate && handleReactivateUser(confirmReactivate)}>Confirm</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!confirmReset} onOpenChange={(o) => { if (!o) { setConfirmReset(null); restoreInteractivity(); } }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Reset Password?</AlertDialogTitle><AlertDialogDescription>Send link to <strong>{confirmReset?.email}</strong>?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel onClick={restoreInteractivity}>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => confirmReset && handleResetPassword(confirmReset)}>Send Link</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
