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
  ArrowLeft,
  FilterX,
  Users as UsersIcon,
  Edit2,
  Trash2,
  Loader2,
  ChevronLeft,
  Check,
  ChevronRight as ChevronRightIcon
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const ITEMS_PER_PAGE = 10

const COUNTRY_CITY_MAP: Record<string, string[]> = {
  "UAE": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"],
  "USA": ["New York", "San Francisco", "Los Angeles", "Chicago", "Miami"],
  "UK": ["London", "Manchester", "Birmingham", "Leeds", "Glasgow"]
}

interface OutletManagementProps {
  tenant?: Tenant | null;
  allOutlets: Outlet[];
  setAllOutlets: React.Dispatch<React.SetStateAction<Outlet[]>>;
  allTenants: Tenant[];
  isOpen: boolean;
  onClose: () => void;
  onViewUsers: (outlet: Outlet) => void;
}

export function OutletManagement({ tenant, allOutlets, setAllOutlets, allTenants, isOpen, onClose, onViewUsers }: OutletManagementProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  
  const [isAddingNew, setIsAddingNew] = React.useState(false)
  const [editingOutlet, setEditingOutlet] = React.useState<Outlet | null>(null)
  const [isFormLoading, setIsFormLoading] = React.useState(false)

  const [isFormTenantPopoverOpen, setIsFormTenantPopoverOpen] = React.useState(false)
  const [formTenantSearch, setFormTenantSearch] = React.useState("")

  const [formTenantId, setFormTenantId] = React.useState("")
  const [formName, setFormName] = React.useState("")
  const [formSlug, setFormSlug] = React.useState("")
  const [formPhone, setFormPhone] = React.useState("")
  const [formTimezone, setFormTimezone] = React.useState("Asia/Dubai")
  const [formCity, setFormCity] = React.useState("")
  const [formCountry, setFormCountry] = React.useState("")

  // Global Interactivity Safeguard
  React.useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = 'auto';
        document.body.style.overflow = 'auto';
        document.documentElement.style.pointerEvents = 'auto';
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      if (editingOutlet) {
        setFormTenantId(editingOutlet.tenantId)
        setFormName(editingOutlet.name)
        setFormSlug(editingOutlet.slug)
        setFormPhone(editingOutlet.phone)
        setFormTimezone(editingOutlet.timezone)
        setFormCity(editingOutlet.city)
        setFormCountry(editingOutlet.country)
      } else {
        setFormTenantId(tenant?.id || "")
        setFormName("")
        setFormSlug("")
        setFormPhone("")
        setFormTimezone("Asia/Dubai")
        setFormCity("")
        setFormCountry("")
      }
    }
  }, [editingOutlet, tenant, isOpen])

  const filteredOutlets = React.useMemo(() => {
    return allOutlets.filter(o => {
      const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            o.city.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = !statusFilter || o.status === statusFilter
      const matchesTenant = !tenant || o.tenantId === tenant.id
      return matchesSearch && matchesStatus && matchesTenant
    })
  }, [allOutlets, searchQuery, statusFilter, tenant])

  const paginatedOutlets = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredOutlets.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredOutlets, currentPage])

  const totalPages = Math.ceil(filteredOutlets.length / ITEMS_PER_PAGE)

  const handleSaveOutlet = () => {
    if (!formTenantId || !formName) {
      toast({ title: "Validation Error", description: "Brand identity and outlet name are required.", variant: "destructive" })
      return
    }

    if (editingOutlet) {
      setAllOutlets(prev => prev.map(o => o.id === editingOutlet.id ? {
        ...o,
        tenantId: formTenantId,
        name: formName,
        slug: formSlug || formName.toLowerCase().replace(/\s+/g, '-'),
        phone: formPhone,
        timezone: formTimezone,
        city: formCity,
        country: formCountry
      } : o))
      toast({ title: "Outlet Updated", description: `${formName} configuration has been saved.` })
    } else {
      const newOutlet: Outlet = {
        id: `o-${Math.random().toString(36).substr(2, 9)}`,
        tenantId: formTenantId,
        name: formName,
        slug: formSlug || formName.toLowerCase().replace(/\s+/g, '-'),
        phone: formPhone,
        timezone: formTimezone,
        city: formCity,
        country: formCountry,
        status: 'Active',
        userCount: 0
      }
      setAllOutlets(prev => [newOutlet, ...prev])
      toast({ title: "New Outlet Registered", description: `${formName} is now part of the network.` })
    }
    setIsAddingNew(false)
    setEditingOutlet(null)
  }

  const getTenantName = (tid: string) => allTenants.find(t => t.id === tid)?.tenantName || "Unknown"

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-[1200px] p-0 border-l border-slate-200 bg-[#f8f9fc] flex flex-col transition-all duration-500">
        <SheetHeader className="px-8 py-6 bg-white border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button 
                onClick={isAddingNew ? () => { setIsAddingNew(false); setEditingOutlet(null); } : onClose} 
                className="p-2 hover:bg-slate-50 rounded-lg group transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-slate-900" />
              </button>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="opacity-80"><Building2 className="h-3 w-3 inline mr-1" /> TENANTS</span>
                  <ChevronRight className="h-2.5 w-2.5 opacity-30" />
                  <span className="text-[#1a73e8] font-black">{tenant?.tenantName.toUpperCase() || "PROPERTY NETWORK"}</span>
                </div>
                <SheetTitle className="text-2xl font-black text-[#1e293b] tracking-tight">
                  {isAddingNew ? (editingOutlet ? `Edit ${editingOutlet.name}` : "Outlet Registration") : `Outlet Management ${tenant?.tenantName || ""}`}
                </SheetTitle>
              </div>
            </div>
            {!isAddingNew && (
              <Button 
                onClick={() => { setIsFormLoading(true); setIsAddingNew(true); setEditingOutlet(null); setTimeout(() => setIsFormLoading(false), 400); }} 
                className="h-10 px-6 font-black bg-[#1a73e8] hover:bg-[#1557b0] shadow-lg shadow-[#1a73e8]/20"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Outlet
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 flex min-h-0 overflow-hidden bg-[#f8f9fc] p-6 gap-6">
          {isAddingNew && (
            <div className="w-[400px] flex-shrink-0 bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col animate-in slide-in-from-left duration-500 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-[#1e293b] text-lg">Outlet Details</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configuration parameters</p>
                </div>
                <button 
                  onClick={() => { setIsAddingNew(false); setEditingOutlet(null); }}
                  className="h-8 w-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <ScrollArea className="flex-1">
                {isFormLoading ? (
                  <div className="py-40 flex flex-col items-center justify-center space-y-4 animate-pulse">
                    <Loader2 className="h-10 w-10 animate-spin text-[#1a73e8]" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Waking Up Server...</p>
                  </div>
                ) : (
                  <div className="p-8 space-y-8">
                    <div className="space-y-2">
                      <Label className="text-[13px] font-bold text-slate-700">Organization Context <span className="text-red-500">*</span></Label>
                      <Popover modal={true} open={isFormTenantPopoverOpen} onOpenChange={setIsFormTenantPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full h-12 justify-between bg-primary/5 text-primary font-black border-primary/20 hover:bg-primary/10 transition-all">
                            <span className="truncate">{formTenantId ? getTenantName(formTenantId) : "Assign to Brand..."}</span>
                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0 shadow-2xl z-[110]" onPointerDownOutside={e => e.preventDefault()} onInteractOutside={e => e.preventDefault()}>
                          <div className="p-2 border-b">
                            <Input 
                              autoFocus 
                              placeholder="Search brands..." 
                              value={formTenantSearch} 
                              onChange={e => setFormTenantSearch(e.target.value)} 
                              className="h-10 border-none shadow-none focus-visible:ring-0"
                            />
                          </div>
                          <ScrollArea className="h-64">
                            <div className="p-1 space-y-0.5">
                              {allTenants.filter(t => t.tenantName.toLowerCase().includes(formTenantSearch.toLowerCase())).map(t => (
                                <button 
                                  key={t.id} 
                                  type="button" 
                                  className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors hover:bg-slate-100 group text-left", formTenantId === t.id && "bg-primary/5 text-primary font-bold")}
                                  onClick={() => { setFormTenantId(t.id); setFormTenantSearch(""); setIsFormTenantPopoverOpen(false); }}
                                >
                                  <span className="truncate flex-1">{t.tenantName}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded group-hover:bg-white transition-colors">{t.numberOfOutlets} Outlets</span>
                                    {formTenantId === t.id && <Check className="h-3.5 w-3.5" />}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[13px] font-bold text-slate-700">Outlet Name</Label>
                        <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Downtown Flagship" className="h-12 bg-slate-50/50" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[13px] font-bold text-slate-700">Primary Phone</Label>
                        <Input value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="+971..." className="h-12 bg-slate-50/50" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[13px] font-bold text-slate-700">Region</Label>
                          <Select value={formCountry} onValueChange={val => { setFormCountry(val); setFormCity(""); }}>
                            <SelectTrigger className="h-12 bg-slate-50/50"><SelectValue placeholder="Country" /></SelectTrigger>
                            <SelectContent>{Object.keys(COUNTRY_CITY_MAP).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[13px] font-bold text-slate-700">City</Label>
                          <Select value={formCity} onValueChange={setFormCity} disabled={!formCountry}>
                            <SelectTrigger className="h-12 bg-slate-50/50"><SelectValue placeholder="City" /></SelectTrigger>
                            <SelectContent>{(COUNTRY_CITY_MAP[formCountry] || []).map(ci => <SelectItem key={ci} value={ci}>{ci}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>

              <div className="p-8 border-t bg-slate-50/50 flex gap-4 mt-auto flex-shrink-0">
                <Button variant="outline" className="flex-1 h-12 font-bold border-slate-200" onClick={() => { setIsAddingNew(false); setEditingOutlet(null); }}>Cancel</Button>
                <Button className="flex-1 h-12 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-black shadow-lg shadow-[#1a73e8]/20" onClick={handleSaveOutlet}>
                  {editingOutlet ? "Update Outlet" : "Confirm Addition"}
                </Button>
              </div>
            </div>
          )}

          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-0 overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-white flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-1 max-sm:w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search locations..." 
                  className="pl-10 h-11 bg-white border-slate-200" 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                />
              </div>
              <Select value={statusFilter || "all"} onValueChange={v => setStatusFilter(v === "all" ? null : v)}>
                <SelectTrigger className="w-56 h-11 bg-white border-slate-200 text-sm font-medium">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {(searchQuery || statusFilter) && (
                <Button variant="ghost" className="h-11 font-bold text-slate-400 hover:text-primary" onClick={() => { setSearchQuery(""); setStatusFilter(null); }}>
                  <FilterX className="h-4 w-4 mr-2" /> Clear
                </Button>
              )}
            </div>

            <ScrollArea className="flex-1">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="h-12 border-b border-slate-100 hover:bg-transparent">
                    <TableHead className="px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Outlet Profile</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Information</TableHead>
                    <TableHead className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operational Status</TableHead>
                    <TableHead className="text-right px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOutlets.length > 0 ? paginatedOutlets.map(o => (
                    <TableRow 
                      key={o.id} 
                      className={cn(
                        "cursor-pointer group hover:bg-slate-50/50 transition-all border-b border-slate-50",
                        editingOutlet?.id === o.id && "bg-primary/5 border-primary/10"
                      )}
                      onClick={() => { setIsFormLoading(true); setEditingOutlet(o); setIsAddingNew(true); setTimeout(() => setIsFormLoading(false), 400); }}
                    >
                      <TableCell className="py-5 px-8">
                        <div>
                          <div className="font-extrabold text-[#1e293b] text-[15px] group-hover:text-[#1a73e8] transition-colors">{o.name}</div>
                          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">{o.city}, {o.country}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 text-sm">{o.phone}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{o.timezone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "rounded-full px-4 py-1 text-[10px] font-black border-none uppercase tracking-widest shadow-sm", 
                          o.status === 'Active' ? "bg-[#e1f9ef] text-[#22c55e]" : "bg-slate-100 text-slate-500"
                        )}>
                          {o.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-slate-900" onClick={e => e.stopPropagation()}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 p-2">
                            <DropdownMenuItem className="font-bold py-2.5" onClick={e => { e.stopPropagation(); setEditingOutlet(o); setIsAddingNew(true); }}>
                              <Edit2 className="h-4 w-4 mr-3 text-slate-400" /> Edit Configuration
                            </DropdownMenuItem>
                            <DropdownMenuItem className="font-bold py-2.5" onClick={e => { e.stopPropagation(); onViewUsers(o); }}>
                              <UsersIcon className="h-4 w-4 mr-3 text-slate-400" /> Manage Staff
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1" />
                            <DropdownMenuItem className="text-destructive font-black py-2.5" onClick={e => { e.stopPropagation(); setAllOutlets(prev => prev.filter(p => p.id !== o.id)); toast({ title: "Property Deleted", description: "All associated data has been removed." }); }}>
                              <Trash2 className="h-4 w-4 mr-3" /> Decommission
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="py-20 text-center">
                        <div className="flex flex-col items-center">
                          <Store className="h-12 w-12 text-slate-100 mb-4" />
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No outlet locations registered yet.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>

            {totalPages > 1 && (
              <div className="px-8 py-4 border-t border-slate-50 flex items-center justify-between bg-white flex-shrink-0">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                  Showing Page <span className="text-slate-900">{currentPage}</span> of <span className="text-slate-900">{totalPages}</span>
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2 border-slate-200" 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
