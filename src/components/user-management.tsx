"use client"

import * as React from "react"
import { Search, UserPlus, MoreHorizontal, ChevronRight, Building2, Store, Mail, User as UserIcon } from "lucide-react"
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
        <div className="flex items-center gap-2 mb-6 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
          <button onClick={onBack} className="hover:text-primary transition-colors flex items-center gap-1.5">
            <Building2 className="h-3 w-3" /> TENANTS
          </button>
          {tenant && (
            <>
              <ChevronRight className="h-3 w-3 opacity-30" />
              <button 
                onClick={onBack}
                className="hover:text-primary transition-colors flex items-center gap-1.5"
              >
                {tenant.tenantName}
              </button>
            </>
          )}
          {outlet && (
            <>
              <ChevronRight className="h-3 w-3 opacity-30" />
              <span className="text-slate-900 flex items-center gap-1.5">
                <Store className="h-3 w-3" /> {outlet.name}
              </span>
            </>
          )}
          <ChevronRight className="h-3 w-3 opacity-30" />
          <span className="text-slate-900">USERS</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-[32px] font-black tracking-tight text-[#1A1A1A] mb-1">User Management</h1>
            <p className="text-slate-500 font-medium text-lg">
              {outlet ? `Managing personnel for ${outlet.name}` : tenant ? `All staff members for ${tenant.tenantName}` : "Manage user access and permissions."}
            </p>
          </div>
          <Button className="h-11 rounded-lg px-6 bg-[#0071BC] hover:bg-[#005a96] text-white font-bold gap-2 text-sm shadow-sm transition-all active:scale-95">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 bg-white">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by name or email..." 
                className="pl-11 h-12 bg-slate-50 border-transparent rounded-xl w-full text-sm focus-visible:bg-white focus-visible:border-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  <TableHead className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] py-5 pl-8">USER DETAILS</TableHead>
                  <TableHead className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] py-5">ROLE</TableHead>
                  <TableHead className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] py-5">LAST ACTIVE</TableHead>
                  <TableHead className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] py-5">STATUS</TableHead>
                  <TableHead className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] py-5 text-right pr-8">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                    <TableCell className="py-6 pl-8">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs shrink-0 border border-slate-200/50">
                          {user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[15px] text-slate-900 leading-none mb-1.5">{user.fullName}</span>
                          <span className="text-[12px] text-slate-400 font-medium flex items-center gap-1.5 leading-none">
                            <Mail className="h-3 w-3" /> {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-md font-black text-[10px] tracking-widest uppercase border-slate-200 text-slate-600 bg-slate-50 px-2 py-1">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-[13px] font-medium text-slate-500">{user.lastActive || "Never"}</div>
                      <div className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">System Access</div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-[#E8F5E9] text-[#2E7D32] border-none shadow-none rounded-md px-3 py-1.5 flex items-center w-fit gap-2 text-[10px] font-black uppercase tracking-widest">
                        <div className="h-2 w-2 rounded-full bg-[#2E7D32]" />
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border border-slate-100 bg-white hover:border-slate-200 shadow-sm transition-all">
                        <MoreHorizontal className="h-4 w-4 text-slate-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="py-20 text-center">
              <UserIcon className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-bold text-lg">No staff members found matching your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
