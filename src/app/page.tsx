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
  Filter,
  ArrowUpDown,
  Bell,
  User
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

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
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        
        <main className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <header className="h-20 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search tenants, emails, or phone numbers..." 
                  className="pl-10 h-11 bg-slate-50 border-none rounded-xl w-full focus-visible:ring-1 focus-visible:ring-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full" />
              </Button>
              <div className="h-8 w-px bg-slate-200 mx-1" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 p-1 pl-3 pr-2 rounded-full hover:bg-slate-100">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold leading-none">Admin User</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Super Admin</p>
                    </div>
                    <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <User className="h-5 w-5" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem>Admin Logs</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              
              {/* Stats / Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-headline font-black tracking-tight mb-2">Tenants Overview</h1>
                  <p className="text-muted-foreground">Manage and monitor all active and pending tenant profiles.</p>
                </div>
                <div className="flex items-center gap-3">
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="rounded-xl h-11 border-none bg-white shadow-sm gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span>Filter By Status</span>
                        {filterStatus && <Badge className="ml-1 h-5 px-1.5">{filterStatus}</Badge>}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem onClick={() => setFilterStatus(null)}>All Statuses</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('Active')}>Active</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('Configuration pending')}>Pending</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('Inactive')}>Inactive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="bg-white p-1 rounded-xl shadow-sm flex items-center">
                    <Button 
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                      size="icon" 
                      className="rounded-lg h-9 w-9"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid2X2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                      size="icon" 
                      className="rounded-lg h-9 w-9"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button 
                    className="h-11 rounded-xl px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2"
                    onClick={() => {
                      setEditingTenant(null)
                      setIsFormOpen(true)
                    }}
                  >
                    <Plus className="h-5 w-5" />
                    Add Tenant
                  </Button>
                </div>
              </div>

              {/* Grid/List of Tenants */}
              {filteredTenants.length > 0 ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
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
                <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
                  <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No tenants found</h3>
                  <p className="text-muted-foreground mb-6">We couldn't find any results matching your search or filters.</p>
                  <Button variant="outline" onClick={() => {setSearchQuery(""); setFilterStatus(null)}}>Clear all filters</Button>
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