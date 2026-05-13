"use client"

import * as React from "react"
import { Search, Plus, MoreHorizontal, ChevronDown, ChevronsUpDown } from "lucide-react"
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
import { Outlet } from "@/lib/types"
import { initialOutlets } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function OutletManagement() {
  const [outlets] = React.useState<Outlet[]>(initialOutlets)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)

  const filteredOutlets = outlets.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         o.phone.includes(searchQuery)
    const matchesStatus = !statusFilter || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-[32px] font-black tracking-tight text-[#1A1A1A] mb-1">Outlet Management</h1>
            <p className="text-slate-500 font-medium text-lg">Manage outlets and their addresses for each tenant.</p>
          </div>
          <Button className="h-11 rounded-lg px-6 bg-[#0071BC] hover:bg-[#005a96] text-white font-bold gap-2 text-sm shadow-sm">
            <Plus className="h-4 w-4" />
            New Outlet
          </Button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[20px] border border-slate-200 overflow-hidden shadow-sm">
          {/* Filters Bar */}
          <div className="p-4 flex flex-col md:flex-row gap-4 border-b border-slate-100">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search..." 
                className="pl-9 h-11 bg-white border-slate-200 rounded-lg w-full text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 px-4 rounded-lg bg-white border-slate-200 text-slate-500 justify-between min-w-[180px] text-sm font-medium">
                  <span>{statusFilter || "Select Status"}</span>
                  <ChevronDown className="h-4 w-4 opacity-40 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[180px] rounded-lg">
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Statuses</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('Active')}>Active</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('Inactive')}>Inactive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table */}
          <Table>
            <TableHeader className="bg-[#F8F9FA]">
              <TableRow className="hover:bg-transparent border-b border-slate-100">
                <TableHead className="text-[12px] font-bold text-slate-400 uppercase tracking-wider py-4 pl-6">
                  <div className="flex items-center gap-2">Name <ChevronsUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="text-[12px] font-bold text-slate-400 uppercase tracking-wider py-4">
                  <div className="flex items-center gap-2">Phone <ChevronsUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="text-[12px] font-bold text-slate-400 uppercase tracking-wider py-4">
                  <div className="flex items-center gap-2">Timezone <ChevronsUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="text-[12px] font-bold text-slate-400 uppercase tracking-wider py-4">
                  <div className="flex items-center gap-2">City <ChevronsUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="text-[12px] font-bold text-slate-400 uppercase tracking-wider py-4">
                  <div className="flex items-center gap-2">Country <ChevronsUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="text-[12px] font-bold text-slate-400 uppercase tracking-wider py-4">
                  <div className="flex items-center gap-2">Status <ChevronsUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="text-[12px] font-bold text-slate-400 uppercase tracking-wider py-4 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOutlets.map((outlet) => (
                <TableRow key={outlet.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                  <TableCell className="py-5 pl-6">
                    <div>
                      <div className="font-bold text-sm text-slate-900 border-b border-slate-900 w-fit leading-none mb-1 cursor-pointer">
                        {outlet.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">{outlet.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-600">{outlet.phone}</TableCell>
                  <TableCell className="text-sm font-medium text-slate-600">{outlet.timezone}</TableCell>
                  <TableCell className="text-sm font-medium text-slate-600">{outlet.city}</TableCell>
                  <TableCell className="text-sm font-medium text-slate-600">{outlet.country}</TableCell>
                  <TableCell>
                    <Badge className="bg-[#E8F5E9] text-[#2E7D32] border-none shadow-none rounded-full px-3 py-1 flex items-center w-fit gap-1.5 text-[11px] font-bold uppercase tracking-wider">
                      <div className="h-2 w-2 rounded-full bg-[#2E7D32]" />
                      {outlet.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-slate-100 bg-white shadow-sm hover:bg-slate-50">
                      <MoreHorizontal className="h-4 w-4 text-slate-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}