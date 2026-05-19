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
import { User, Organization, Outlet } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const ITEMS_PER_PAGE = 10

interface UserListViewProps {
  allUsers: User[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
  allOrganizations: Organization[];
  allOutlets: Outlet[];
  onAddUser: () => void;
  onEditUser: (user: User) => void;
}

export function UserListView({ allUsers, setAllUsers, allOrganizations, allOutlets, onAddUser, onEditUser }: UserListViewProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [organizationFilter, setOrganizationFilter] = React.useState<string | null>(null)
  const [outletFilter, setOutletFilter] = React.useState<string | null>(null)
  const [roleFilter, setRoleFilter] = React.useState<string | null>(null)
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  
  const [organizationSearch, setOrganizationSearch] = React.useState("")
  const [isOrganizationPopoverOpen, setIsOrganizationPopoverOpen] = React.useState(false)

  const [outletSearch, setOutletSearch] = React.useState("")
  const [isOutletPopoverOpen, setIsOutletPopoverOpen] = React.useState(false)

  // Dialog states
  const [confirmSuspend, setConfirmSuspend] = React.useState<User | null>(null)
  const [confirmReset, setConfirmReset] = React.useState<User | null>(null)
  const [confirmReactivate, setConfirmReactivate] = React.useState<User | null>(null)
  const [confirmDelete, setConfirmDelete] = React.useState<User | null>(null)

  const organizationsForDropdown = React.useMemo(() => {
    return allOrganizations.filter(org => 
      org.organizationName.toLowerCase().includes(organizationSearch.toLowerCase())
    )
  }, [allOrganizations, organizationSearch])

  const outletsWithCounts = React.useMemo(() => {
    // If organization filter is active, only show outlets for that org
    const baseOutlets = organizationFilter 
      ? allOutlets.filter(o => o.organizationId === organizationFilter)
      : allOutlets;

    return baseOutlets.map(outlet => {
      const org = allOrganizations.find(o => o.id === outlet.organizationId);
      const orgName = org?.organizationName || "Unknown";
      
      // Extract branch name from "Brand - Branch" format to avoid repetition in filter label
      let branchName = outlet.name;
      if (branchName.startsWith(orgName)) {
        branchName = branchName.substring(orgName.length).replace(/^[-\s]+/, '');
      }

      return {
        ...outlet,
        orgName,
        branchName,
        staffCount: allUsers.filter(u => u.outletId === outlet.id).length
      };
    }).filter(outlet => outlet.staffCount > 0);
  }, [allUsers, allOutlets, organizationFilter, allOrganizations])

  const filteredOutletsForDropdown = React.useMemo(() => {
    return outletsWithCounts.filter(outlet => 
      outlet.name.toLowerCase().includes(outletSearch.toLowerCase()) ||
      outlet.orgName.toLowerCase().includes(outletSearch.toLowerCase())
    )
  }, [outletsWithCounts, outletSearch])

  const filteredUsers = React.useMemo(() => {
    return allUsers.filter(user => {
      const matchesSearch = 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesOrganization = !organizationFilter || user.organizationId === organizationFilter
      const matchesOutlet = !outletFilter || user.outletId === outletFilter
      const matchesRole = !roleFilter || user.role === roleFilter
      const matchesStatus = !statusFilter || user.status === statusFilter
      
      return matchesSearch && matchesOrganization && matchesOutlet && matchesRole && matchesStatus
    })
  }, [allUsers, searchQuery, organizationFilter, outletFilter, roleFilter, statusFilter])

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const paginatedUsers = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredUsers, currentPage])

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, organizationFilter, outletFilter, roleFilter, statusFilter])

  const getOrganizationName = (organizationId: string) => {
    return allOrganizations.find(org => org.id === organizationId)?.organizationName || "Unknown"
  }

  const getOutletLabelForButton = (outletId: string) => {
    const o = allOutlets.find(out => out.id === outletId)
    if (!o) return "Unknown"
    const org = allOrganizations.find(org => org.id === o.organizationId)
    const orgName = org?.organizationName || "Unknown";
    let branch = o.name;
    if (branch.startsWith(orgName)) {
      branch = branch.substring(orgName.length).replace(/^[-\s]+/, '');
    }
    return `${orgName}-${branch}`
  }

  const resetFilters = () => {
    setSearchQuery("")
    setOrganizationFilter(null)
    setOutletFilter(null)
    setRoleFilter(null)
    setStatusFilter(null)
    setOrganizationSearch("")
    setOutletSearch("")
  }

  const handleSuspendUser = (user: User) => {
    setAllUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'Suspended' } : u))
    toast({ title: "User Suspended", description: `${user.fullName}'s access has been revoked.` })
    setConfirmSuspend(null)
  }

  const handleReactivateUser = (user: User) => {
    setAllUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'Active' } : u))
    toast({ title: "User Reactivated", description: `${user.fullName}'s access has been restored.` })
    setConfirmReactivate(null)
  }

  const handleResetPassword = (user: User) => {
    toast({ title: "Reset Link Sent", description: `A recovery email has been sent to ${user.email}.` })
    setConfirmReset(null)
  }

  const handleDeleteUser = (user: User) => {
    setAllUsers(prev => prev.filter(u => u.id !== user.id))
    toast({ title: "User Deleted", description: "Record has been permanently removed." })
    setConfirmDelete(null)
  }

  return (
    <div className="p-6 md:p-8 flex flex-col h-full overflow-hidden bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
            <p className="text-sm text-slate-500 mt-1">Review and manage access for organization administrators and outlet staff.</p>
          </div>
          <Button size="sm" className="h-10 px-6 font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" onClick={onAddUser}>
            <Plus className="h-4 w-4 mr-2" /> Add New User
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
            <div className="md:col-span-2 space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Search Staff</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input placeholder="Name, @username or email..." className="pl-9 h-11 text-sm bg-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Organization</label>
              <Popover open={isOrganizationPopoverOpen} onOpenChange={setIsOrganizationPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-11 justify-between bg-white px-3 text-sm font-medium">
                    <span className="truncate">{organizationFilter ? getOrganizationName(organizationFilter) : "All Organizations"}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[480px] p-0 shadow-2xl" align="start">
                  <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 opacity-50" />
                    <Input className="flex h-11 w-full border-none shadow-none focus-visible:ring-0 bg-transparent" placeholder="Search brands..." value={organizationSearch} onChange={(e) => setOrganizationSearch(e.target.value)} />
                  </div>
                  <ScrollArea className="h-72">
                    <div className="p-1">
                      <Button variant="ghost" className="w-full justify-start h-10" onClick={() => { setOrganizationFilter(null); setOutletFilter(null); setIsOrganizationPopoverOpen(false); }}>All Organizations</Button>
                      {organizationsForDropdown.map((org) => (
                        <Button key={org.id} variant="ghost" className="w-full justify-start h-10" onClick={() => { setOrganizationFilter(org.id); setOutletFilter(null); setIsOrganizationPopoverOpen(false); }}>
                          <span className="truncate flex-1 text-left">{org.organizationName}</span>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Outlet</label>
              <Popover open={isOutletPopoverOpen} onOpenChange={setIsOutletPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-11 justify-between bg-white px-3 text-sm font-medium">
                    <span className="truncate">{outletFilter ? getOutletLabelForButton(outletFilter) : "All Outlets"}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[480px] p-0 shadow-2xl" align="start">
                  <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 opacity-50" />
                    <Input className="flex h-11 w-full border-none shadow-none focus-visible:ring-0 bg-transparent" placeholder="Search outlets..." value={outletSearch} onChange={(e) => setOutletSearch(e.target.value)} />
                  </div>
                  <ScrollArea className="h-72">
                    <div className="p-1">
                      <Button variant="ghost" className="w-full justify-start h-10" onClick={() => { setOutletFilter(null); setIsOutletPopoverOpen(false); }}>All Outlets</Button>
                      {filteredOutletsForDropdown.map((outlet) => (
                        <Button key={outlet.id} variant="ghost" className="w-full justify-start h-auto py-2.5 px-3 group" onClick={() => { setOutletFilter(outlet.id); setIsOutletPopoverOpen(false); }}>
                          <div className="flex flex-col items-start min-w-0 flex-1">
                            <span className="font-bold text-slate-900 leading-tight">
                              {outlet.orgName}-{outlet.branchName}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                              {outlet.city}, {outlet.country}
                            </span>
                          </div>
                          <span className="ml-4 text-[10px] font-black text-primary bg-primary/5 px-2 py-1 rounded-full group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                            {outlet.staffCount} STAFFS
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
                <SelectTrigger className="h-11 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Organization Admin">Org Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Partner Admin">Partner Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Status</label>
              <Select onValueChange={(v) => setStatusFilter(v === 'all' ? null : v)} value={statusFilter || 'all'}>
                <SelectTrigger className="h-11 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="ghost" className="h-11 text-slate-400 font-bold gap-2" onClick={resetFilters}>
              <FilterX className="h-4 w-4" /> Reset
            </Button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-0 overflow-hidden">
          <ScrollArea className="flex-1">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-8 uppercase tracking-widest">Username</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest">Contact</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest">Role & Assignment</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest text-center">Status</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-8 text-right uppercase tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="group hover:bg-slate-50/50 border-b border-slate-50">
                    <TableCell className="py-5 px-8">
                      <div className="font-extrabold text-[#1e293b] group-hover:text-primary transition-colors">{user.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-bold">@{user.username}</div>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="text-xs font-bold text-slate-700 truncate max-w-[200px]"><Mail className="h-3 w-3 inline mr-1 opacity-40" />{user.email}</div>
                      <div className="text-[11px] text-slate-400"><Phone className="h-3 w-3 inline mr-1 opacity-40" />{user.phone}</div>
                    </TableCell>
                    <TableCell className="px-4">
                      <Badge className="bg-slate-100 text-slate-600 border-none px-2 py-0.5 text-[10px] font-bold uppercase rounded-md mb-1">{user.role}</Badge>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase"><Building2 className="h-3 w-3" /> {getOrganizationName(user.organizationId)}</div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase mt-0.5"><Store className="h-3 w-3" /> {user.outletId ? allOutlets.find(o => o.id === user.outletId)?.name : "Global Access"}</div>
                    </TableCell>
                    <TableCell className="px-4 text-center">
                      <Badge className={cn("rounded-full px-4 py-1 text-[10px] font-bold uppercase", user.status === 'Active' ? "bg-[#e1f9ef] text-[#22c55e]" : "bg-rose-100 text-rose-500")}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="text-slate-400"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-2">
                          <DropdownMenuItem className="font-bold py-2.5" onClick={() => onEditUser(user)}><Edit2 className="h-4 w-4 mr-3 text-slate-400" /> Edit Profile</DropdownMenuItem>
                          <DropdownMenuItem className="font-bold py-2.5" onClick={() => setConfirmReset(user)}><RotateCcw className="h-4 w-4 mr-3 text-slate-400" /> Reset Password</DropdownMenuItem>
                          {user.status === 'Suspended' ? (
                            <DropdownMenuItem className="font-bold py-2.5 text-green-600" onClick={() => setConfirmReactivate(user)}><PlayCircle className="h-4 w-4 mr-3" /> Reactivate</DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="font-bold py-2.5 text-rose-500" onClick={() => setConfirmSuspend(user)}><PauseCircle className="h-4 w-4 mr-3" /> Suspend</DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator className="my-1" />
                          <DropdownMenuItem className="text-destructive font-black py-2.5" onClick={() => setConfirmDelete(user)}><Trash2 className="h-4 w-4 mr-3" /> Delete</DropdownMenuItem>
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
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                Showing <span className="text-primary">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-primary">{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}</span> of <span className="text-primary">{filteredUsers.length}</span> results
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
                      className={cn("h-8 w-8 p-0 text-[11px] font-black border-slate-200", currentPage === pageNum ? "bg-primary border-primary text-white" : "text-slate-500")}
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

      <AlertDialog open={!!confirmSuspend} onOpenChange={(o) => { if (!o) setConfirmSuspend(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Suspend Staff Access?</AlertDialogTitle><AlertDialogDescription>Revoke access for <strong>{confirmSuspend?.fullName}</strong>?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-rose-500" onClick={() => confirmSuspend && handleSuspendUser(confirmSuspend)}>Suspend Access</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!confirmReactivate} onOpenChange={(o) => { if (!o) setConfirmReactivate(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Reactivate Access?</AlertDialogTitle><AlertDialogDescription>Restore platform access for <strong>{confirmReactivate?.fullName}</strong>?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-green-600" onClick={() => confirmReactivate && handleReactivateUser(confirmReactivate)}>Reactivate</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!confirmReset} onOpenChange={(o) => { if (!o) setConfirmReset(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Reset Password?</AlertDialogTitle><AlertDialogDescription>Send a reset link to <strong>{confirmReset?.email}</strong>?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => confirmReset && handleResetPassword(confirmReset)}>Send Link</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => { if (!o) setConfirmDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete User?</AlertDialogTitle><AlertDialogDescription>Permanently remove <strong>{confirmDelete?.fullName}</strong>? This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive" onClick={() => confirmDelete && handleDeleteUser(confirmDelete)}>Delete Permanently</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
