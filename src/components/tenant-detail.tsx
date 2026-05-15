"use client"

import * as React from "react"
import { 
  Mail, 
  Phone, 
  Building2, 
  User, 
  UserPlus, 
  MoreVertical,
  ChevronRight,
  ArrowLeft,
  Globe,
  MapPinIcon,
  CalendarDays,
  MailIcon,
  PhoneIcon,
  Settings2,
  X,
  RotateCcw,
  Edit2,
  Info
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface TenantDetailProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TenantDetail({ tenant, isOpen, onClose }: TenantDetailProps) {
  const [activeTab, setActiveTab] = React.useState("overview")
  const [editingAdmin, setEditingAdmin] = React.useState<any | null>(null)
  
  // Reset tab to overview when drawer opens or tenant changes
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab("overview")
      setEditingAdmin(null)
    }
  }, [isOpen, tenant?.id])

  if (!tenant) return null

  const initials = tenant.tenantName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  const signupDate = tenant.lastLoginDate || "May 13, 2026"
  const isPending = tenant.configurationStatus === "Configuration pending"

  const mockAdmins = [
    {
      id: "a1",
      name: "Leoe Dase",
      firstName: "Leoe",
      lastName: "Dase",
      username: "@LEOE.DASE",
      email: "lisiidhan@kptac.com",
      phone: "+971 54 457 1754",
      status: "Active"
    },
    {
      id: "a2",
      name: "Saurabh Mishra",
      firstName: "Saurabh",
      lastName: "Mishra",
      username: "@SAURABH.M",
      email: "saurabh.m@example.com",
      phone: "+971 52 123 4567",
      status: "Active"
    }
  ]

  const handleEditAdmin = (admin: any) => {
    setEditingAdmin(admin)
  }

  const handleResetForm = () => {
    setEditingAdmin(null)
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="p-0 border-l border-slate-200 bg-[#f8f9fc] sm:max-w-[1200px] w-full transition-all duration-500">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-8 bg-white border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-6">
              <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-lg group transition-colors">
                <ArrowLeft className="h-6 w-6 text-slate-400 group-hover:text-slate-900" />
              </button>
              <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-extrabold text-2xl shrink-0 relative shadow-sm">
                {initials}
                <div className={cn(
                  "absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-[3px] border-white shadow-sm",
                  isPending ? "bg-amber-400" : "bg-green-500"
                )} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <SheetTitle className="text-2xl font-black text-slate-900 leading-none tracking-tight">
                    {tenant.tenantName}
                  </SheetTitle>
                  <Badge className={cn(
                    "border-none px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    isPending ? "bg-amber-100 text-amber-700" : "bg-[#e1f9ef] text-[#22c55e]"
                  )}>
                    {isPending ? "Pending" : "Active"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 opacity-80"><Building2 className="h-3 w-3" /> TENANTS</span>
                    <ChevronRight className="h-2.5 w-2.5 opacity-30" />
                    <span className="text-[#1a73e8]">{tenant.tenantName.toUpperCase()}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-tighter">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Tenant Since {signupDate}
                  </div>
                </div>
              </div>
            </div>
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <div className="bg-white px-8 border-b border-slate-200 flex-shrink-0 shadow-sm z-10">
              <TabsList className="bg-transparent h-14 p-0 gap-10 justify-start">
                <TabsTrigger 
                  value="overview" 
                  className="rounded-none border-b-[3px] border-transparent data-[state=active]:border-[#1a73e8] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-14 text-xs font-bold uppercase tracking-widest text-slate-400 data-[state=active]:text-[#1a73e8] transition-all"
                >
                  Tenant Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="admins" 
                  className="rounded-none border-b-[3px] border-transparent data-[state=active]:border-[#1a73e8] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-14 text-xs font-bold uppercase tracking-widest text-slate-400 data-[state=active]:text-[#1a73e8] transition-all"
                >
                  Tenant Admins
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="overview" className="m-0 h-full overflow-y-auto p-8 space-y-8">
                <div className="max-w-5xl mx-auto space-y-8">
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-10">
                      <div className="h-8 w-8 rounded-lg bg-blue-50/50 border border-blue-100 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-[#1a73e8]" />
                      </div>
                      <h3 className="font-extrabold text-[#1e293b] tracking-tight text-lg">Profile Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-12">
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Organization</p>
                        <p className="text-[15px] font-extrabold text-slate-900 leading-none">{tenant.tenantName}</p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Contact Person</p>
                        <p className="text-[15px] font-extrabold text-slate-900 leading-none">{tenant.contactName || "N/A"}</p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Phone</p>
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="h-3.5 w-3.5 text-slate-300" />
                          <p className="text-[15px] font-extrabold text-slate-900 leading-none">{tenant.contactPhone}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Address</p>
                        <div className="flex items-start gap-2">
                          <MapPinIcon className="h-3.5 w-3.5 text-slate-300 mt-0.5 shrink-0" />
                          <div className="space-y-1">
                            <p className="text-[15px] font-extrabold text-slate-900 leading-none">{tenant.addressLine1 || "Not Provided"}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                              {tenant.city}, {tenant.country} {tenant.zipCode}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Business Type</p>
                        <p className="text-[15px] font-extrabold text-slate-900 leading-none">{tenant.businessType || "Hospitality"}</p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Email</p>
                        <div className="flex items-center gap-2">
                          <MailIcon className="h-3.5 w-3.5 text-slate-300" />
                          <p className="text-[15px] font-extrabold text-[#1a73e8] leading-none truncate">
                            {tenant.contactEmail}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-10">
                      <div className="h-6 w-6 rounded-full border border-slate-100 flex items-center justify-center bg-slate-50">
                        <Settings2 className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <h3 className="font-extrabold text-slate-900 tracking-tight text-lg leading-none">Configuration</h3>
                    </div>

                    <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                      <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-100">
                        <Info className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="text-[15px] text-slate-400 font-medium">
                        Configuration not set for this tenant.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="admins" className="m-0 h-full flex flex-col">
                <div className="flex-1 flex min-h-0 p-8 gap-8 overflow-hidden bg-slate-50/50">
                  <div className="w-[450px] bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col min-h-0 overflow-hidden ring-1 ring-slate-100 flex-shrink-0">
                    <div className="p-6 border-b border-slate-50 flex items-center gap-3 justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#1a73e8]/10 flex items-center justify-center">
                          <UserPlus className="h-4 w-4 text-[#1a73e8]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-[#1e293b] leading-tight">
                            {editingAdmin ? "Update Profile" : "Tenant Admin"}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {editingAdmin ? "Modify Existing Admin" : "Tenant Admin Enrollment"}
                          </p>
                        </div>
                      </div>
                      {editingAdmin && (
                        <button 
                          onClick={handleResetForm}
                          className="p-1 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    <ScrollArea className="flex-1">
                      <div className="p-8 space-y-10">
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-2.5">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">First Name <span className="text-red-500 font-black">*</span></Label>
                            <Input key={editingAdmin?.id || 'new'} defaultValue={editingAdmin?.firstName || ""} placeholder="First Name" className="h-12 border-slate-200 bg-slate-50/30 focus-visible:bg-white focus-visible:ring-1 ring-[#1a73e8]/20 transition-all font-medium" />
                          </div>
                          <div className="space-y-2.5">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Name <span className="text-red-500 font-black">*</span></Label>
                            <Input key={editingAdmin?.id || 'new'} defaultValue={editingAdmin?.lastName || ""} placeholder="Last Name" className="h-12 border-slate-200 bg-slate-50/30 focus-visible:bg-white focus-visible:ring-1 ring-[#1a73e8]/20 transition-all font-medium" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-2.5">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Username <span className="text-red-500 font-black">*</span></Label>
                            <Input key={editingAdmin?.id || 'new'} defaultValue={editingAdmin?.username || ""} placeholder="@username" className="h-12 border-slate-200 bg-slate-50/30 font-bold" />
                          </div>
                          <div className="space-y-2.5">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Identity</Label>
                            <Input key={editingAdmin?.id || 'new'} defaultValue={editingAdmin?.email || ""} type="email" placeholder="admin@brand.com" className="h-12 border-slate-200 bg-slate-50/30 font-medium" />
                          </div>
                        </div>
                        {!editingAdmin && (
                          <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2.5">
                              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Password <span className="text-red-500 font-black">*</span></Label>
                              <Input type="password" placeholder="••••••••" className="h-12 border-slate-200 bg-slate-50/30" />
                            </div>
                            <div className="space-y-2.5">
                              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confirm Access <span className="text-red-500 font-black">*</span></Label>
                              <Input type="password" placeholder="••••••••" className="h-12 border-slate-200 bg-slate-50/30" />
                            </div>
                          </div>
                        )}
                        <div className="space-y-2.5">
                          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Phone <span className="text-red-500 font-black">*</span></Label>
                          <div className="flex gap-3">
                            <Select defaultValue={editingAdmin?.phone?.startsWith('+1') ? '+1' : '+971'}>
                              <SelectTrigger className="w-[110px] h-12 border-slate-200 bg-slate-50/30 font-bold">
                                <SelectValue placeholder="+971" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="+971">+971 (UAE)</SelectItem>
                                <SelectItem value="+1">+1 (USA)</SelectItem>
                                <SelectItem value="+44">+44 (UK)</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input key={editingAdmin?.id || 'new'} defaultValue={editingAdmin?.phone?.replace(/^\+\d+\s/, "") || ""} placeholder="5X XXX XXXX" className="h-12 flex-1 border-slate-200 bg-slate-50/30 font-bold tracking-widest" />
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                    <div className="p-6 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/30 flex-shrink-0">
                      <Button variant="outline" className="h-12 px-8 font-extrabold text-slate-600 border-slate-200 hover:bg-white active:scale-95 transition-all" onClick={handleResetForm}>
                        {editingAdmin ? "Cancel" : "Reset"}
                      </Button>
                      <Button className="h-12 px-8 font-extrabold bg-[#1a73e8] hover:bg-[#1557b0] text-white border-none shadow-lg shadow-[#1a73e8]/20 active:scale-95 transition-all">
                        {editingAdmin ? "Save Changes" : "Enroll Admin"}
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-0 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">Tenant Admins</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Registered Administrators</p>
                      </div>
                      <Badge className="bg-[#1a73e8]/10 text-[#1a73e8] border-none px-3 py-1 text-[10px] font-bold shadow-none">
                        {mockAdmins.length} Total
                      </Badge>
                    </div>
                    <ScrollArea className="flex-1">
                      <div className="p-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {mockAdmins.map((admin) => (
                          <div 
                            key={admin.id} 
                            onClick={() => handleEditAdmin(admin)}
                            className={cn(
                              "bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all group/card cursor-pointer",
                              editingAdmin?.id === admin.id ? "border-[#1a73e8] ring-1 ring-[#1a73e8]/10" : "border-slate-100 hover:border-[#1a73e8]/20"
                            )}
                          >
                            <div className="p-6 flex items-start justify-between">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-14 w-14 border-2 border-slate-50 shadow-sm">
                                  <AvatarFallback className="bg-[#1a73e8]/5 text-[#1a73e8] font-black text-sm">
                                    {admin.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-black text-slate-900 text-[16px] group-hover/card:text-[#1a73e8] transition-colors">{admin.name}</span>
                                  <span className="text-[11px] text-slate-400 font-bold tracking-tight uppercase">{admin.username}</span>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-1 text-slate-300 hover:text-slate-900 transition-colors" onClick={(e) => e.stopPropagation()}>
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem className="font-bold py-2.5" onClick={() => handleEditAdmin(admin)}>
                                    <Edit2 className="h-4 w-4 mr-3 text-slate-400" /> Edit Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="font-bold py-2.5">
                                    <RotateCcw className="h-4 w-4 mr-3 text-slate-400" /> Reset Password
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive font-black py-2.5">Disable User</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="px-6 py-2 space-y-4">
                              <div className="flex items-center gap-3 text-slate-500">
                                <Mail className="h-4 w-4 text-slate-300 group-hover/card:text-[#1a73e8] transition-colors" />
                                <span className="text-[14px] font-bold tracking-tight">{admin.email}</span>
                              </div>
                              <div className="flex items-center gap-3 text-slate-500">
                                <Phone className="h-4 w-4 text-slate-300 group-hover/card:text-[#1a73e8] transition-colors" />
                                <span className="text-[14px] font-bold tracking-tight">{admin.phone}</span>
                              </div>
                            </div>
                            <div className="px-6 py-6 flex justify-end items-center">
                              <Badge className="bg-[#e1f9ef] text-[#22c55e] border-none px-4 py-1 rounded-full text-[10px] font-black shadow-none uppercase tracking-widest">
                                {admin.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
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
