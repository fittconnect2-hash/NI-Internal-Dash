
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
  Loader2,
  ChevronLeft,
  Check
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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

  const restoreUI = React.useCallback(() => {
    document.body.style.pointerEvents = 'auto';
    document.body.style.overflow = 'auto';
  }, []);

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
    } else {
      restoreUI()
    }
  }, [editingOutlet, tenant, isOpen])

  const filteredOutlets = React.useMemo(() => {
    return allOutlets.filter(o => {
      const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase())
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
      toast({ title: "Required Fields", description: "Missing branch name or tenant.", variant: "destructive" })
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
      toast({ title: "Outlet Updated" })
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
      toast({ title: "Branch Registered" })
    }
    setIsAddingNew(false)
    setEditingOutlet(null)
  }

  const getTenantName = (tid: string) => allTenants.find(t => t.id === tid)?.tenantName || "Unknown"

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); restoreUI(); } }}>
      <SheetContent side="right" className="w-full sm:max-w-[1200px] p-0 border-l border-slate-200 bg-[#f8f9fc] flex flex-col">
        <SheetHeader className="px-8 py-6 bg-white border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={isAddingNew ? () => setIsAddingNew(false) : onClose} className="p-2 hover:bg-slate-50 rounded-lg group transition-colors">
                <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-slate-900" />
              </button>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="opacity-80"><Building2 className="h-3 w-3 inline mr-1" /> TENANTS</span>
                  <ChevronRight className="h-2.5 w-2.5 opacity-30" />
                  <span className="text-[#1a73e8] font-black">{tenant?.tenantName.toUpperCase() || "PROPERTY LIST"}</span>
                </div>
                <SheetTitle className="text-2xl font-black text-[#1e293b] tracking-tight">{isAddingNew ? (editingOutlet ? `Edit ${editingOutlet.name}` : "Register Property") : "Branch Network"}</SheetTitle>
              </div>
            </div>
            {!isAddingNew && <Button onClick={() => { setIsFormLoading(true); setIsAddingNew(true); setEditingOutlet(null); setTimeout(() => setIsFormLoading(false), 400); }} className="h-10 px-6 font-black bg-[#1a73e8]"><Plus className="h-4 w-4 mr-2" /> Add Branch</Button>}
          </div>
        </SheetHeader>

        <div className="flex-1 flex min-h-0 overflow-hidden bg-[#f8f9fc] p-6 gap-6">
          {isAddingNew ? (
            <div className="w-[450px] mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
               <ScrollArea className="flex-1">
                 {isFormLoading ? <div className="py-40 flex items-center justify-center animate-pulse"><Loader2 className="animate-spin text-primary" /></div> : (
                   <div className="p-10 space-y-8">
                     <div className="space-y-2">
                        <Label className="text-[13px] font-bold text-slate-700">Organization Identity <span className="text-red-500">*</span></Label>
                        <Popover modal={true} open={isFormTenantPopoverOpen} onOpenChange={setIsFormTenantPopoverOpen}>
                          <PopoverTrigger asChild><Button variant="outline" className="w-full h-12 justify-between bg-primary/5 text-primary font-black"><span className="truncate">{formTenantId ? getTenantName(formTenantId) : "Assign to Organization..."}</span><ChevronsUpDown className="h-4 w-4 opacity-50" /></Button></PopoverTrigger>
                          <PopoverContent className="w-80 p-0 shadow-2xl z-[110]" onPointerDownOutside={e => e.preventDefault()} onInteractOutside={e => e.preventDefault()}>
                            <div className="p-2 border-b"><Input autoFocus placeholder="Search brands..." value={formTenantSearch} onChange={e => setFormTenantSearch(e.target.value)} /></div>
                            <ScrollArea className="h-60"><div className="p-1">
                              {allTenants.filter(t => t.tenantName.toLowerCase().includes(formTenantSearch.toLowerCase())).map(t => (
                                <button key={t.id} type="button" className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm hover:bg-slate-100", formTenantId === t.id && "bg-primary/5 text-primary font-bold")} onClick={() => { setFormTenantId(t.id); setFormTenantSearch(""); setIsFormTenantPopoverOpen(false); }}>
                                  <span>{t.tenantName}</span><span className="text-[10px] font-bold text-slate-400">{t.numberOfOutlets} Outlets</span>
                                </button>
                              ))}
                            </div></ScrollArea>
                          </PopoverContent>
                        </Popover>
                     </div>
                     <div className="space-y-4">
                        <div className="space-y-2"><Label>Branch Display Name</Label><Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Downtown Hub" className="h-12" /></div>
                        <div className="space-y-2"><Label>Primary Phone</Label><Input value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="+971..." className="h-12" /></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><Label>Region</Label><Select value={formCountry} onValueChange={setFormCountry}><SelectTrigger className="h-12"><SelectValue placeholder="Country" /></SelectTrigger><SelectContent>{Object.keys(COUNTRY_CITY_MAP).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                          <div className="space-y-2"><Label>City</Label><Select value={formCity} onValueChange={setFormCity} disabled={!formCountry}><SelectTrigger className="h-12"><SelectValue placeholder="City" /></SelectTrigger><SelectContent>{(COUNTRY_CITY_MAP[formCountry] || []).map(ci => <SelectItem key={ci} value={ci}>{ci}</SelectItem>)}</SelectContent></Select></div>
                        </div>
                     </div>
                   </div>
                 )}
               </ScrollArea>
               <div className="p-8 border-t bg-slate-50/50 flex gap-4">
                  <Button variant="outline" className="flex-1 h-12" onClick={() => setIsAddingNew(false)}>Cancel</Button>
                  <Button className="flex-1 h-12 bg-[#1a73e8] font-black" onClick={handleSaveOutlet}>{editingOutlet ? "Save Changes" : "Register Branch"}</Button>
               </div>
            </div>
          ) : (
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-0">
               <div className="p-6 flex flex-col md:flex-row gap-4 border-b bg-slate-50/10">
                  <Input placeholder="Search branches..." className="max-w-sm h-11 bg-white" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  <Select value={statusFilter || "all"} onValueChange={v => setStatusFilter(v === "all" ? null : v)}><SelectTrigger className="w-56 h-11"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select>
               </div>
               <ScrollArea className="flex-1">
                  <Table>
                    <TableHeader className="bg-slate-50/50"><TableRow className="h-12 uppercase text-[10px] font-bold text-slate-400"><TableHead className="px-8">Name</TableHead><TableHead>Phone</TableHead><TableHead className="text-center">Status</TableHead><TableHead className="text-right px-8">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {paginatedOutlets.map(o => (
                        <TableRow key={o.id} className="cursor-pointer group hover:bg-slate-50/50" onClick={() => { setIsFormLoading(true); setEditingOutlet(o); setIsAddingNew(true); setTimeout(() => setIsFormLoading(false), 400); }}>
                          <TableCell className="py-5 px-8"><div><div className="font-extrabold text-[#1e293b] group-hover:text-[#1a73e8] transition-colors">{o.name}</div><div className="text-[11px] text-slate-400">{o.city}, {o.country}</div></div></TableCell>
                          <TableCell className="font-bold text-slate-600">{o.phone}</TableCell>
                          <TableCell className="text-center"><Badge className={cn("rounded-full px-3 py-1 text-[10px] font-bold uppercase", o.status === 'Active' ? "bg-green-100 text-green-600" : "bg-slate-100")}>{o.status}</Badge></TableCell>
                          <TableCell className="text-right px-8">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="text-slate-400" onClick={e => e.stopPropagation()}><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 p-2">
                                <DropdownMenuItem className="font-bold py-2.5" onClick={e => { e.stopPropagation(); setEditingOutlet(o); setIsAddingNew(true); }}><Edit2 className="h-4 w-4 mr-3" /> Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive font-black py-2.5" onClick={e => { e.stopPropagation(); setAllOutlets(prev => prev.filter(p => p.id !== o.id)); toast({ title: "Branch Deleted" }); }}><Trash2 className="h-4 w-4 mr-3" /> Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
               </ScrollArea>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
