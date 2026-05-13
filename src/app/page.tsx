"use client"

import * as React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { TenantCard } from "@/components/tenant-card"
import { TenantForm } from "@/components/tenant-form"
import { initialTenants } from "@/lib/mock-data"
import { Tenant } from "@/lib/types"
import { SidebarProvider } from "@/components/ui/sidebar"
import { 
  Search, 
  Plus, 
  Grid2X2, 
  List, 
  ChevronDown,
  ArrowLeft
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [tenants, setTenants] = React.useState<Tenant[]>(initialTenants)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null)
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingTenant, setEditingTenant] = React.useState<Tenant | null>(null)

  const filteredTenants = tenants.filter(t => {
    const matchesSearch = 
      t.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.contactPhone.includes(searchQuery)
    
    const matchesFilter = !filterStatus || t.configurationStatus === filterStatus

    return matchesSearch && matchesFilter
  })

  const handleAddTenant = (data: Partial<Tenant>) => {
    if (editingTenant) {
      setTenants(prev => prev.map(t => t.id === editingTenant.id ? { ...t, ...data } as Tenant : t))
    } else {
      const newTenant: Tenant = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
      } as Tenant
      setTenants(prev => [newTenant, ...prev])
    }
    setIsFormOpen(false)
    setEditingTenant(null)
  }

  const openEditForm = (tenant: Tenant) => {
    setEditingTenant(tenant)
    setIsFormOpen(true)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F8F9FA]">
        <DashboardSidebar />
        
        <main className="flex-1 flex flex-col min-w-0">
          {/* Main Top Header */}
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-white border-slate-200">
                  <ArrowLeft className="h-5 w-5 text-slate-400" />
                </Button>
                <div className="flex-1" />
                <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 text-sm font-bold shadow-sm">
                  S
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-[32px] font-black tracking-tight text-[#1A1A1A] mb-1">Tenant Management</h1>
                  <p className="text-slate-500 font-medium text-lg">Manage tenants, tenant admins, and tenant configurations in one place.</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    className="h-11 rounded-lg px-6 bg-[#0071BC] hover:bg-[#005a96] text-white font-bold gap-2 text-sm shadow-sm"
                    onClick={() => {
                      setEditingTenant(null)
                      setIsFormOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add Tenant
                  </Button>
                  
                  <div className="bg-white border border-slate-200 p-1 rounded-lg flex items-center shadow-sm">
                    <Button 
                      variant="ghost"
                      size="sm" 
                      className={cn(
                        "h-9 px-4 gap-2 rounded-md font-bold text-xs transition-colors", 
                        viewMode === 'list' ? "bg-[#E3F2FD] text-[#0071BC]" : "text-slate-500"
                      )}
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                      List
                    </Button>
                    <Button 
                      variant="ghost"
                      size="sm" 
                      className={cn(
                        "h-9 px-4 gap-2 rounded-md font-bold text-xs transition-colors", 
                        viewMode === 'grid' ? "bg-[#0071BC] text-white" : "text-slate-500"
                      )}
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid2X2 className="h-4 w-4" />
                      Grid
                    </Button>
                  </div>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    placeholder="Search tenants by name, email or phone number" 
                    className="pl-12 h-14 bg-white border-slate-200 rounded-xl w-full text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-14 px-6 rounded-xl bg-white border-slate-200 text-slate-500 justify-between min-w-[200px] text-base">
                      <span>Filter by Status</span>
                      <ChevronDown className="h-5 w-5 ml-2 opacity-40" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px] rounded-xl p-2">
                    <DropdownMenuItem className="rounded-lg py-2" onClick={() => setFilterStatus(null)}>All Statuses</DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg py-2" onClick={() => setFilterStatus('Active')}>Active</DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg py-2" onClick={() => setFilterStatus('Configuration pending')}>Pending</DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg py-2" onClick={() => setFilterStatus('Inactive')}>Inactive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Content Area */}
              {filteredTenants.length > 0 ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}>
                  {filteredTenants.map((tenant) => (
                    <TenantCard 
                      key={tenant.id} 
                      tenant={tenant} 
                      viewMode={viewMode} 
                      onEdit={openEditForm}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[32px] p-24 text-center border-2 border-dashed border-slate-200">
                  <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-12 w-12 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">No tenants found</h3>
                  <p className="text-slate-500 mb-8 max-w-sm mx-auto">We couldn't find any results matching your search or filters. Try adjusting your query.</p>
                  <Button 
                    variant="outline" 
                    className="rounded-xl h-12 px-8 font-bold border-slate-200"
                    onClick={() => {setSearchQuery(""); setFilterStatus(null)}}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <TenantForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        tenant={editingTenant}
        onSubmit={handleAddTenant}
      />
    </SidebarProvider>
  )
}
