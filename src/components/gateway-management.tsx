"use client"

import * as React from "react"
import { 
  Globe,
  ShieldCheck
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Gateway } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface GatewayManagementProps {
  allGateways: Gateway[];
  setAllGateways: React.Dispatch<React.SetStateAction<Gateway[]>>;
}

const NetworkInternationalLogo = () => (
  <div className="flex items-center gap-0.5 select-none shrink-0">
    <span className="text-[#0069B1] font-black text-xl italic tracking-tighter">n</span>
    <span className="text-[#E31D1A] font-black text-xl italic -ml-0.5 tracking-tighter">{'>'}</span>
  </div>
);

const DPOLogo = () => (
  <div className="flex flex-col items-center select-none shrink-0">
    <div className="flex items-baseline">
      <span className="text-[#d81b60] font-black text-sm italic tracking-tighter">DPO</span>
      <span className="text-[#0069B1] font-bold text-[8px] ml-0.5 lowercase opacity-80">pay</span>
    </div>
    <div className="h-[1.5px] w-full bg-[#E31D1A]/30 mt-[0.5px]" />
  </div>
);

export function GatewayManagement({ allGateways, setAllGateways }: GatewayManagementProps) {
  const { toast } = useToast()

  const handleToggle = (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus
    setAllGateways(prev => prev.map(g => g.id === id ? { ...g, isEnabled: newStatus } : g))
    
    toast({
      title: newStatus ? "Gateway Enabled" : "Gateway Disabled",
      description: `The payment provider has been ${newStatus ? 'activated' : 'deactivated'}.`,
    })
  }

  return (
    <div className="p-6 md:p-10 flex flex-col h-full overflow-y-auto bg-[#f8f9fc] scrollbar-hide">
      <div className="max-w-[1400px] w-full mx-auto flex-1 flex flex-col min-h-0">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payment Gateways</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Configure and manage your financial connections across the network.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allGateways.map((gateway) => (
            <Card key={gateway.id} className={cn(
              "border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/10 bg-white rounded-2xl overflow-hidden",
              !gateway.isEnabled && "opacity-90 grayscale-[0.2]"
            )}>
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-12 flex items-center justify-center bg-slate-50/80 rounded-lg border border-slate-100 p-2 shrink-0">
                      {gateway.provider === 'DPO' ? <DPOLogo /> : <NetworkInternationalLogo />}
                    </div>
                    <h3 className="font-extrabold text-[16px] text-[#1e293b] leading-tight max-w-[180px] tracking-tight">
                      {gateway.name}
                    </h3>
                  </div>
                  <Switch 
                    checked={gateway.isEnabled} 
                    onCheckedChange={() => handleToggle(gateway.id, gateway.isEnabled)}
                    className="data-[state=checked]:bg-[#0069B1]"
                  />
                </div>

                <p className="text-[13px] text-slate-500 font-medium leading-relaxed min-h-[50px] mb-8 line-clamp-3">
                  {gateway.description}
                </p>

                <div className="mt-auto pt-2">
                  <div className="h-8 w-8 rounded-lg bg-slate-100/80 border border-slate-200/50 flex items-center justify-center text-slate-400 shadow-sm">
                    <Globe className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm max-w-2xl mb-12">
          <div className="flex items-start gap-5">
            <div className="h-11 w-11 rounded-2xl bg-[#0069B1]/5 flex items-center justify-center shrink-0 border border-[#0069B1]/10">
              <ShieldCheck className="h-5 w-5 text-[#0069B1]" />
            </div>
            <div>
              <h3 className="text-[17px] font-black text-slate-900 leading-none tracking-tight">Security & Compliance</h3>
              <p className="text-[13px] text-slate-500 mt-3 leading-relaxed font-medium">
                All connected payment environments must maintain strict PCI-DSS compliance. Disabling a gateway immediately ceases all transaction processing through that endpoint across your entire network property list.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
