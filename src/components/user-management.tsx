"use client"

import * as React from "react"
import { Search, UserPlus, MoreHorizontal, ChevronRight, Building2, Store, Mail, ShieldCheck } from "lucide-react"
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
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6 text-xs font-semibold text-slate-400">
          <button onClick={onBack} className="hover:text-primary transition-colors flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5" /> Tenants
          </button>
          {tenant && (
            <>
              <ChevronRight className="h-3 w-3 opacity-30" />
              <button onClick={onBack} className="text-primary hover:underline">{tenant.tenantName}</button>
            </>
          )}
          {outlet && (
            <>
              <ChevronRight className="h-3 w-3 opacity-30" />
              <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                <Store className="h-3 w-3" /> {outlet.name}
              </span>
            </>
          )}
          <ChevronRight className="h-3 w-3 opacity-30" />
          <span className="text-slate-400">Personnel</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Staff Directory</h1>
            <p className="text-sm text-slate-500 mt-1">Manage platform access and user roles.</p>
          </div>
          <Button size="sm" className="h-9 px-4 font-semibold">
            <UserPlus className="h-4 w-4 mr-2" /> Invite Staff
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-slate-50/50">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Find staff members..." 
                className="pl-9 h-9 text-sm bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 px-6">Individual Profile</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 px-4">Authorization Role</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 px-4">Activity</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 px-4">Status</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 px-6 text-right">Controls</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50 transition-colors border-b border-border">
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                          {user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-slate-900 leading-none mb-1">{user.fullName}</span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 w-fit rounded border border-slate-100">
                        <ShieldCheck className={cn("h-3.5 w-3.5", user.role === 'Admin' ? "text-primary" : "text-slate-400")} />
                        <span className="font-bold text-[10px] uppercase text-slate-600">
                          {user.role}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-bold text-slate-900 mb-0.5">{user.lastActive || "Never"}</div>
                      <div className="text-[9px] font-medium text-slate-400 uppercase">Last Login</div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-white text-green-700 border border-green-100 shadow-none rounded px-2 py-0.5 text-[10px] font-bold uppercase">
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
