"use client"

import * as React from "react"
import { 
  Search, 
  Handshake, 
  MoreVertical, 
  Mail, 
  Phone, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Edit2,
  Trash2,
  FilterX,
  Building2,
  SlidersHorizontal
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Partner } from "@/lib/types"
import { cn } from "@/lib/utils"

const ITEMS_PER_PAGE = 8

interface PartnerListViewProps {
  allPartners: Partner[];
  setAllPartners: React.Dispatch<React.SetStateAction<Partner[]>>;
  onAddPartner: () => void;
  onEditPartner: (partner: Partner) => void;
  onDeletePartner: (id: string) => void;
}

export function PartnerListView({ allPartners, setAllPartners, onAddPartner, onEditPartner, onDeletePartner }: PartnerListViewProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)

  const filteredPartners = React.useMemo(() => {
    return allPartners.filter(p => {
      const matchesSearch = 
        p.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery)
      
      const matchesStatus = !statusFilter || p.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [allPartners, searchQuery, statusFilter])

  const totalPages = Math.ceil(filteredPartners.length / ITEMS_PER_PAGE)
  const paginatedPartners = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredPartners.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredPartners, currentPage])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])

  return (
    <div className="p-6 md:p-8 flex flex-col h-full overflow-hidden bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Partner Management</h1>
              <Badge className="bg-primary/5 text-primary border-none font-black text-[10px] uppercase px-3 py-1">
                {allPartners.length} Partners
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">Manage partner admins with platform-wide administrative access.</p>
          </div>
          <Button size="sm" className="h-10 px-6 font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-white" onClick={onAddPartner}>
            <Plus className="h-4 w-4 mr-2" /> Create Partner
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search partners by name, email or phone number" 
              className="pl-10 h-12 text-sm bg-white border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter || "all"} onValueChange={v => setStatusFilter(v === 'all' ? null : v)}>
            <SelectTrigger className="w-56 h-12 bg-white border-slate-200 font-medium">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
            {paginatedPartners.map((partner) => (
              <div key={partner.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:border-primary/10">
                <div className="p-6 bg-slate-50/50 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-col">
                      <h3 className="font-black text-slate-900 text-[16px] leading-tight truncate max-w-[150px]">
                        {partner.partnerName}
                      </h3>
                      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                        {partner.adminName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={cn(
                        "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest border-none",
                        partner.status === 'Active' ? "bg-[#e1f9ef] text-[#22c55e]" : "bg-slate-100 text-slate-500"
                      )}>
                        {partner.status}
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 text-slate-300 hover:text-slate-900 transition-colors focus:outline-none">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl shadow-2xl border-slate-200">
                          <DropdownMenuItem className="py-2.5 px-3 font-medium flex items-center gap-3 cursor-pointer">
                            <Building2 className="h-4 w-4 text-slate-400" />
                            <span>Organizations assignment</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="py-2.5 px-3 font-medium flex items-center gap-3 cursor-pointer">
                            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                            <span>Features</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Mail className="h-4 w-4 text-slate-300" />
                      <span className="text-[13px] font-medium truncate">{partner.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <Phone className="h-4 w-4 text-slate-300" />
                      <span className="text-[13px] font-bold">{partner.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-50 bg-white flex items-center justify-between">
                  <span className="text-[11px] font-bold text-primary">Partner since {partner.since}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEditPartner(partner)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDeletePartner(partner.id)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {totalPages > 1 && (
          <div className="py-6 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
              Showing <span className="text-primary">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-primary">{Math.min(currentPage * ITEMS_PER_PAGE, filteredPartners.length)}</span> of <span className="text-primary">{filteredPartners.length}</span> results
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
                      currentPage === pageNum ? "bg-primary border-primary text-white" : "text-slate-500"
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
  )
}
