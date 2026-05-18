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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Outlet, Organization } from "@/lib/types"
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

const TIMEZONES = [
  "Asia/Dubai",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "UTC"
]

interface OutletManagementProps {
  organization?: Organization | null;
  allOutlets: Outlet[];
  setAllOutlets: React.Dispatch<React.SetStateAction<Outlet[]>>;
  allOrganizations: Organization[];
  isOpen: boolean;
  onClose: () => void;
  onViewUsers: (outlet: Outlet) => void;
}

export function OutletManagement({ organization, allOutlets, setAllOutlets, allOrganizations, isOpen, onClose, onViewUsers }: OutletManagementProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  
  const [isAddingNew, setIsAddingNew] = React.useState(false)
  const [editingOutlet, setEditingOutlet] = React.useState<Outlet | null>(null)
  const [isFormLoading, setIsFormLoading] = React.useState(false)

  const [isFormOrganizationPopoverOpen, setIsFormOrganizationPopoverOpen] = React.useState(false)
  const [formOrganizationSearch, setFormOrganizationSearch] = React.useState("")

  const [formOrganizationId, setFormOrganizationId] = React.useState("")
  const [formName, setFormName] = React.useState("")
  const [formSlug, setFormSlug] = React.useState("")
  const [formPhone, setFormPhone] = React.useState("")
  const [formTimezone, setFormTimezone] = React.useState("Asia/Dubai")
  const [formCity, setFormCity] = React.useState("")
  const [formCountry, setFormCountry] = React.useState("")
  const [formState, setFormState] = React.useState("")
  const [formStreetAddress, setFormStreetAddress] = React.useState("")
  const [formZipCode, setFormZipCode] = React.useState("")

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
        setFormOrganizationId(editingOutlet.organizationId)
        setFormName(editingOutlet.name)
        setFormSlug(editingOutlet.slug)
        setFormPhone(editingOutlet.phone)
        setFormTimezone(editingOutlet.timezone)
        setFormCity(editingOutlet.city)
        setFormCountry(editingOutlet.country)
        setFormState(editingOutlet.state || "")
        setFormStreetAddress(editingOutlet.streetAddress || "")
        setFormZipCode(editingOutlet.zipCode || "")
      } else {
        setFormOrganizationId(organization?.id || "")
        setFormName("")
        setFormSlug("")
        setFormPhone("")
        setFormTimezone("Asia/Dubai")
        setFormCity("")
        setFormCountry("")
        setFormState("")
        setFormStreetAddress("")
        setFormZipCode("")
      }
    }
  }, [editingOutlet, organization, isOpen])

  const handleNameChange = (val: string) => {
    setFormName(val)
    if (!editingOutlet) {
      setFormSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-z0-9-]/g, ''))
    }
  }

  const filteredOutlets = React.useMemo(() => {
    return allOutlets.filter(o => {
      const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            o.city.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = !statusFilter || o.status === statusFilter
      const matchesOrganization = !organization || o.organizationId === organization.id
      return matchesSearch && matchesStatus && matchesOrganization
    })
  }, [allOutlets, searchQuery, statusFilter, organization])

  const paginatedOutlets = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredOutlets.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredOutlets, currentPage])

  const totalPages = Math.ceil(filteredOutlets.length / ITEMS_PER_PAGE)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, organization])

  const handleSaveOutlet = () => {
    if (!formOrganizationId || !formName || !formSlug) {
      toast({ title: "Validation Error", description: "Identity parameters are required.", variant: "destructive" })
      return
    }

    if (editingOutlet) {
      setAllOutlets(prev => prev.map(o => o.id === editingOutlet.id ? {
        ...o,
        organizationId: formOrganizationId,
        name: formName,
        slug: formSlug,
        phone: formPhone,
        timezone: formTimezone,
        city: formCity,
        country: formCountry,
        state: formState,
        streetAddress: formStreetAddress,
        zipCode: formZipCode
      } : o))
      toast({ title: "Outlet Updated" })
    } else {
      const newOutlet: Outlet = {
        id: `o-${Math.random().toString(36).substr(2, 9)}`,
        organizationId: formOrganizationId,
        name: formName,
        slug: formSlug,
        phone: formPhone,
        timezone: formTimezone,
        city: formCity,
        country: formCountry,
        state: formState,
        streetAddress: formStreetAddress,
        zipCode: formZipCode,
        status: 'Active',
        userCount: 0
      }
      setAllOutlets(prev => [newOutlet, ...prev])
      toast({ title: "New Outlet Registered" })
    }
    setIsAddingNew(false)
    setEditingOutlet(null)
  }

  const getOrganizationName = (orgId: string) => allOrganizations.find(org => org.id === orgId)?.organizationName || "Unknown"

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-[1200px] p-0 border-l border-slate-200 bg-[#f8f9fc] flex flex-col transition-all duration-500">
        <SheetHeader className="px-8 py-6 bg-white border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={isAddingNew ? () => { setIsAddingNew(false); setEditingOutlet(null); } : onClose} className="p-2 hover:bg-slate-50 rounded-lg group transition-colors">
                <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-slate-900" />
              </button>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="opacity-80"><Building2 className="h-3 w-3 inline mr-1" /> ORGANIZATIONS</span>
                  <ChevronRight className="h-2.5 w-2.5 opacity-30" />
                  <span className="text-primary font-black">{organization?.organizationName.toUpperCase() || "PROPERTY NETWORK"}</span>
                </div>
                <SheetTitle className="text-2xl font-black text-[#1e293b] tracking-tight">
                  {isAddingNew ? (editingOutlet ? `Edit ${editingOutlet.name}` : "Outlet Registration") : `Outlet Management ${organization?.organizationName || ""}`}
                </SheetTitle>
              </div>
            </div>
            {!isAddingNew && (
              <Button onClick={() => { setIsFormLoading(true); setIsAddingNew(true); setEditingOutlet(null); setTimeout(() => setIsFormLoading(false), 400); }} className="h-10 px-6 font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-white">
                <Plus className="h-4 w-4 mr-2" /> Add Outlet
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 flex min-h-0 overflow-hidden bg-[#f8f9fc] p-6 gap-6">
          {isAddingNew && (
            <div className="w-[450px] flex-shrink-0 bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col animate-in slide-in-from-left duration-500 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-[#1e293b] text-lg">Outlet Configuration</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Branch property profile</p>
                </div>
                <button onClick={() => { setIsAddingNew(false); setEditingOutlet(null); }} className="h-8 w-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400"><X className="h-4 w-4" /></button>
              </div>

              <ScrollArea className="flex-1">
                {isFormLoading ? <div className="py-40 flex flex-col items-center justify-center animate-pulse"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div> : (
                  <div className="p-8 space-y-8">
                    <div className="space-y-2">
                      <Label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">ASSIGNED BRAND</Label>
                      <Popover modal={true} open={isFormOrganizationPopoverOpen} onOpenChange={setIsFormOrganizationPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full h-12 justify-between bg-primary/5 text-primary font-black border-primary/10">
                            <span className="truncate">{formOrganizationId ? getOrganizationName(formOrganizationId) : "Select Brand..."}</span>
                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0 shadow-2xl z-[110]">
                          <div className="p-2 border-b"><Input autoFocus placeholder="Search..." value={formOrganizationSearch} onChange={e => setFormOrganizationSearch(e.target.value)} className="h-10 border-none shadow-none focus-visible:ring-0" /></div>
                          <ScrollArea className="h-64"><div className="p-1">
                            {allOrganizations.filter(org => org.organizationName.toLowerCase().includes(formOrganizationSearch.toLowerCase())).map(org => (
                              <button key={org.id} type="button" className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm hover:bg-slate-100", formOrganizationId === org.id && "bg-primary/5 text-primary font-bold")} onClick={() => { setFormOrganizationId(org.id); setFormOrganizationSearch(""); setIsFormOrganizationPopoverOpen(false); }}>
                                <span>{org.organizationName}</span><Check className={cn("h-4 w-4 opacity-0", formOrganizationId === org.id && "opacity-100")} />
                              </button>
                            ))}
                          </div></ScrollArea>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">OUTLET NAME</Label><Input value={formName} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Marina Bay" className="h-12" /></div>
                      <div className="space-y-2"><Label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">OUTLET SLUG</Label><Input value={formSlug} onChange={e => setFormSlug(e.target.value)} placeholder="marina-bay" className="h-12" disabled={!!editingOutlet} /></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">PHONE</Label><Input value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="+971..." className="h-12" /></div>
                      <div className="space-y-2">
                        <Label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">TIMEZONE</Label>
                        <Select value={formTimezone} onValueChange={setFormTimezone}>
                          <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                          <SelectContent>{TIMEZONES.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">COUNTRY</Label>
                        <Select value={formCountry} onValueChange={val => { setFormCountry(val); setFormCity(""); }}>
                          <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                          <SelectContent>{Object.keys(COUNTRY_CITY_MAP).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">CITY</Label>
                        <Select value={formCity} onValueChange={setFormCity} disabled={!formCountry}>
                          <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                          <SelectContent>{(COUNTRY_CITY_MAP[formCountry] || []).map(ci => <SelectItem key={ci} value={ci}>{ci}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2"><Label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">STATE</Label><Input value={formState} onChange={e => setFormState(e.target.value)} placeholder="State/Region" className="h-12" /></div>
                    <div className="space-y-2"><Label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">STREET ADDRESS</Label><Input value={formStreetAddress} onChange={e => setFormStreetAddress(e.target.value)} placeholder="Building, Street Name" className="h-12" /></div>
                    <div className="space-y-2"><Label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">ZIP CODE</Label><Input value={formZipCode} onChange={e => setFormZipCode(e.target.value)} placeholder="Zip/Postal Code" className="h-12" /></div>
                  </div>
                )}
              </ScrollArea>

              <div className="p-8 border-t bg-slate-50/50 flex gap-4">
                <Button variant="outline" className="flex-1 h-12 font-bold" onClick={() => { setIsAddingNew(false); setEditingOutlet(null); }}>Cancel</Button>
                <Button className="flex-1 h-12 bg-primary hover:bg-primary/90 font-black shadow-lg shadow-primary/20 text-white" onClick={handleSaveOutlet}>{editingOutlet ? "Update Outlet" : "Create Outlet"}</Button>
              </div>
            </div>
          )}

          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-0 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search locations..." className="pl-10 h-11" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <Select value={statusFilter || "all"} onValueChange={v => setStatusFilter(v === "all" ? null : v)}>
                <SelectTrigger className="w-56 h-11"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent>
              </Select>
            </div>

            <ScrollArea className="flex-1">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="h-12 border-b border-slate-100 hover:bg-transparent">
                    <TableHead className="px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Outlet Profile</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location Info</TableHead>
                    <TableHead className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</TableHead>
                    <TableHead className="text-right px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOutlets.map(o => (
                    <TableRow key={o.id} className="cursor-pointer group hover:bg-slate-50/50 border-b border-slate-50" onClick={() => { setEditingOutlet(o); setIsAddingNew(true); }}>
                      <TableCell className="py-5 px-8">
                        <div>
                          <div className="font-extrabold text-[#1e293b] text-[15px] group-hover:text-primary transition-colors">{o.name}</div>
                          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">slug: {o.slug}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col"><span className="font-bold text-slate-700 text-sm">{o.phone}</span><span className="text-[10px] text-slate-400 font-medium">{o.timezone}</span></div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-bold text-slate-600">{o.city}, {o.country}</div>
                        <div className="text-[10px] text-slate-400">{o.streetAddress}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn("rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm", o.status === 'Active' ? "bg-[#e1f9ef] text-[#22c55e]" : "bg-slate-100 text-slate-500")}>
                          {o.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400" onClick={e => e.stopPropagation()}><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 p-2">
                            <DropdownMenuItem className="font-bold py-2.5" onClick={e => { e.stopPropagation(); setEditingOutlet(o); setIsAddingNew(true); }}><Edit2 className="h-4 w-4 mr-3 text-slate-400" /> Edit Configuration</DropdownMenuItem>
                            <DropdownMenuItem className="font-bold py-2.5" onClick={e => { e.stopPropagation(); onViewUsers(o); }}><UsersIcon className="h-4 w-4 mr-3 text-slate-400" /> Manage Staff</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive font-black py-2.5" onClick={e => { e.stopPropagation(); setAllOutlets(prev => prev.filter(p => p.id !== o.id)); toast({ title: "Property Deleted" }); }}><Trash2 className="h-4 w-4 mr-3" /> Decommission</DropdownMenuItem>
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
                  Showing <span className="text-primary">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-primary">{Math.min(currentPage * ITEMS_PER_PAGE, filteredOutlets.length)}</span> of <span className="text-primary">{filteredOutlets.length}</span> results
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
