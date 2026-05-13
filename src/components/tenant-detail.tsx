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
  CheckCircle2,
  ChevronRight,
  ArrowLeft
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

interface TenantDetailProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TenantDetail({ tenant, isOpen, onClose }: TenantDetailProps) {
  const [isAddingAdmin, setIsAddingAdmin] = React.useState(false)
  
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

  const handleClose = () => {
    setIsAddingAdmin(false)
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent side="right" className={cn(
        "p-0 border-l border-slate-200 bg-[#f8f9fc] transition-all duration-300",
        isAddingAdmin ? "sm:max-w-[1200px]" : "sm:max-w-[700px]"
      )}>
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

          <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
            <div className="bg-white px-6 border-b border-slate-200 flex-shrink-0">
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

            <div className="flex-1 overflow-hidden">
              <TabsContent value="overview" className="m-0 h-full overflow-y-auto p-6 space-y-6">
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

              <TabsContent value="admins" className="m-0 h-full flex flex-col">
                <div className="flex items-center justify-between p-6 flex-shrink-0">
                  <h3 className="text-lg font-bold text-slate-900">
                    {isAddingAdmin ? "Add New Tenant Admin" : "Manage Personnel"}
                  </h3>
                  {!isAddingAdmin && (
                    <Button 
                      size="sm" 
                      className="bg-[#1a73e8] hover:bg-[#1557b0] text-white gap-2 h-10 px-4 font-bold rounded-lg shadow-sm"
                      onClick={() => setIsAddingAdmin(true)}
                    >
                      <UserPlus className="h-4 w-4" />
                      Add Admin
                    </Button>
                  )}
                </div>

                <div className="flex-1 flex min-h-0 p-6 pt-0 gap-6 overflow-hidden">
                  {/* Form Section */}
                  {isAddingAdmin && (
                    <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-0 animate-in slide-in-from-left duration-300 overflow-hidden">
                      <ScrollArea className="flex-1">
                        <div className="p-8 space-y-8">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-slate-700">First Name <span className="text-red-500">*</span></Label>
                              <Input placeholder="First name" className="h-11 border-slate-200 bg-slate-50/30" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-slate-700">Last Name <span className="text-red-500">*</span></Label>
                              <Input placeholder="Last name" className="h-11 border-slate-200 bg-slate-50/30" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-slate-700">Username <span className="text-red-500">*</span></Label>
                              <Input placeholder="Enter username" className="h-11 border-slate-200 bg-slate-50/30" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-slate-700">Email Address</Label>
                              <Input type="email" placeholder="Enter email address" className="h-11 border-slate-200 bg-slate-50/30" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-slate-700">Password <span className="text-red-500">*</span></Label>
                              <Input type="password" placeholder="Enter password" className="h-11 border-slate-200 bg-slate-50/30" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-slate-700">Confirm Password <span className="text-red-500">*</span></Label>
                              <Input type="password" placeholder="Confirm password" className="h-11 border-slate-200 bg-slate-50/30" />
                            </div>
                          </div>

                          <div className="space-y-2 max-w-md">
                            <Label className="text-sm font-semibold text-slate-700">Phone Number <span className="text-red-500">*</span></Label>
                            <div className="flex gap-2">
                              <Select defaultValue="+971">
                                <SelectTrigger className="w-[100px] h-11 border-slate-200 bg-slate-50/30">
                                  <SelectValue placeholder="+971" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="+971">+971</SelectItem>
                                  <SelectItem value="+1">+1</SelectItem>
                                  <SelectItem value="+44">+44</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input placeholder="Phone number" className="h-11 flex-1 border-slate-200 bg-slate-50/30" />
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                      <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white flex-shrink-0">
                        <Button variant="outline" className="h-10 px-6 font-bold text-slate-600 border-slate-200" onClick={() => setIsAddingAdmin(false)}>
                          Cancel
                        </Button>
                        <Button className="h-10 px-6 font-bold bg-[#94b8d7] hover:bg-[#83a7c6] text-white border-none">
                          Add Admin
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* List Section */}
                  <div className={cn(
                    "bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-0 overflow-hidden",
                    isAddingAdmin ? "w-[400px]" : "flex-1"
                  )}>
                    <ScrollArea className="flex-1">
                      <div className="p-4 space-y-4">
                        {mockAdmins.map((admin) => (
                          <div 
                            key={admin.id} 
                            className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
                          >
                            <div className="p-4 flex items-start justify-between border-b border-slate-50">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-slate-100">
                                  <AvatarFallback className="bg-slate-50 text-slate-500 font-bold text-xs">
                                    {admin.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-900 text-sm">{admin.name}</span>
                                  <span className="text-[10px] text-slate-400 font-medium tracking-tight">{admin.username}</span>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 rounded-full">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="px-4 py-3 space-y-2 border-b border-slate-50">
                              <div className="flex items-center gap-2 text-slate-500">
                                <Mail className="h-3.5 w-3.5 opacity-60" />
                                <span className="text-[12px] font-medium">{admin.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-500">
                                <Phone className="h-3.5 w-3.5 opacity-60" />
                                <span className="text-[12px] font-medium">{admin.phone}</span>
                              </div>
                            </div>

                            <div className="px-4 py-2 flex justify-end bg-slate-50/30">
                              <Badge className="bg-[#22c55e] hover:bg-[#22c55e] text-white border-none px-3 py-0.5 rounded-full text-[10px] font-bold shadow-none">
                                {admin.status}
                              </Badge>
                            </div>
                          </div>
                        ))}

                        {mockAdmins.length === 0 && (
                          <div className="text-center py-20">
                            <User className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                            <p className="text-sm text-slate-500 font-medium">No tenant admins assigned.</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
