"use client"

import * as React from "react"
import { Search, UserPlus, MoreHorizontal, ChevronRight, ArrowLeft } from "lucide-react"
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
        <div className="flex items-center gap-2 mb-6 text-sm text-slate-400 font-bold tracking-wider">
          <button onClick={onBack} className="hover:text-primary flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> BACK
          </button>
          {tenant && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-slate-900">{tenant.tenantName}</span>
            </>
          )}
          {outlet && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-slate-900">{outlet.name}</span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-[32px] font-black tracking-tight text-[#1A1A1A] mb-1">User Management</h1>
            <p className="text-slate-500 font-medium text-lg">
              {outlet ? `Viewing users for ${outlet.name}` : tenant ? `Viewing all users for ${tenant.tenantName}` : "Manage all users across the platform."}
            </p>
          </div>
          <Button className="h-11 rounded-lg px-6 bg-[#0071BC] hover:bg-[#005a96] text-white font-bold gap-2 text-sm shadow-sm">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        <div className="bg-white rounded-[20px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search users..." 
                className="pl-9 h-11 bg-white border-slate-200 rounded-lg w-full text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader className="bg-[#F8F9FA]">
              <TableRow className="hover:bg-transparent border-b border-slate-100">
                <TableHead className="text-[12px] font-bold text-slate-400 uppercase tracking-wider py-4 pl-6">Full Name</TableHead>
                <TableHead className="text-[12px] font-bold text-slate-400 uppercase tracking-wider py-4">Email</TableHead>
                <TableHead className="text-[12px] font-bold text-slate-400 uppercase tracking-wider py-4">Role</TableHead>
                <TableHead className="text-[12px] font-bold text-slate-400 uppercase tracking-wider py-4">Last Active</TableHead>
                <TableHead className="text-[12px] font-bold text-slate-400 uppercase tracking-wider py-4">Status</TableHead>
                <TableHead className="text-[12px] font-bold text-slate-400 uppercase tracking-wider py-4 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                  <TableCell className="py-5 pl-6 font-bold text-sm text-slate-900">{user.fullName}</TableCell>
                  <TableCell className="text-sm font-medium text-slate-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-md font-bold text-[10px] tracking-wider uppercase border-slate-200">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-400">{user.lastActive || "Never"}</TableCell>
                  <TableCell>
                    <Badge className="bg-[#E8F5E9] text-[#2E7D32] border-none shadow-none rounded-full px-3 py-1 flex items-center w-fit gap-1.5 text-[11px] font-bold uppercase tracking-wider">
                      <div className="h-2 w-2 rounded-full bg-[#2E7D32]" />
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-slate-100">
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
