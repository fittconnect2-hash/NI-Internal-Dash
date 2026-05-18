"use client"

import * as React from "react"
import { 
  Search, 
  Store, 
  Building2, 
  Users, 
  MoreHorizontal, 
  ChevronsUpDown,
  FilterX,
  Plus,
  MapPin,
  Globe,
  Phone,
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  Edit2,
  X,
  Loader2
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
import { Label } from "@/components/ui/label"
import { Outlet, Tenant } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

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

interface OutletListViewProps {
  allOutlets: Outlet[];
  setAllOutlets: React.Dispatch<React.SetStateAction<Outlet[]>>;
  allTenants: Tenant[];
  onViewUsers: (outlet: Outlet) => void;
}

export function OutletListView({ allOutlets, setAllOutlets, allTenants, onViewUsers }: OutletListViewProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [tenantFilter, setTenantFilter] = React.useState<string | null>(null)
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  
  const [tenantSearch, setTenantSearch] = React.useState("")
  const [isTenantPopoverOpen, setIsTenantPopoverOpen] = React.useState(false)

  const [isFormTenantPopoverOpen, setIsFormTenantPopoverOpen] = React.useState(false)
  const [formTenantSearch, setFormTenantSearch] = React.useState("")

  const [editingOutlet, setEditingOutlet] = React.useState<Outlet | null>(null)
  const [isFormVisible, setIsFormVisible] = React.useState(false)
  const [isFormLoading, setIsFormLoading] = React.useState(false)

  const [formTenantId, setFormTenantId] = React.useState("")
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
    if (editingOutlet) {
      setFormTenantId(editingOutlet.tenantId)
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
      setFormTenantId(tenantFilter || "")
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
    setFormTenantSearch("")
  }, [editingOutlet, tenantFilter, isFormVisible])

  const handleNameChange = (val: string) => {
    setFormName(val)
    if (!editingOutlet) {
      setFormSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-z0-9-]/g, ''))
    }
  }

  const tenantsWithCounts = React.useMemo(() => {
    return allTenants.map(tenant => ({
      ...tenant,
      count: allOutlets.filter(o => o.tenantId === tenant.id).length
    })).filter(tenant => tenant.count > 0)
  }, [allOutlets, allTenants])

  const filteredTenantsForDropdown = React.useMemo(() => {
    return tenantsWithCounts.filter(t => 
      t.tenantName.toLowerCase().includes(tenantSearch.toLowerCase())
    )
  }, [tenantsWithCounts, tenantSearch])

  const filteredTenantsForForm = React.useMemo(() => {
    return allTenants.filter(t => 
      t.tenantName.toLowerCase().includes(formTenantSearch.toLowerCase())
    )
  }, [allTenants, formTenantSearch])

  const filteredOutlets = React.useMemo(() => {
    return allOutlets.filter(outlet => {
      const matchesSearch = outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           outlet.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           outlet.phone.includes(searchQuery)
      const matchesTenant = !tenantFilter || outlet.tenantId === tenantFilter
      const matchesStatus = !statusFilter || outlet.status === statusFilter
      return matchesSearch && matchesTenant && matchesStatus
    })
  }, [allOutlets, searchQuery, tenantFilter, statusFilter])

  const totalPages = Math.ceil(filteredOutlets.length / ITEMS_PER_PAGE)
  const paginatedOutlets = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredOutlets.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredOutlets, currentPage])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, tenantFilter, statusFilter])

  const handleEdit = (outlet: Outlet) => {
    setEditingOutlet(outlet)
    setIsFormVisible(true)
    setIsFormLoading(true)
    setTimeout(() => setIsFormLoading(false), 600)
  }

  const handleAddOutlet = () => {
    setEditingOutlet(null)
    setIsFormVisible(true)
    setIsFormLoading(true)
    setTimeout(() => setIsFormLoading(false), 400)
  }

  const handleCloseForm = () => {
    setIsFormVisible(false)
    setEditingOutlet(null)
  }

  const handleSaveOutlet = () => {
    if (!formTenantId || !formName || !formSlug) {
      toast({ title: "Validation Error", description: "All core identity fields are required.", variant: "destructive" })
      return
    }

    if (editingOutlet) {
      setAllOutlets(prev => prev.map(o => o.id === editingOutlet.id ? {
        ...o,
        tenantId: formTenantId,
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
        tenantId: formTenantId,
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
      toast({ title: "Outlet Added" })
    }
    handleCloseForm()
  }

  const resetFilters = () => {
    setSearchQuery("")
    setTenantFilter(null)
    setStatusFilter(null)
    setTenantSearch("")
  }

  return (
    <div className="p-6 md:p-8 flex flex-col h-full overflow-hidden bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Outlet Management</h1>
            <p className="text-sm text-slate-500 mt-1">Configure and monitor your global property network.</p>
          </div>
          <Button size="sm" className="h-10 px-6 font-black bg-primary shadow-lg shadow-primary/20" onClick={handleAddOutlet}>
            <Plus className="h-4 w-4 mr-2" /> Add Outlet
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input placeholder="Search..." className="pl-9 h-11" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Tenant Filter</label>
              <Popover open={isTenantPopoverOpen} onOpenChange={setIsTenantPopoverOpen}>
                <PopoverTrigger asChild><Button variant="outline" className="w-full h-11 justify-between bg-white px-3"><span className="truncate">{tenantFilter ? allTenants.find(t => t.id === tenantFilter)?.tenantName : "All Tenants"}</span><ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" /></Button></PopoverTrigger>
                <PopoverContent className="w-80 p-0 shadow-2xl"><div className="flex items-center border-b px-3"><Search className="mr-2 h-4 w-4 opacity-50" /><Input className="flex h-11 w-full border-none shadow-none focus-visible:ring-0 bg-transparent" placeholder="Search..." value={tenantSearch} onChange={(e) => setTenantSearch(e.target.value)} /></div>
                  <ScrollArea className="h-72"><div className="p-1"><Button variant="ghost" className="w-full justify-start h-10" onClick={() => { setTenantFilter(null); setIsTenantPopoverOpen(false); }}>All Tenants</Button>{filteredTenantsForDropdown.map((t) => (<Button key={t.id} variant="ghost" className="w-full justify-start h-10 group" onClick={() => { setTenantFilter(t.id); setIsTenantPopoverOpen(false); }}><span className="truncate flex-1 text-left">{t.tenantName}</span><span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded group-hover:bg-white">{t.count} Outlets</span></Button>))}</div></ScrollArea>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Status</label>
              <Select onValueChange={(v) => setStatusFilter(v === 'all' ? null : v)} value={statusFilter || 'all'}>
                <SelectTrigger className="h-11 bg-white">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" className="w-full h-11 text-slate-400 hover:text-primary gap-2 font-bold" onClick={resetFilters}><FilterX className="h-4 w-4" /> Reset Filters</Button>
          </div>
        </div>

        <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
          {isFormVisible && (
            <div className="w-[450px] flex-shrink-0 bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col animate-in slide-in-from-left duration-500 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between"><div><h3 className="font-extrabold text-lg text-[#1e293b]">{editingOutlet ? `Edit ${editingOutlet.name}` : "Add New Outlet"}</h3><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Property profile</p></div><Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleCloseForm}><X className="h-4 w-4" /></Button></div>
              <ScrollArea className="flex-1">
                {isFormLoading ? <div className="flex flex-col items-center justify-center h-full py-24"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div> : (
                  <div className="px-8 py-6 space-y-6">
                    <div className="space-y-2.5"><Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PARENT TENANT</Label>
                      <Popover modal={true} open={isFormTenantPopoverOpen} onOpenChange={setIsFormTenantPopoverOpen}>
                        <PopoverTrigger asChild><Button variant="outline" className="w-full h-12 justify-between bg-slate-50/50 text-sm font-medium px-3"><span className="truncate">{formTenantId ? allTenants.find(t => t.id === formTenantId)?.tenantName : "Select Tenant"}</span><ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" /></Button></PopoverTrigger>
                        <PopoverContent className="w-80 p-0 z-[110] shadow-2xl" align="start">
                          <div className="flex items-center border-b px-3"><Search className="mr-2 h-4 w-4 opacity-50" /><Input className="flex h-11 w-full border-none shadow-none focus-visible:ring-0 bg-transparent" placeholder="Search..." value={formTenantSearch} onChange={(e) => setFormTenantSearch(e.target.value)} /></div>
                          <ScrollArea className="h-60"><div className="p-1">{filteredTenantsForForm.map((t) => (<button key={t.id} type="button" className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm hover:bg-slate-100", formTenantId === t.id && "bg-primary/5 text-primary font-bold")} onClick={() => { setFormTenantId(t.id); setIsFormTenantPopoverOpen(false); }}><span className="truncate flex-1 text-left">{t.tenantName}</span><Check className={cn("h-4 w-4 opacity-0", formTenantId === t.id && "opacity-100")} /></button>))}</div></ScrollArea>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2.5"><Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NAME</Label><Input value={formName} onChange={e => handleNameChange(e.target.value)} placeholder="Marina Bay" className="h-11" /></div>
                      <div className="space-y-2.5"><Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SLUG</Label><Input value={formSlug} onChange={e => setFormSlug(e.target.value)} placeholder="marina-bay" className="h-11" disabled={!!editingOutlet} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2.5"><Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PHONE</Label><Input value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="+971..." className="h-11" /></div>
                      <div className="space-y-2.5"><Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TIMEZONE</Label>
                        <Select value={formTimezone} onValueChange={setFormTimezone}><SelectTrigger className="h-11"><SelectValue /></SelectTrigger><SelectContent>{TIMEZONES.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}</SelectContent></Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2.5"><Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">COUNTRY</Label>
                        <Select value={formCountry} onValueChange={(val) => { setFormCountry(val); setFormCity(""); }}><SelectTrigger className="h-11"><SelectValue /></SelectTrigger><SelectContent>{Object.keys(COUNTRY_CITY_MAP).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
                      </div>
                      <div className="space-y-2.5"><Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CITY</Label>
                        <Select value={formCity} onValueChange={setFormCity} disabled={!formCountry}><SelectTrigger className="h-11"><SelectValue /></SelectTrigger><SelectContent>{(COUNTRY_CITY_MAP[formCountry] || []).map(ci => <SelectItem key={ci} value={ci}>{ci}</SelectItem>)}</SelectContent></Select>
                      </div>
                    </div>
                    <div className="space-y-2.5"><Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">STATE</Label><Input value={formState} onChange={e => setFormState(e.target.value)} placeholder="State/Province" className="h-11" /></div>
                    <div className="space-y-2.5"><Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">STREET ADDRESS</Label><Input value={formStreetAddress} onChange={e => setFormStreetAddress(e.target.value)} placeholder="123 Ocean Blvd" className="h-11" /></div>
                    <div className="space-y-2.5"><Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ZIP CODE</Label><Input value={formZipCode} onChange={e => setFormZipCode(e.target.value)} placeholder="10001" className="h-11" /></div>
                  </div>
                )}
              </ScrollArea>
              <div className="p-6 border-t border-slate-100 flex gap-4 bg-slate-50/30"><Button variant="outline" className="flex-1 h-12" onClick={handleCloseForm}>Cancel</Button><Button className="flex-1 h-12 bg-primary font-bold shadow-lg shadow-primary/20" onClick={handleSaveOutlet}>{editingOutlet ? "Save Changes" : "Create Outlet"}</Button></div>
            </div>
          )}

          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-0 overflow-hidden">
            <ScrollArea className="flex-1">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-b border-slate-100">
                    <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-8 uppercase tracking-widest">Outlet Profile</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest">Contact</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest">Location</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest text-center">Status</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-8 text-right uppercase tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOutlets.map((outlet) => (
                    <TableRow key={outlet.id} className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 cursor-pointer" onClick={() => handleEdit(outlet)}>
                      <TableCell className="py-5 px-8">
                        <div>
                          <div className="font-extrabold text-[15px] text-[#1e293b] group-hover:text-primary transition-colors">{outlet.name}</div>
                          <div className="text-[11px] text-slate-400 font-medium">@{outlet.slug}</div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 text-[14px] text-[#1e293b] font-extrabold">{outlet.phone}</TableCell>
                      <TableCell className="px-4">
                        <div className="text-xs font-bold text-slate-700">{outlet.city}, {outlet.country}</div>
                        <div className="text-[10px] text-slate-400">{outlet.streetAddress}</div>
                      </TableCell>
                      <TableCell className="px-4 text-center">
                        <Badge className={cn("rounded-full px-3 py-1 text-[10px] font-bold uppercase", outlet.status === 'Active' ? "bg-[#e1f9ef] text-[#22c55e]" : "bg-slate-100 text-slate-500")}>
                          {outlet.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400" onClick={(e) => e.stopPropagation()}><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 p-2">
                            <DropdownMenuItem className="font-bold py-2.5" onClick={(e) => { e.stopPropagation(); handleEdit(outlet); }}><Edit2 className="h-4 w-4 mr-3 text-slate-400" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive font-black py-2.5" onClick={(e) => { e.stopPropagation(); setAllOutlets(prev => prev.filter(o => o.id !== outlet.id)); toast({ title: "Outlet Deleted" }); }}>Delete</DropdownMenuItem>
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
      </div>
    </div>
  )
}
