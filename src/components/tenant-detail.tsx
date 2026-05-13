"use client"

import * as React from "react"
import { 
  X, 
  Mail, 
  Phone, 
  Building2, 
  User, 
  MapPin, 
  Settings, 
  UserPlus, 
  MoreVertical,
  CheckCircle2
} from "lucide-react"
import { Tenant } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface TenantDetailProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TenantDetail({ tenant, isOpen, onClose }: TenantDetailProps) {
  if (!tenant) return null

  const initials = tenant.tenantName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  const signupDate = tenant.lastLoginDate || "May 13, 2026"
  const isPending = tenant.configurationStatus === "Configuration pending"

  // Mock admin data for the detail view
  const mockAdmins = [
    {
      id: "a1",
      name: "Leoe Dase",
      username: "@risiidhan@kptac.com",
      email: "risiidhan@kptac.com",
      phone: "+971544571754",
      status: "Active"
    }
  ]

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[700px] p-0 border-l border-slate-200 bg-[#f8f9fc]">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 bg-white border-b border-slate-200 relative">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium text-lg shrink-0 relative">
                {initials}
                <div className={cn(
                  "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
                  isPending ? "bg-amber-400" : "bg-green-500"
                )} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <SheetTitle className="text-2xl font-bold text-slate-900 leading-tight">
                    {tenant.tenantName}
                  </SheetTitle>
                  <Badge className={cn(
                    "border-none px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
                    isPending ? "bg-amber-100 text-amber-700" : "bg-[#22c55e] text-white"
                  )}>
                    {isPending ? "Pending" : "Active"}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500">Tenant since {signupDate}</p>
              </div>
            </div>
          </SheetHeader>

          <Tabs defaultValue="overview" className="flex-1 flex flex-col">
            <div className="bg-white px-6 border-b border-slate-200">
              <TabsList className="bg-transparent h-12 p-0 gap-8 justify-start">
                <TabsTrigger 
                  value="overview" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 text-sm font-medium text-slate-500 data-[state=active]:text-slate-900"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="admins" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 text-sm font-medium text-slate-500 data-[state=active]:text-slate-900"
                >
                  Tenant Admins
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="overview" className="m-0 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-5 w-5 rounded bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <User className="h-3 w-3 text-slate-400" />
                    </div>
                    <h3 className="font-bold text-slate-900">Contact Information</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Company</p>
                      <p className="text-sm font-semibold text-slate-900">{tenant.tenantName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Business Type</p>
                      <p className="text-sm font-semibold text-slate-900">{tenant.businessType || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contact Person</p>
                      <p className="text-sm font-semibold text-slate-900">{tenant.contactName || tenant.tenantName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                      <p className="text-sm font-semibold text-slate-900 text-[#1a73e8]">{tenant.contactEmail}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                      <p className="text-sm font-semibold text-slate-900">{tenant.contactPhone}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Address</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {tenant.addressLine1 ? `${tenant.addressLine1}, ${tenant.city}` : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-5 w-5 rounded bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <Settings className="h-3 w-3 text-slate-400" />
                    </div>
                    <h3 className="font-bold text-slate-900">Configuration</h3>
                  </div>
                  
                  <div className="py-12 flex items-center justify-center">
                    <p className="text-sm text-slate-400 font-medium italic">
                      Configuration not set for this tenant.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="admins" className="m-0 space-y-4">
                <div className="flex justify-end pt-2">
                  <Button size="sm" className="bg-[#1a73e8] hover:bg-[#1557b0] text-white gap-2 h-10 px-4 font-bold rounded-lg shadow-sm">
                    <UserPlus className="h-4 w-4" />
                    Add Admin
                  </Button>
                </div>

                <div className="space-y-4 pt-2">
                  {mockAdmins.map((admin) => (
                    <div 
                      key={admin.id} 
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
                    >
                      {/* Top Bar with Profile */}
                      <div className="p-6 flex items-start justify-between border-b border-slate-50">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border border-slate-100">
                            <AvatarFallback className="bg-slate-50 text-slate-500 font-bold">
                              {admin.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-lg">{admin.name}</span>
                            <span className="text-xs text-slate-400 font-medium tracking-tight mt-0.5">{admin.username}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 rounded-full">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Middle section: Contact Details */}
                      <div className="px-6 py-4 space-y-3 border-b border-slate-50">
                        <div className="flex items-center gap-3 text-slate-500">
                          <Mail className="h-4 w-4 opacity-70" />
                          <span className="text-sm font-medium">{admin.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                          <Phone className="h-4 w-4 opacity-70" />
                          <span className="text-sm font-medium">{admin.phone}</span>
                        </div>
                      </div>

                      {/* Bottom Bar: Status */}
                      <div className="px-6 py-4 flex justify-end bg-slate-50/30">
                        <Badge className="bg-[#22c55e] hover:bg-[#22c55e] text-white border-none px-4 py-1.5 rounded-full text-[11px] font-bold shadow-sm">
                          {admin.status}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {mockAdmins.length === 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center py-20">
                      <User className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                      <p className="text-sm text-slate-500 font-medium">No tenant admins assigned.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
