
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

interface UserAssignment {
  id: string;
  outletId: string;
  role: string;
}

interface UserManagementProps {
  tenant?: Tenant | null;
  editingUser?: User | null;
  allUsers: User[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
  allTenants: Tenant[];
  allOutlets: Outlet[];
  isOpen: boolean;
  defaultAdding?: boolean;
  onClose: () => void;
}

export function UserManagement({ tenant, editingUser: propEditingUser, allUsers, setAllUsers, allTenants, allOutlets, isOpen, defaultAdding = false, onClose }: UserManagementProps) {
  const { toast } = useToast()
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
  const [confirmDelete, setConfirmDelete] = React.useState<User | null>(null)

  const [formFullName, setFormFullName] = React.useState("")
  const [formUsername, setFormUsername] = React.useState("")
  const [formEmail, setFormEmail] = React.useState("")
  const [formPhone, setFormPhone] = React.useState("")
  const [formPrimaryRole, setFormPrimaryRole] = React.useState<string>("Staff")
  const [formTenantId, setFormTenantId] = React.useState("")
  const [formPassword, setFormPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [assignments, setAssignments] = React.useState<UserAssignment[]>([])

  const getTenantName = (tid: string) => allTenants.find(t => t.id === tid)?.tenantName || "Unknown"
  const getOutletName = (oid: string) => allOutlets.find(o => o.id === oid)?.name || "Unknown"

  const restoreInteractivity = React.useCallback(() => {
    setTimeout(() => {
      document.body.style.pointerEvents = 'auto';
      document.body.style.overflow = 'auto';
    }, 300);
  }, []);

  const resetForm = React.useCallback(() => {
    setFormFullName("")
    setFormUsername("")
    setFormEmail("")
    setFormPhone("")
    setFormPrimaryRole('Staff')
    setFormTenantId(tenant?.id || "")
    setFormPassword("")
    setShowPassword(false)
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
        setAssignments(propEditingUser.outletId ? [{ id: '1', outletId: propEditingUser.outletId, role: propEditingUser.role }] : [])
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

  const ITEMS_PER_PAGE = 10
  const tenantOutlets = React.useMemo(() => {
    const activeTid = formTenantId || tenant?.id
    return allOutlets.filter(o => !activeTid || o.tenantId === activeTid)
  }, [formTenantId, tenant, allOutlets])

  const filteredUsers = React.useMemo(() => {
    return allUsers.filter(u => {
      const matchesTenant = tenant ? u.tenantId === tenant.id : (!tenantFilter || u.tenantId === tenantFilter)
      const matchesUser = !userFilter || u.fullName.toLowerCase().includes(userFilter.toLowerCase()) || u.email.toLowerCase().includes(userFilter.toLowerCase())
      const matchesStatus = !statusFilter || u.status === statusFilter
      const matchesRole = !roleFilter || u.role === roleFilter
      const matchesOutlet = !outletFilter || u.outletId === outletFilter
      return matchesTenant && matchesUser && matchesStatus && matchesRole && matchesOutlet
    })
  }, [allUsers, tenant, tenantFilter, userFilter, statusFilter, roleFilter, outletFilter])

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
    setAssignments(user.outletId ? [{ id: '1', outletId: user.outletId, role: user.role }] : [])
    setTimeout(() => setIsFormLoading(false), 500)
  }

  const handleSaveUser = () => {
    if (!formFullName || !formUsername || !formEmail || !formTenantId) {
      toast({ title: "Validation Error", description: "Required fields missing.", variant: "destructive" })
      return
    }
    const firstA = assignments[0];
    if (editingUser) {
      setAllUsers(prev => prev.map(u => u.id === editingUser.id ? {
        ...u,
        fullName: formFullName,
        username: formUsername,
        email: formEmail,
        phone: formPhone,
        role: (firstA?.role || formPrimaryRole) as any,
        tenantId: formTenantId,
        outletId: (!firstA || firstA.outletId === "all") ? undefined : firstA.outletId
      } : u))
      toast({ title: "Profile Updated" })
    } else {
      const newUser: User = {
        id: `u-${Math.random().toString(36).substr(2, 9)}`,
        fullName: formFullName,
        username: formUsername,
        email: formEmail,
        phone: formPhone,
        role: (firstA?.role || formPrimaryRole) as any,
        tenantId: formTenantId,
        outletId: (!firstA || firstA.outletId === "all") ? undefined : firstA.outletId,
        status: 'Active',
        lastActive: 'Just now'
      }
      setAllUsers(prev => [newUser, ...prev])
      toast({ title: "Staff Enrolled" })
    }
    setIsAddingNew(false)
    setEditingUser(null)
  }

  const handleSuspendUser = (u: User) => {
    setAllUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, status: 'Suspended' } : usr))
    toast({ title: "Suspended" })
    setConfirmSuspend(null)
    restoreInteractivity()
  }

