"use client"

import * as React from "react"
import { ArrowLeft, Minus, Plus, Calendar as CalendarIcon, ShieldCheck, Globe, Store } from "lucide-react"
import { Tenant, Gateway, Outlet } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface TenantConfigurationProps {
  tenant: Tenant | null;
  allGateways: Gateway[];
  allOutlets: Outlet[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (tenantId: string, updates: Partial<Tenant>, outletUpdates?: Record<string, string>) => void;
}

const configTabs = [
  "Currency", "Commission", "Tips", "Contract", "Gateways", "Payouts", "Fees", "Penalties", "Platform", "Small Order"
]

export function TenantConfiguration({ tenant, allGateways, allOutlets, isOpen, onClose, onSave }: TenantConfigurationProps) {
  const [activeTab, setActiveTab] = React.useState("Currency")
  const [tipsEnabled, setTipsEnabled] = React.useState(true)
  const [suggestedTipRates, setSuggestedTipRates] = React.useState([5, 10, 20])
  
  const [startDate, setStartDate] = React.useState<Date | undefined>(new Date("2026-05-13"))
  const [endDate, setEndDate] = React.useState<Date | undefined>(new Date("2027-05-13"))

  // Gateway state
  const [gwMode, setGwMode] = React.useState<'global' | 'by-outlet'>('global')
  const [globalGwId, setGlobalGwId] = React.useState<string>("")
  const [outletGwMap, setOutletGwMap] = React.useState<Record<string, string>>({})

  const tenantOutlets = React.useMemo(() => {
    return allOutlets.filter(o => o.tenantId === tenant?.id)
  }, [allOutlets, tenant?.id])

  React.useEffect(() => {
    if (tenant && isOpen) {
      setGwMode(tenant.paymentGatewayMode || 'global')
      setGlobalGwId(tenant.globalGatewayId || "")
      
      const initialMap: Record<string, string> = {}
      tenantOutlets.forEach(o => {
        initialMap[o.id] = o.gatewayId || ""
      })
      setOutletGwMap(initialMap)
    }
  }, [tenant, isOpen, tenantOutlets])

  const handleAddTipRate = () => {
    setSuggestedTipRates([...suggestedTipRates, 0])
  }

  const handleRemoveTipRate = (index: number) => {
    setSuggestedTipRates(suggestedTipRates.filter((_, i) => i !== index))
  }

  const handleTipRateChange = (index: number, value: string) => {
    const newRates = [...suggestedTipRates]
    newRates[index] = parseFloat(value) || 0
    setSuggestedTipRates(newRates)
  }

  const handleSave = () => {
    if (!tenant) return
    
    const updates: Partial<Tenant> = {
      paymentGatewayMode: gwMode,
      globalGatewayId: globalGwId,
      isPaymentGatewayConfigured: (gwMode === 'global' && !!globalGwId) || (gwMode === 'by-outlet' && Object.values(outletGwMap).some(id => !!id))
    }

    onSave(tenant.id, updates, outletGwMap)
  }

  if (!tenant) return null

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[1000px] p-0 border-l border-slate-200 bg-white">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 bg-white border-b border-slate-200 space-y-0">
            <div className="flex items-center gap-4">
              <button 
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </button>
              <div>
                <SheetTitle className="text-xl font-black text-slate-900 tracking-tight">
                  Configuration: {tenant.tenantName}
                </SheetTitle>
                <SheetDescription className="text-sm font-medium text-slate-500">
                  Manage brand settings and payment integrations.
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-2">
                {configTabs.map((tab) => (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? "default" : "ghost"}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "text-[12px] font-black uppercase tracking-widest px-6 h-9 transition-all",
                      activeTab === tab 
                        ? "bg-primary text-white shadow-md hover:bg-primary/90" 
                        : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                    )}
                    size="sm"
                  >
                    {tab}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-10 max-w-4xl space-y-10">
              {activeTab === "Currency" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Currency Code <span className="text-red-500">*</span></Label>
                    <Select defaultValue="AED">
                      <SelectTrigger className="h-11 bg-white border-slate-200 w-full">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AED">UAE Dirham (د.إ)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Locale</Label>
                    <Select defaultValue="en-US">
                      <SelectTrigger className="h-11 bg-white border-slate-200 w-full">
                        <SelectValue placeholder="Select locale" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">en-US</SelectItem>
                        <SelectItem value="en-GB">en-GB</SelectItem>
                        <SelectItem value="ar-AE">ar-AE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Timezone</Label>
                    <Select defaultValue="Asia/Dubai">
                      <SelectTrigger className="h-11 bg-white border-slate-200 w-full">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Dubai">Asia/Dubai (GMT+04:00)</SelectItem>
                        <SelectItem value="UTC">UTC (GMT+00:00)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (GMT-05:00)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {activeTab === "Gateways" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex items-start gap-4">
                    <ShieldCheck className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-black text-slate-900 text-[15px]">Payment Distribution Strategy</h4>
                      <p className="text-sm text-slate-500 mt-1">Determine how payment gateways are assigned across your brand network.</p>
                    </div>
                  </div>

                  <RadioGroup value={gwMode} onValueChange={(val) => setGwMode(val as any)} className="grid grid-cols-2 gap-4">
                    <Label
                      htmlFor="gw-global"
                      className={cn(
                        "flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all",
                        gwMode === 'global' && "border-primary ring-2 ring-primary/10"
                      )}
                    >
                      <RadioGroupItem value="global" id="gw-global" className="sr-only" />
                      <Globe className="mb-3 h-6 w-6 text-primary" />
                      <div className="text-center">
                        <p className="font-black text-[13px] uppercase tracking-wider">Global Application</p>
                        <p className="text-xs text-slate-400 mt-1">Same gateway for all outlets</p>
                      </div>
                    </Label>
                    <Label
                      htmlFor="gw-outlet"
                      className={cn(
                        "flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all",
                        gwMode === 'by-outlet' && "border-primary ring-2 ring-primary/10"
                      )}
                    >
                      <RadioGroupItem value="by-outlet" id="gw-outlet" className="sr-only" />
                      <Store className="mb-3 h-6 w-6 text-primary" />
                      <div className="text-center">
                        <p className="font-black text-[13px] uppercase tracking-wider">Specific by Outlet</p>
                        <p className="text-xs text-slate-400 mt-1">Configure each branch individually</p>
                      </div>
                    </Label>
                  </RadioGroup>

                  <div className="space-y-6 pt-4">
                    {gwMode === 'global' ? (
                      <div className="space-y-3">
                        <Label className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Select Global Provider</Label>
                        <Select value={globalGwId} onValueChange={setGlobalGwId}>
                          <SelectTrigger className="h-12 border-slate-200 bg-white">
                            <SelectValue placeholder="Choose a payment gateway..." />
                          </SelectTrigger>
                          <SelectContent>
                            {allGateways.filter(g => g.isEnabled).map(g => (
                              <SelectItem key={g.id} value={g.id} className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-bold">{g.name}</span>
                                  <span className="text-[10px] text-slate-400 uppercase font-black">{g.provider} • {g.type}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-[11px] text-slate-400 font-medium italic">This gateway will process transactions for all {tenantOutlets.length} active outlets.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                         <Label className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Outlet Mapping ({tenantOutlets.length} Branches)</Label>
                         <div className="grid gap-3">
                            {tenantOutlets.map(o => (
                              <div key={o.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-primary/20 transition-all group">
                                <div>
                                  <p className="font-extrabold text-[14px] text-slate-900 leading-none">{o.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5">{o.city}, {o.country}</p>
                                </div>
                                <Select value={outletGwMap[o.id] || "none"} onValueChange={(val) => setOutletGwMap({...outletGwMap, [o.id]: val})}>
                                  <SelectTrigger className="w-[300px] h-10 border-slate-200">
                                    <SelectValue placeholder="Assign Gateway..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">None (Disabled)</SelectItem>
                                    {allGateways.filter(g => g.isEnabled).map(g => (
                                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            ))}
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "Commission" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Order Commission Rate (%) <span className="text-red-500">*</span></Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Order Commission Cap <span className="text-red-500">*</span></Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Convenience Fee Rate (%) <span className="text-red-500">*</span></Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Convenience Fee Cap <span className="text-red-500">*</span></Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                </div>
              )}

              {activeTab === "Tips" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-end gap-2 mb-2">
                    <Label htmlFor="enable-tips" className="text-sm font-medium text-slate-500">Enable tips</Label>
                    <Switch 
                      id="enable-tips" 
                      checked={tipsEnabled} 
                      onCheckedChange={setTipsEnabled}
                    />
                  </div>

                  <div className={cn("space-y-6 transition-opacity", !tipsEnabled && "opacity-50 pointer-events-none")}>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700">Tip Commission Rate (%) <span className="text-red-500">*</span></Label>
                      <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700">Tip Commission Cap <span className="text-red-500">*</span></Label>
                      <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700">Maximum Tip Rate (%)</Label>
                      <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700">Suggested Tip Rates (%)</Label>
                      <div className="space-y-3">
                        {suggestedTipRates.map((rate, index) => (
                          <div key={index} className="flex gap-3">
                            <Input 
                              type="number"
                              value={rate} 
                              onChange={(e) => handleTipRateChange(index, e.target.value)}
                              className="h-11 bg-white border-slate-200" 
                            />
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-11 w-11 shrink-0 border-slate-200 text-slate-400 hover:text-slate-600 bg-white"
                              onClick={() => handleRemoveTipRate(index)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 text-slate-600 border-slate-200 bg-white hover:bg-slate-50 font-medium"
                        onClick={handleAddTipRate}
                      >
                        + Add Rate
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Contract" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Contract Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-11 justify-between text-left font-normal bg-white border-slate-200",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="h-4 w-4 text-slate-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Contract End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-11 justify-between text-left font-normal bg-white border-slate-200",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="h-4 w-4 text-slate-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}

              {activeTab === "Payouts" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Payout Frequency (Days)</Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Payout Hold (Days)</Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Minimum Payout Amount</Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                </div>
              )}

              {activeTab === "Fees" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Delivery Fee Commission Rate (%) <span className="text-red-500">*</span></Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Delivery Fee Commission Cap</Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Payment Processing Fee Rate (%)</Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Payment Processing Flat Fee</Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Reservation Fee Rate (%)</Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Reservation Flat Fee</Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                </div>
              )}

              {activeTab === "Penalties" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">No-Show Fee Rate (%)</Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Cancellation Fee Rate (%)</Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                </div>
              )}

              {activeTab === "Platform" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Annual Platform Fee</Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Monthly Platform Fee</Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                </div>
              )}

              {activeTab === "Small Order" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Minimum Order Amount</Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Small Order Fee</Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Small Order Threshold</Label>
                    <Input defaultValue="0" className="h-11 bg-white border-slate-200" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <SheetFooter className="p-8 bg-white border-t border-slate-200 flex sm:justify-end gap-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
            <Button variant="outline" onClick={onClose} className="px-8 h-12 font-black text-slate-500 border-slate-200 hover:bg-slate-50">
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="px-10 h-12 font-black bg-primary hover:bg-primary/90 text-white border-none rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              Apply Configuration
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
