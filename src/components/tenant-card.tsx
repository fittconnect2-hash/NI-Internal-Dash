"use client"

import { Tenant } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Store, Users, Edit2, ExternalLink } from "lucide-react"
import { AIStatusAssistant } from "./ai-status-assistant"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface TenantCardProps {
  tenant: Tenant;
  viewMode: 'grid' | 'list';
  onEdit: (tenant: Tenant) => void;
}

export function TenantCard({ tenant, viewMode, onEdit }: TenantCardProps) {
  const isPending = tenant.configurationStatus === "Configuration pending"

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-all duration-300 border-none bg-white mb-4">
        <CardContent className="flex items-center p-4 gap-6">
          <div className="h-12 w-12 rounded-xl overflow-hidden relative shrink-0">
             <Image 
              src={tenant.imageUrl || `https://picsum.photos/seed/${tenant.id}/200/200`} 
              alt={tenant.tenantName}
              fill
              className="object-cover"
              data-ai-hint="company logo"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate">{tenant.tenantName}</h3>
            <div className="flex gap-4 mt-1">
              <span className="flex items-center text-xs text-muted-foreground gap-1">
                <Mail className="h-3 w-3" /> {tenant.contactEmail}
              </span>
              <span className="flex items-center text-xs text-muted-foreground gap-1">
                <Phone className="h-3 w-3" /> {tenant.contactPhone}
              </span>
            </div>
          </div>
          <div className="flex gap-6 items-center px-4">
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Outlets</p>
              <p className="font-bold">{tenant.numberOfOutlets}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Users</p>
              <p className="font-bold">{tenant.numberOfUsers}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-[180px] justify-end">
            <Badge 
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-bold",
                isPending ? "pending-status border-none" : "bg-green-100 text-green-700 hover:bg-green-100 border-none"
              )}
            >
              {tenant.configurationStatus}
            </Badge>
            <AIStatusAssistant tenant={tenant} />
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => onEdit(tenant)}>
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 border-none bg-white rounded-2xl overflow-hidden group">
      <CardHeader className="p-0 relative h-32 bg-slate-100">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
        <div className="absolute -bottom-6 left-6 h-16 w-16 rounded-2xl border-4 border-white overflow-hidden shadow-lg">
           <Image 
            src={tenant.imageUrl || `https://picsum.photos/seed/${tenant.id}/200/200`} 
            alt={tenant.tenantName}
            fill
            className="object-cover"
            data-ai-hint="business office"
          />
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
           <Badge 
              className={cn(
                "rounded-full px-3 py-1 text-[10px] font-bold shadow-sm",
                isPending ? "pending-status border-none" : "bg-green-100 text-green-700 hover:bg-green-100 border-none"
              )}
            >
              {tenant.configurationStatus}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-10 pb-4 px-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-xl group-hover:text-primary transition-colors leading-tight">{tenant.tenantName}</h3>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-muted-foreground gap-3">
            <div className="p-1.5 bg-muted rounded-lg">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <span className="truncate">{tenant.contactEmail}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground gap-3">
            <div className="p-1.5 bg-muted rounded-lg">
              <Phone className="h-4 w-4 text-primary" />
            </div>
            <span>{tenant.contactPhone}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground leading-none mb-1">Outlets</p>
              <p className="font-bold text-sm">{tenant.numberOfOutlets}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground leading-none mb-1">Users</p>
              <p className="font-bold text-sm">{tenant.numberOfUsers}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-slate-50 flex gap-2 justify-between items-center border-t">
        <AIStatusAssistant tenant={tenant} />
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => onEdit(tenant)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}