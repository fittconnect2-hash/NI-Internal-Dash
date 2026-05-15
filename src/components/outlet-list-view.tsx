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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { initialOutlets, initialTenants } from "@/lib/mock-data"
import { Outlet, Tenant } from "@/lib/types"
import { cn } from "@/lib/utils"

const ITEMS_PER_PAGE = 10

interface OutletListViewProps {
  onViewUsers: (outlet: Outlet) => void;
}

export function OutletListView({ onViewUsers }: OutletListViewProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [tenantFilter, setTenantFilter] = React.useState<string | null>(null)
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  
  const [tenantSearch, setTenantSearch] = React.useState("")
  const [isTenantPopoverOpen, setIsTenantPopoverOpen] = React.useState(false)

  // Edit State
  const [editingOutlet, setEditingOutlet] = React.useState<Outlet | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = React.useState(false)
  const [isFormLoading, setIsFormLoading] = React.useState(false)

  // Form State
  const [formName, setFormName] = React.useState("")
  const [formSlug, setFormSlug] = React.useState("")
  const [formPhone, setFormPhone] = React.useState("")
  const [formTimezone, setFormTimezone] = React.useState("")
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
    }
  }, [editingOutlet])

  // Calculate outlet counts for each tenant for the filter
  const tenantsWithCounts = React.useMemo(() => {
    return initialTenants.map(tenant => ({
      ...tenant,
      count: initialOutlets.filter(o => o.tenantId === tenant.id).length
    })).filter(tenant => tenant.count > 0)
  }, [])

  const filteredTenantsForDropdown = React.useMemo(() => {
    return tenantsWithCounts.filter(t => 
      t.tenantName.toLowerCase().includes(tenantSearch.toLowerCase())
    )
  }, [tenantsWithCounts, tenantSearch])

  const filteredOutlets = React.useMemo(() => {
    return initialOutlets.filter(outlet => {
      const matchesSearch = outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           outlet.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           outlet.phone.includes(searchQuery)
      const matchesTenant = !tenantFilter || outlet.tenantId === tenantFilter
      const matchesStatus = !statusFilter || outlet.status === statusFilter
      return matchesSearch && matchesTenant && matchesStatus
    })
  }, [searchQuery, tenantFilter, statusFilter])

  // Pagination logic
  const totalPages = Math.ceil(filteredOutlets.length / ITEMS_PER_PAGE)
  const paginatedOutlets = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredOutlets.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredOutlets, currentPage])

  // Reset page when filtering/searching
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, tenantFilter, statusFilter])

  const handleEdit = (outlet: Outlet) => {
    setEditingOutlet(outlet)
    setIsEditSheetOpen(true)
    setIsFormLoading(true)
    // Simulate a loading delay
    setTimeout(() => {
      setIsFormLoading(false)
    }, 800)
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
            <p className="text-sm text-slate-500 mt-1">Monitor and organize your global brand properties and locations.</p>
          </div>
          <Button size="sm" className="h-10 px-6 font-black bg-[#1a73e8] hover:bg-[#1557b0] shadow-lg shadow-[#1a73e8]/20">
            <Plus className="h-4 w-4 mr-2" /> Add Outlet
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Search Outlets</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input 
                  placeholder="Name, city or phone..." 
                  className="pl-9 h-11 text-sm bg-white border-slate-200 focus-visible:ring-1 ring-[#1a73e8]/20" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Filter by Tenants</label>
              <Popover open={isTenantPopoverOpen} onOpenChange={setIsTenantPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    role="combobox"
                    className="w-full h-11 justify-between bg-white border-slate-200 text-sm font-medium px-3"
                  >
                    <span className="truncate">
                      {tenantFilter 
                        ? tenantsWithCounts.find(t => t.id === tenantFilter)?.tenantName 
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
                  <ScrollArea className="h-72">
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
                            setIsTenantPopoverOpen(false);
                            setTenantSearch("");
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4 text-[#1a73e8]", tenantFilter === t.id ? "opacity-100" : "opacity-0")} />
                          <span className="truncate flex-1 text-left">{t.tenantName}</span>
                          <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            {t.count} {t.count === 1 ? 'Outlet' : 'Outlets'}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
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
                {paginatedOutlets.map((outlet) => (
                  <TableRow 
                    key={outlet.id} 
                    className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 cursor-pointer"
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
                        <Users className="h-3.5 w-3.5 text-[#1a73e8]" />
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
                    <TableCell className="px-4">
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
                            className="h-9 w-9 rounded-full hover:bg-white border border-transparent hover:border-slate-100 text-slate-400" 
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
              <div className="py-24 text-center">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <Store className="h-8 w-8 text-slate-200" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">No Outlets Detected</h3>
                <p className="text-xs text-slate-500 mt-1">Adjust your filters or add a new branch to your network.</p>
              </div>
            )}
          </ScrollArea>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                Showing <span className="text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredOutlets.length)}</span> of <span className="text-slate-900">{filteredOutlets.length}</span> outlets
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

      {/* Edit Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[450px] p-0 border-l border-slate-200 bg-white flex flex-col">
          <SheetHeader className="p-6 border-b border-slate-50">
            <SheetTitle className="text-xl font-black text-[#1e293b]">Edit Outlet Info</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1">
            {isFormLoading ? (
              <div className="flex flex-col items-center justify-center h-full py-24 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-[#1a73e8]" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading Details...</p>
              </div>
            ) : (
              <div className="p-8 space-y-8">
                <div className="space-y-2.5">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Outlet Name</Label>
                  <Input 
                    value={formName} 
                    onChange={(e) => setFormName(e.target.value)} 
                    className="h-12 bg-slate-50/50 border-slate-200" 
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Slug</Label>
                  <Input 
                    value={formSlug} 
                    onChange={(e) => setFormSlug(e.target.value)} 
                    className="h-12 bg-slate-50/50 border-slate-200" 
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</Label>
                  <Input 
                    value={formPhone} 
                    onChange={(e) => setFormPhone(e.target.value)} 
                    className="h-12 bg-slate-50/50 border-slate-200" 
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timezone</Label>
                  <Input 
                    value={formTimezone} 
                    onChange={(e) => setFormTimezone(e.target.value)} 
                    className="h-12 bg-slate-50/50 border-slate-200" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">City</Label>
                    <Input 
                      value={formCity} 
                      onChange={(e) => setFormCity(e.target.value)} 
                      className="h-12 bg-slate-50/50 border-slate-200" 
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Country</Label>
                    <Input 
                      value={formCountry} 
                      onChange={(e) => setFormCountry(e.target.value)} 
                      className="h-12 bg-slate-50/50 border-slate-200" 
                    />
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
          {!isFormLoading && (
            <div className="p-6 border-t border-slate-100 flex gap-4 bg-slate-50/30">
              <Button variant="outline" className="flex-1 h-12" onClick={() => setIsEditSheetOpen(false)}>Cancel</Button>
              <Button 
                className="flex-1 h-12 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold"
                onClick={() => setIsEditSheetOpen(false)}
              >
                Save Changes
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
