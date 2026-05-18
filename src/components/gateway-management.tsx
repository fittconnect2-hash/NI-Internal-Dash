"use client"

import * as React from "react"
import { 
  Globe,
  ChevronRight,
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
  <div className="flex items-center gap-1">
    <span className="text-[#0069B1] font-black text-xl">n</span>
    <span className="text-[#E31D1A] font-black text-xl">{'>'}</span>
  </div>
);

const DPOLogo = () => (
  <div className="flex flex-col items-center">
    <div className="flex items-baseline">
      <span className="text-[#1e293b] font-black text-sm italic">DPO</span>
      <span className="text-[#0069B1] font-bold text-[8px] ml-0.5">pay</span>
    </div>
    <div className="h-0.5 w-full bg-[#E31D1A]/20 mt-[1px]" />
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
    <div className="p-6 md:p-10 flex flex-col h-full overflow-hidden bg-[#f8f9fc]">
      <div className="max-w-[1400px] w-full mx-auto flex-1 flex flex-col min-h-0">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payment Gateways</h1>
          <p className="text-sm text-slate-500 mt-1">Configure and manage your financial connections.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allGateways.map((gateway) => (
            <Card key={gateway.id} className={cn(
              "border-slate-200 transition-all duration-300 hover:shadow-xl hover:border-primary/10 bg-white rounded-2xl overflow-hidden",
              !gateway.isEnabled && "opacity-80"
            )}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-12 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100 p-2">
                      {gateway.provider === 'DPO' ? <DPOLogo /> : <NetworkInternationalLogo />}
                    </div>
                    <h3 className="font-bold text-[15px] text-slate-900 leading-tight max-w-[180px]">
                      {gateway.name}
                    </h3>
                  </div>
                  <Switch 
                    checked={gateway.isEnabled} 
                    onCheckedChange={() => handleToggle(gateway.id, gateway.isEnabled)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <p className="text-sm text-slate-500 leading-relaxed min-h-[60px] mb-8">
                  {gateway.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                    <Globe className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm max-w-2xl">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-none">Security & Compliance</h3>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                All connected payment environments must maintain PCI-DSS compliance. Disabling a gateway immediately ceases all transaction processing through that endpoint across your entire network.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
