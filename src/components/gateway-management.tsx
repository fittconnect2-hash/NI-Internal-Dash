"use client"

import * as React from "react"
import { 
  CreditCard, 
  Wallet, 
  Landmark, 
  ShieldCheck, 
  Zap,
  ChevronRight,
  Info
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Gateway } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface GatewayManagementProps {
  allGateways: Gateway[];
  setAllGateways: React.Dispatch<React.SetStateAction<Gateway[]>>;
}

export function GatewayManagement({ allGateways, setAllGateways }: GatewayManagementProps) {
  const { toast } = useToast()

  const handleToggle = (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus
    setAllGateways(prev => prev.map(g => g.id === id ? { ...g, isEnabled: newStatus } : g))
    
    toast({
      title: newStatus ? "Gateway Enabled" : "Gateway Disabled",
      description: `The payment provider has been ${newStatus ? 'activated' : 'deactivated'} for your platform.`,
      variant: newStatus ? "default" : "destructive"
    })
  }

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'stripe': return <Zap className="h-6 w-6 text-primary" />
      case 'paypal': return <Wallet className="h-6 w-6 text-primary" />
      case 'adyen': return <Landmark className="h-6 w-6 text-primary" />
      default: return <CreditCard className="h-6 w-6 text-primary" />
    }
  }

  return (
    <div className="p-6 md:p-8 flex flex-col h-full overflow-hidden bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payment Gateways</h1>
            <p className="text-sm text-slate-500 mt-1">Manage global payment providers and financial connections.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allGateways.map((gateway) => (
            <Card key={gateway.id} className={cn(
              "border-slate-200 transition-all duration-300 hover:shadow-lg hover:border-primary/20",
              !gateway.isEnabled && "opacity-75 grayscale-[0.5]"
            )}>
              <CardHeader className="p-6 pb-2">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                    {getProviderIcon(gateway.provider)}
                  </div>
                  <Switch 
                    checked={gateway.isEnabled} 
                    onCheckedChange={() => handleToggle(gateway.id, gateway.isEnabled)}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <CardTitle className="text-lg font-black text-slate-900">{gateway.name}</CardTitle>
                  <Badge className={cn(
                    "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest border-none",
                    gateway.isEnabled ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"
                  )}>
                    {gateway.isEnabled ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2 space-y-6">
                <CardDescription className="text-sm leading-relaxed min-h-[40px]">
                  {gateway.description}
                </CardDescription>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Type</span>
                    <span className="text-sm font-bold text-slate-700">{gateway.type}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Currencies</span>
                    <div className="flex gap-1">
                      {gateway.supportedCurrencies.map(curr => (
                        <span key={curr} className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded">
                          {curr}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest cursor-pointer group hover:underline">
                  <Info className="h-3.5 w-3.5" />
                  View Connection Settings
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-none">Financial Compliance</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                All connected gateways must comply with PCI-DSS standards. Enabling a gateway authorizes the platform to route transactions through these providers using your secured credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