  const handleReactivateUser = (u: User) => {
    setAllUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, status: 'Active' } : usr))
    toast({ title: "Reactivated" })
    setConfirmReactivate(null)
    restoreInteractivity()
  }

  const handleResetPassword = (u: User) => {
    toast({ title: "Reset link sent" })
    setConfirmReset(null)
    restoreInteractivity()
  }

  const handleDeleteUser = (u: User) => {
    setAllUsers(prev => prev.filter(usr => usr.id !== u.id))
    toast({ title: "Deleted" })
    setConfirmDelete(null)
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
                    <span className="opacity-80"><Building2 className="h-3 w-3 inline mr-1" /> TENANTS</span>
                    <ChevronRight className="h-2.5 w-2.5 opacity-30" />
                    <span className="text-[#1a73e8] font-black">{tenant?.tenantName.toUpperCase() || "STAFF LIST"}</span>
                  </div>
                  <SheetTitle className="text-2xl font-black text-[#1e293b] tracking-tight">{isAddingNew ? (editingUser ? `Edit ${editingUser.fullName}` : "New Enrollment") : "Platform Staff"}</SheetTitle>
                </div>
              </div>
              {!isAddingNew && <Button onClick={() => { setIsFormLoading(true); setIsAddingNew(true); resetForm(); setTimeout(() => setIsFormLoading(false), 400); }} className="h-10 px-6 font-black bg-[#1a73e8]"><Plus className="h-4 w-4 mr-2" /> Enroll Staff</Button>}
            </div>
          </SheetHeader>

          {!isAddingNew ? (
            <div className="flex-1 flex flex-col p-6 min-h-0 overflow-hidden">
               <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-2.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Search Staff</Label>
                      <Input placeholder="Name or email..." className="h-11 text-sm bg-white" value={userFilter} onChange={(e) => setUserFilter(e.target.value)} />
                    </div>
                    <div className="space-y-2.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</Label>
                      <Select onValueChange={(v) => setRoleFilter(v === 'all' ? null : v)} value={roleFilter || 'all'}><SelectTrigger className="h-11"><SelectValue placeholder="Roles" /></SelectTrigger>
                        <SelectContent><SelectItem value="all">All Roles</SelectItem><SelectItem value="Manager">Manager</SelectItem><SelectItem value="Organization Admin">Organization Admin</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</Label>
                      <Select onValueChange={(v) => setStatusFilter(v === 'all' ? null : v)} value={statusFilter || 'all'}><SelectTrigger className="h-11"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="Active">Active</SelectItem><SelectItem value="Suspended">Suspended</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <Button variant="ghost" className="h-11 font-bold text-slate-400" onClick={() => { setUserFilter(""); setRoleFilter(null); setStatusFilter(null); }}><FilterX className="h-4 w-4 mr-2" /> Reset</Button>
                  </div>
               </div>
               <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <ScrollArea className="flex-1">
                    <Table>
                      <TableHeader className="bg-slate-50/50"><TableRow className="h-12 uppercase text-[10px] font-bold text-slate-400"><TableHead className="px-8">User</TableHead><TableHead>Role</TableHead><TableHead className="text-center">Status</TableHead><TableHead className="text-right px-8">Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {paginatedUsers.map(u => (
                          <TableRow key={u.id} className="cursor-pointer group hover:bg-slate-50/50" onClick={() => handleEditUser(u)}>
                            <TableCell className="py-5 px-8"><div className="font-extrabold text-[#1e293b]">{u.fullName}</div><div className="text-[11px] text-slate-400 font-bold">@{u.username}</div></TableCell>
                            <TableCell><Badge className="bg-slate-100 text-slate-600 border-none font-bold text-[10px] uppercase">{u.role}</Badge></TableCell>
                            <TableCell className="text-center"><Badge className={cn("rounded-full px-4 py-1 text-[10px] font-bold uppercase", u.status === 'Active' ? "bg-green-100 text-green-600" : "bg-rose-100 text-rose-500")}>{u.status}</Badge></TableCell>
                            <TableCell className="text-right px-8">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="text-slate-400" onClick={e => e.stopPropagation()}><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 p-2">
                                  <DropdownMenuItem className="font-bold py-2.5" onClick={e => { e.stopPropagation(); handleEditUser(u); }}><Edit2 className="h-4 w-4 mr-3" /> Edit</DropdownMenuItem>
                                  <DropdownMenuItem className="font-bold py-2.5" onClick={e => { e.stopPropagation(); setConfirmReset(u); }}><RotateCcw className="h-4 w-4 mr-3" /> Reset Password</DropdownMenuItem>
                                  {u.status === 'Suspended' ? <DropdownMenuItem className="text-green-600 font-bold py-2.5" onClick={e => { e.stopPropagation(); setConfirmReactivate(u); }}><PlayCircle className="h-4 w-4 mr-3" /> Reactivate</DropdownMenuItem> : <DropdownMenuItem className="text-rose-500 font-bold py-2.5" onClick={e => { e.stopPropagation(); setConfirmSuspend(u); }}><PauseCircle className="h-4 w-4 mr-3" /> Suspend</DropdownMenuItem>}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive font-black py-2.5" onClick={e => { e.stopPropagation(); setConfirmDelete(u); }}><Trash2 className="h-4 w-4 mr-3" /> Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
               </div>
            </div>
          ) : (
            <div className="flex-1 p-8 flex flex-col overflow-hidden">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl flex-1 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1">
                  {isFormLoading ? <div className="flex items-center justify-center py-40 animate-pulse"><Loader2 className="animate-spin text-primary" /></div> : (
                    <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
                      <div className="space-y-10">
                        <div><h3 className="text-2xl font-black">Step 1: Identity</h3><p className="text-sm text-slate-400">Fundamental staff member profile.</p></div>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label className="text-[13px] font-bold text-slate-700">Select Parent Organization <span className="text-red-500">*</span></Label>
                            <Popover modal={true} open={isFormTenantPopoverOpen} onOpenChange={setIsFormTenantPopoverOpen}>
                              <PopoverTrigger asChild><Button variant="outline" className="w-full h-12 justify-between bg-primary/5 text-primary font-black"><span className="truncate">{formTenantId ? getTenantName(formTenantId) : "Select Tenant..."}</span><ChevronsUpDown className="h-4 w-4 opacity-50" /></Button></PopoverTrigger>
                              <PopoverContent className="w-80 p-0 shadow-2xl z-[110]" onPointerDownOutside={e => e.preventDefault()} onInteractOutside={e => e.preventDefault()}>
                                <div className="p-2 border-b"><Input autoFocus placeholder="Search brands..." value={formTenantSearch} onChange={e => setFormTenantSearch(e.target.value)} /></div>
                                <ScrollArea className="h-64"><div className="p-1 space-y-0.5">
                                  {allTenants.filter(t => t.tenantName.toLowerCase().includes(formTenantSearch.toLowerCase())).map(t => (
                                    <button key={t.id} type="button" className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm hover:bg-slate-100", formTenantId === t.id && "bg-primary/5 text-primary font-bold")} onClick={() => { setFormTenantId(t.id); setFormTenantSearch(""); setIsFormTenantPopoverOpen(false); }}>
                                      <span>{t.tenantName}</span><span className="text-[10px] font-bold text-slate-400">{t.numberOfOutlets} Outlets</span>
                                    </button>
                                  ))}
                                </div></ScrollArea>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Full Name</Label><Input value={formFullName} onChange={e => setFormFullName(e.target.value)} placeholder="Jane Doe" className="h-12" /></div>
                            <div className="space-y-2"><Label>Username</Label><Input value={formUsername} onChange={e => setFormUsername(e.target.value)} placeholder="jdoe" className="h-12" /></div>
                          </div>
                          <div className="space-y-2"><Label>Email</Label><Input value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="email@brand.com" className="h-12" /></div>
                        </div>
                      </div>
                      <div className="space-y-10 border-l border-dashed pl-16">
                        <div><h3 className="text-2xl font-black">Step 2: Role & Mapping</h3><p className="text-sm text-slate-400">Control staff scope and permissions.</p></div>
                        {!formTenantId ? <div className="py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed"><Building2 className="mx-auto h-8 w-8 text-slate-300 mb-4" /><p className="text-sm font-bold text-slate-400">Select an organization first</p></div> : (
                          <div className="space-y-6">
                            {assignments.map(a => (
                              <div key={a.id} className="flex gap-4 items-end">
                                <div className="flex-1 space-y-1.5"><Label className="text-[10px] uppercase font-bold text-slate-400">Outlet</Label>
                                  <Select value={a.outletId} onValueChange={v => setAssignments(assignments.map(as => as.id === a.id ? { ...as, outletId: v } : as))}><SelectTrigger className="h-12 font-bold"><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="all" className="font-bold text-primary">Global Access</SelectItem>{tenantOutlets.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent>
                                  </Select>
                                </div>
                                <div className="flex-1 space-y-1.5"><Label className="text-[10px] uppercase font-bold text-slate-400">Role</Label>
                                  <Select value={a.role} onValueChange={v => setAssignments(assignments.map(as => as.id === a.id ? { ...as, role: v } : as))}><SelectTrigger className="h-12 font-bold"><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="Staff">Staff</SelectItem><SelectItem value="Manager">Manager</SelectItem><SelectItem value="Organization Admin">Organization Admin</SelectItem></SelectContent>
                                  </Select>
                                </div>
                                <Button variant="ghost" size="icon" className="h-12 w-12 text-rose-500 bg-rose-50" onClick={() => setAssignments(assignments.filter(as => as.id !== a.id))}><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            ))}
                            <Button variant="outline" className="w-full h-14 border-2 border-dashed border-primary/20 text-primary font-black rounded-2xl" onClick={() => setAssignments([...assignments, { id: Date.now().toString(), outletId: "all", role: "Staff" }])}><PlusCircle className="h-5 w-5 mr-3" /> Add Assignment</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </ScrollArea>
                <div className="p-8 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/30">
                  <Button variant="outline" className="h-12 px-8 font-black" onClick={() => { setIsAddingNew(false); setEditingUser(null); restoreInteractivity(); }}>Cancel</Button>
                  <Button className="h-12 px-10 font-black bg-[#1a73e8]" onClick={handleSaveUser}>{editingUser ? "Update Profile" : "Finalize Enrollment"}</Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!confirmSuspend} onOpenChange={o => { if (!o) { setConfirmSuspend(null); restoreInteractivity(); } }}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Suspend Access?</AlertDialogTitle><AlertDialogDescription>Revoke access for <strong>{confirmSuspend?.fullName}</strong>?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel onClick={restoreInteractivity}>Cancel</AlertDialogCancel><AlertDialogAction className="bg-rose-500" onClick={() => confirmSuspend && handleSuspendUser(confirmSuspend)}>Confirm Suspension</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!confirmReactivate} onOpenChange={o => { if (!o) { setConfirmReactivate(null); restoreInteractivity(); } }}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Reactivate Access?</AlertDialogTitle><AlertDialogDescription>Restore platform access for <strong>{confirmReactivate?.fullName}</strong>?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel onClick={restoreInteractivity}>Cancel</AlertDialogCancel><AlertDialogAction className="bg-green-600" onClick={() => confirmReactivate && handleReactivateUser(confirmReactivate)}>Reactivate</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!confirmReset} onOpenChange={o => { if (!o) { setConfirmReset(null); restoreInteractivity(); } }}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Send Reset Link?</AlertDialogTitle><AlertDialogDescription>Send credentials reset to <strong>{confirmReset?.email}</strong>?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel onClick={restoreInteractivity}>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => confirmReset && handleResetPassword(confirmReset)}>Send Reset Link</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!confirmDelete} onOpenChange={o => { if (!o) { setConfirmDelete(null); restoreInteractivity(); } }}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Permanently?</AlertDialogTitle><AlertDialogDescription>Remove <strong>{confirmDelete?.fullName}</strong>? This action cannot be reversed.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel onClick={restoreInteractivity}>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive" onClick={() => confirmDelete && handleDeleteUser(confirmDelete)}>Delete Staff Member</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
