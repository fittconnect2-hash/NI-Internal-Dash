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
  Loader2
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
import { initialOutlets } from "@/lib/mock-data"
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

interface OutletManagementProps {
  tenant?: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
  onViewUsers: (outlet: Outlet) => void;
}

export function OutletManagement({ tenant, isOpen, onClose, onViewUsers }: OutletManagementProps) {
  const [outlets, setOutlets] = React.useState<Outlet[]>(initialOutlets)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)
  const [isAddingNew, setIsAddingNew] = React.useState(false)
  const [editingOutlet, setEditingOutlet] = React.useState<Outlet | null>(null)
  const [isFormLoading, setIsFormLoading] = React.useState(false)

  // Form State
  const [formName, setFormName] = React.useState("")
  const [formSlug, setFormSlug] = React.useState("")
  const [formPhone, setFormPhone] = React.useState("")
  const [formTimezone, setFormTimezone] = React.useState("Asia/Dubai")
  const [formCity, setFormCity] = React.useState("")
  const [formCountry, setFormCountry] = React.useState("")

  React.useEffect(() => {
    if (editingOutlet) {
      setFormName(editingOutlet.name)
      setFormSlug(editingOutlet.slug)
      setFormPhone(editingOutlet.phone)
      setFormTimezone(editingOutlet.timezone)
      setFormCity(editingOutlet.city)
      setFormCountry(editingOutlet.country)
    } else {
      setFormName("")
      setFormSlug("")
      setFormPhone("")
      setFormTimezone("Asia/Dubai")
      setFormCity("")
      setFormCountry("")
    }
  }, [editingOutlet])

  const filteredOutlets = outlets.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || o.status === statusFilter
    const matchesTenant = !tenant || o.tenantId === tenant.id
    return matchesSearch && matchesStatus && matchesTenant
  })

  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter(null)
  }

  const handleEdit = (outlet: Outlet) => {
    setEditingOutlet(outlet)
    setIsAddingNew(true)
    setIsFormLoading(true)
    setTimeout(() => {
      setIsFormLoading(false)
    }, 600)
  }

  const handleAddNew = () => {
    setEditingOutlet(null)
    setIsAddingNew(true)
    setIsFormLoading(true)
    setTimeout(() => {
      setIsFormLoading(false)
    }, 400)
  }

  const handleCloseForm = () => {
    setIsAddingNew(false)
    setEditingOutlet(null)
    setIsFormLoading(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[1200px] p-0 border-l border-slate-200 bg-[#f8f9fc] flex flex-col transition-all duration-500">
        <SheetHeader className="px-8 py-6 bg-white border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-50 rounded-lg transition-colors group"
              >
                <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-slate-900" />
              </button>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5 opacity-80"><Building2 className="h-3 w-3" /> TENANTS</span>
                  <ChevronRight className="h-2.5 w-2.5 opacity-30" />
                  <span className={cn("font-black", tenant ? "text-[#1a73e8]" : "text-slate-900")}>{tenant?.tenantName.toUpperCase() || "ALL TENANTS"}</span>
                  <ChevronRight className="h-2.5 w-2.5 opacity-30" />
                  <span className="opacity-80">OUTLETS</span>
                </div>
                <SheetTitle className="text-2xl font-black text-[#1e293b] tracking-tight">
                  {tenant ? `Outlet Management of ${tenant.tenantName}` : "Outlet Management"}
                </SheetTitle>
              </div>
            </div>
            {!isAddingNew && (
              <Button 
                size="sm" 
                className="h-10 px-5 font-black bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-lg shadow-sm transition-all active:scale-95"
                onClick={handleAddNew}
              >
                <Plus className="h-4 w-4 mr-2" /> Add New Outlet
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 flex min-h-0 overflow-hidden bg-[#f8f9fc] p-6 gap-6">
          {isAddingNew && (
            <div className="w-[400px] flex-shrink-0 bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col animate-in slide-in-from-left fade-in duration-500 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-[#1e293b]">
                    {editingOutlet ? "Edit Outlet" : "Add New Outlet"}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {editingOutlet ? "Update branch parameters" : "Define new branch parameters"}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-50" onClick={handleCloseForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1">
                {isFormLoading ? (
                  <div className="flex flex-col items-center justify-center h-full py-24 space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-[#1a73e8]" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading Details...</p>
                  </div>
                ) : (
                  <div className="px-8 py-6 space-y-8">
                    <div className="space-y-2.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Outlet Name</Label>
                      <Input 
                        placeholder="e.g. Downtown Branch" 
                        className="h-12 bg-slate-50/50 border-slate-200 focus-visible:bg-white focus-visible:ring-1 ring-[#1a73e8]/20 transition-all" 
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Slug (URL Name)</Label>
                      <Input 
                        placeholder="e.g. downtown-branch" 
                        className="h-12 bg-slate-50/50 border-slate-200 focus-visible:bg-white" 
                        value={formSlug}
                        onChange={(e) => setFormSlug(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Phone</Label>
                      <Input 
                        placeholder="+971..." 
                        className="h-12 bg-slate-50/50 border-slate-200 focus-visible:bg-white" 
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Timezone</Label>
                      <Select value={formTimezone} onValueChange={setFormTimezone}>
                        <SelectTrigger className="h-12 bg-slate-50/50 border-slate-200">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Dubai">Asia/Dubai (GMT+4)</SelectItem>
                          <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
                          <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2.5">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">City</Label>
                        <Input 
                          placeholder="Dubai" 
                          className="h-12 bg-slate-50/50 border-slate-200" 
                          value={formCity}
                          onChange={(e) => setFormCity(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Country</Label>
                        <Input 
                          placeholder="UAE" 
                          className="h-12 bg-slate-50/50 border-slate-200" 
                          value={formCountry}
                          onChange={(e) => setFormCountry(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
              {!isFormLoading && (
                <div className="p-6 border-t border-slate-50 flex gap-4 bg-slate-50/30">
                  <Button variant="outline" className="flex-1 h-12 border-slate-200 font-bold text-slate-600 hover:bg-white" onClick={handleCloseForm}>Cancel</Button>
                  <Button 
                    className="flex-1 h-12 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold shadow-lg shadow-[#1a73e8]/20 active:scale-95 transition-all"
                    onClick={handleCloseForm}
                  >
                    {editingOutlet ? "Update Branch" : "Create Branch"}
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-0">
            <div className="p-6 flex flex-col md:flex-row gap-4 border-b border-slate-50 bg-slate-50/10">
              <div className="relative flex-1 max-sm:max-w-none max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search branches..." 
                  className="pl-10 h-11 text-sm bg-white border-slate-200 focus-visible:ring-1 ring-[#1a73e8]/10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select onValueChange={(v) => setStatusFilter(v === 'all' ? null : v)} value={statusFilter || 'all'}>
                <SelectTrigger className="w-56 h-11 bg-white border-slate-200">
                  <SelectValue placeholder="Status: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Status: All</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {(searchQuery || statusFilter) && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="text-slate-400 hover:text-slate-900">
                  <FilterX className="h-4 w-4 mr-2" /> Reset
                </Button>
              )}
            </div>

            <ScrollArea className="flex-1">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-b border-slate-100">
                    <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-8 uppercase tracking-widest">
                      <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors">Name <ChevronsUpDown className="h-3 w-3 opacity-50" /></div>
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest">
                      Phone
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest text-center">
                      Users
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest">
                      Timezone
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest">
                      City / Country
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-4 uppercase tracking-widest text-center">
                      Status
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-400 h-12 px-8 text-right uppercase tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOutlets.map((outlet) => (
                    <TableRow 
                      key={outlet.id} 
                      className={cn(
                        "group hover:bg-slate-50/50 transition-all border-b border-slate-50 cursor-pointer relative",
                        editingOutlet?.id === outlet.id && "bg-[#1a73e8]/5 border-l-4 border-l-[#1a73e8]"
                      )}
                      onClick={() => handleEdit(outlet)}
                    >
                      <TableCell className="py-5 px-8">
                        <div>
                          <div className="font-extrabold text-[15px] text-[#1e293b] border-b border-transparent inline-block leading-tight mb-1 group-hover:text-[#1a73e8] transition-colors">{outlet.name}</div>
                          <div className="text-[11px] text-slate-400 font-medium tracking-tight opacity-70">slug: {outlet.slug}</div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 text-[14px] text-[#1e293b] font-extrabold">
                        {outlet.phone}
                      </TableCell>
                      <TableCell className="px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg group-hover:bg-white transition-colors">
                          <UsersIcon className="h-3.5 w-3.5 text-[#1a73e8]" />
                          <span className="text-[14px] font-black text-slate-900">{outlet.userCount || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 text-[14px] text-slate-400 font-medium">
                        {outlet.timezone}
                      </TableCell>
                      <TableCell className="px-4">
                        <div className="text-[14px] text-[#1e293b] font-extrabold leading-none mb-1">{outlet.city}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{outlet.country}</div>
                      </TableCell>
                      <TableCell className="text-center px-4">
                        <div className="flex justify-center">
                          <Badge className={cn(
                            "rounded-full px-3 py-1 text-[10px] font-bold flex items-center gap-2 border shadow-none uppercase tracking-wider",
                            outlet.status === 'Active' 
                              ? "bg-[#e1f9ef] text-[#22c55e] border-[#e1f9ef]" 
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          )}>
                            <div className={cn("h-1.5 w-1.5 rounded-full", outlet.status === 'Active' ? "bg-[#22c55e]" : "bg-slate-400")} />
                            {outlet.status}
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
                            <DropdownMenuItem className="font-bold py-2.5" onClick={(e) => { e.stopPropagation(); handleEdit(outlet); }}>
                              <Edit2 className="h-4 w-4 mr-3 text-slate-400" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive font-black py-2.5" onClick={(e) => e.stopPropagation()}>Deactivate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredOutlets.length === 0 && (
                <div className="py-32 text-center">
                  <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Store className="h-8 w-8 text-slate-200" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">No Outlets Detected</h3>
                  <p className="text-xs text-slate-500 mt-1">Refine your search or add a new branch to your portfolio.</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
