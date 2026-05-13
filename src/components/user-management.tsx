
"use client"

import * as React from "react"
import { Search, UserPlus, MoreHorizontal, ChevronRight, Building2, Store, Mail, User as UserIcon, ShieldCheck } from "lucide-react"
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
import { User, Tenant, Outlet } from "@/lib/types"
import { initialUsers } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface UserManagementProps {
  tenant?: Tenant | null;
  outlet?: Outlet | null;
  onBack: () => void;
}

export function UserManagement({ tenant, outlet, onBack }: UserManagementProps) {
  const [users] = React.useState<User[]>(initialUsers)
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTenant = !tenant || u.tenantId === tenant.id
    const matchesOutlet = !outlet || u.outletId === outlet.id
    return matchesSearch && matchesTenant && matchesOutlet
  })

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-3 mb-10 text-[11px] font-black tracking-[0.2em] text-slate-300 uppercase">
          <button onClick={onBack} className="hover:text-[#0071BC] transition-colors flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5" /> TENANT HUB
          </button>
          {tenant && (
            <>
              <ChevronRight className="h-3 w-3 opacity-30" />
              <button 
                onClick={onBack}
                className="hover:text-[#0071BC] transition-colors bg-[#E3F2FD] px-3 py-1 rounded-full text-[#0071BC]"
              >
                {tenant.tenantName}
              </button>
            </>
          )}
          {outlet && (
            <>
              <ChevronRight className="h-3 w-3 opacity-30" />
              <button 
                onClick={onBack}
                className="hover:text-slate-900 transition-colors flex items-center gap-2"
              >
                <Store className="h-3.5 w-3.5" /> {outlet.name}
              </button>
            </>
          )}
          <ChevronRight className="h-3 w-3 opacity-30" />
          <span className="text-slate-400">USERS</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-[42px] font-black tracking-tight text-[#121A26] leading-none mb-3">
              Staff Directory
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              {outlet ? `Access management for ${outlet.name}` : tenant ? `Consolidated staff list for ${tenant.tenantName}` : "Manage system users and global permissions."}
            </p>
          </div>
          <Button className="h-14 rounded-2xl px-10 bg-[#0071BC] hover:bg-[#005a96] text-white font-black gap-3 text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
            <UserPlus className="h-5 w-5" />
            ONBOARD STAFF
          </Button>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
          <div className="p-6 border-b border-slate-50 bg-white">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#0071BC] transition-colors" />
              <Input 
                placeholder="Search staff by name or email identity..." 
                className="pl-14 h-14 bg-slate-50/50 border-transparent rounded-2xl w-full text-base font-bold placeholder:text-slate-300 focus-visible:bg-white focus-visible:border-slate-100 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="hover:bg-transparent border-b border-slate-50">
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] py-6 pl-10">INDIVIDUAL PROFILE</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] py-6">AUTHORIZATION ROLE</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] py-6">ACTIVITY LOG</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] py-6">CURRENT STATUS</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] py-6 text-right pr-10">CONTROLS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-[#E3F2FD]/10 transition-colors border-b border-slate-50/50">
                    <TableCell className="py-7 pl-10">
                      <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 font-black text-base shrink-0 border border-slate-100/50 shadow-sm transition-colors group-hover:bg-[#0071BC] group-hover:text-white">
                          {user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-[17px] text-[#121A26] leading-none mb-2">{user.fullName}</span>
                          <span className="text-[11px] text-slate-400 font-black uppercase tracking-[0.15em] flex items-center gap-2 leading-none">
                            <Mail className="h-3.5 w-3.5 opacity-30" /> {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 w-fit rounded-xl border border-slate-100">
                        <ShieldCheck className={cn("h-4 w-4", user.role === 'Admin' ? "text-[#0071BC]" : "text-slate-400")} />
                        <span className="font-black text-[10px] tracking-[0.2em] uppercase text-slate-600">
                          {user.role}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-[13px] font-black text-slate-900 leading-tight mb-0.5">{user.lastActive || "Never Registered"}</div>
                      <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Portal Access</div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-white text-green-700 border border-green-100 shadow-sm rounded-lg px-4 py-2 flex items-center w-fit gap-2.5 text-[10px] font-black uppercase tracking-[0.15em]">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-10">
                      <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg transition-all">
                        <MoreHorizontal className="h-5 w-5 text-slate-300" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="py-32 text-center">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserIcon className="h-10 w-10 text-slate-200" />
              </div>
              <p className="text-slate-400 font-black text-2xl">No personnel records found</p>
              <p className="text-slate-300 font-bold mt-2">Adjust your filters or invite new team members.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
