"use client"

import * as React from "react"
import { ArrowLeft, Minus, Plus, Calendar as CalendarIcon, ShieldCheck, Globe, Store, Check, Info } from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface TenantConfigurationProps {
  tenant: Tenant | null;
  allGateways: Gateway[];
  allOutlets: Outlet[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (tenantId: string, updates: Partial<Tenant>, outletUpdates?: Record<string, string[]>) => void;
}

const configTabs = [
  "Currency", 
  "Commission", 
  "Tips", 
  "Contract", 
  "Payment Gateway", 
  "Payouts", 
  "Fees", 
  "Penalties", 
  "Platform", 
  "Small Order"
]

export function TenantConfiguration({ tenant, allGateways, allOutlets, isOpen, onClose, onSave }: TenantConfigurationProps) {
  const [activeTab, setActiveTab] = React.useState("Currency")
  const [tipsEnabled, setTipsEnabled] = React.useState(true)
  const [suggestedTipRates, setSuggestedTipRates] = React.useState([5, 10, 20])
  
  const [startDate, setStartDate] = React.useState<Date | undefined>(new Date("2026-05-13"))
  const [endDate, setEndDate] = React.useState<Date | undefined>(new Date("2027-05-13"))

  const [gwMode, setGwMode] = React.useState<'global' | 'by-outlet'>('global')
  const [globalGwIds, setGlobalGwIds] = React.useState<string[]>([])
  const [outletGwMap, setOutletGwMap] = React.useState<Record<string, string[]>>({})

  const tenantOutlets = React.useMemo(() => {
    return allOutlets.filter(o => o.tenantId === tenant?.id)
  }, [allOutlets, tenant?.id])

  React.useEffect(() => {
    if (tenant && isOpen) {
      setGwMode(tenant.paymentGatewayMode || 'global')
      setGlobalGwIds(tenant.globalGatewayIds || [])
      
      const initialMap: Record<string, string[]> = {}
      tenantOutlets.forEach(o => {
        initialMap[o.id] = o.gatewayIds || []
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

  const handleToggleGlobalGw = (id: string) => {
    setGlobalGwIds(prev => 
      prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
    )
  }

  const handleToggleOutletGw = (outletId: string, gwId: string) => {
    const current = outletGwMap[outletId] || []
    const updated = current.includes(gwId) 
      ? current.filter(id => id !== gwId)
      : [...current, gwId]
    
    setOutletGwMap(prev => ({
      ...prev,
      [outletId]: updated
    }))
  }

  const handleSave = () => {
    if (!tenant) return
    
    const updates: Partial<Tenant> = {
      paymentGatewayMode: gwMode,
      globalGatewayIds: globalGwIds,
      isPaymentGatewayConfigured: (gwMode === 'global' && globalGwIds.length > 0) || (gwMode === 'by-outlet' && Object.values(outletGwMap).some(ids => ids.length > 0))
    }

    onSave(tenant.id, updates, outletGwMap)
  }

  const MultiGatewaySelector = ({ selectedIds, onToggle }: { selectedIds: string[], onToggle: (id: string) => void }) => {
    const activeGateways = allGateways.filter(g => g.isEnabled)
    
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full h-12 justify-between bg-white border-slate-200 text-sm">
            <span className="truncate">
              {selectedIds.length === 0 
                ? "Click to choose systems..." 
                : `${selectedIds.length} systems chosen`}
            </span>
            <Plus className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-2 shadow-2xl" align="start">
          <div className="space-y-1">
            <p className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Options</p>
            {activeGateways.map(g => (
              <div 
                key={g.id} 
                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                onClick={() => onToggle(g.id)}
              >
                <Checkbox checked={selectedIds.includes(g.id)} onCheckedChange={() => onToggle(g.id)} />
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-slate-900">{g.name}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{g.provider}</span>
                </div>
              </div>
            ))}
            {activeGateways.length === 0 && (
              <p className="p-4 text-center text-xs text-slate-400">No active systems found</p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  if (!tenant) return null

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[1000px] p-0 border-l border-slate-200 bg-white">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-8 bg-white border-b border-slate-200 space-y-0">
            <div className="flex items-center gap-6">
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-slate-400" />
              </button>
              <div>
                <SheetTitle className="text-2xl font-black text-slate-900 tracking-tight">
                  Settings for {tenant.tenantName}
                </SheetTitle>
                <SheetDescription className="text-sm font-medium text-slate-500 mt-1">
                  Adjust how this brand operates on our platform.
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-200">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-2">
                {configTabs.map((tab) => (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? "default" : "ghost"}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "text-[12px] font-black uppercase tracking-widest px-6 h-10 transition-all rounded-full",
                      activeTab === tab 
                        ? "bg-primary text-white shadow-md hover:bg-primary/90" 
                        : "text-slate-400 hover:text-slate-900 hover:bg-slate-200/50"
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
            <div className="p-10 max-w-4xl mx-auto space-y-12">
              
              {activeTab === "Currency" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl flex items-start gap-4">
                    <Info className="h-5 w-5 text-blue-500 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900">Currency & Location</h4>
                      <p className="text-sm text-slate-600 mt-1">Set the primary money used for sales and the local time for this brand.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[13px] font-bold text-slate-900">Which money should be used?</Label>
                      <Select defaultValue="AED">
                        <SelectTrigger className="h-12 bg-white border-slate-200 w-full text-base">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AED">UAE Dirham (د.إ)</SelectItem>
                          <SelectItem value="USD">US Dollar ($)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[13px] font-bold text-slate-900">Language and Date Format</Label>
                      <Select defaultValue="en-US">
                        <SelectTrigger className="h-12 bg-white border-slate-200 w-full text-base">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="en-GB">English (UK)</SelectItem>
                          <SelectItem value="ar-AE">Arabic (UAE)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <Label className="text-[13px] font-bold text-slate-900">Local Time Zone</Label>
                      <Select defaultValue="Asia/Dubai">
                        <SelectTrigger className="h-12 bg-white border-slate-200 w-full text-base">
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Dubai">Dubai Time (GMT+4)</SelectItem>
                          <SelectItem value="UTC">Standard World Time (UTC)</SelectItem>
                          <SelectItem value="America/New_York">New York Time (GMT-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Payment Gateway" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <div className="bg-primary/5 border border-primary/10 p-6 rounded-2xl flex items-start gap-4">
                    <ShieldCheck className="h-6 w-6 text-primary mt-1 shrink-0" />
                    <div>
                      <h4 className="font-black text-slate-900">Payment Setup</h4>
                      <p className="text-sm text-slate-600 mt-1">Decide if every location uses the same payment system or if you want to set them individually.</p>
                    </div>
                  </div>

                  <RadioGroup value={gwMode} onValueChange={(val) => setGwMode(val as any)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Label
                      htmlFor="gw-global"
                      className={cn(
                        "flex flex-col items-center justify-center rounded-2xl border-2 border-slate-100 bg-white p-8 hover:border-primary/50 cursor-pointer transition-all h-full",
                        gwMode === 'global' && "border-primary bg-primary/5"
                      )}
                    >
                      <RadioGroupItem value="global" id="gw-global" className="sr-only" />
                      <Globe className={cn("mb-4 h-8 w-8", gwMode === 'global' ? "text-primary" : "text-slate-300")} />
                      <div className="text-center">
                        <p className="font-black text-[15px] text-slate-900 uppercase tracking-wider">Same for Everyone</p>
                        <p className="text-xs text-slate-500 mt-2">Apply chosen systems to all outlets</p>
                      </div>
                    </Label>
                    <Label
                      htmlFor="gw-outlet"
                      className={cn(
                        "flex flex-col items-center justify-center rounded-2xl border-2 border-slate-100 bg-white p-8 hover:border-primary/50 cursor-pointer transition-all h-full",
                        gwMode === 'by-outlet' && "border-primary bg-primary/5"
                      )}
                    >
                      <RadioGroupItem value="by-outlet" id="gw-outlet" className="sr-only" />
                      <Store className={cn("mb-4 h-8 w-8", gwMode === 'by-outlet' ? "text-primary" : "text-slate-300")} />
                      <div className="text-center">
                        <p className="font-black text-[15px] text-slate-900 uppercase tracking-wider">Unique by Outlet</p>
                        <p className="text-xs text-slate-500 mt-2">Pick systems for each branch separately</p>
                      </div>
                    </Label>
                  </RadioGroup>

                  <div className="space-y-6 pt-4">
                    {gwMode === 'global' ? (
                      <div className="space-y-4">
                        <Label className="text-[13px] font-bold text-slate-900">Choose Global Payment Providers</Label>
                        <MultiGatewaySelector 
                          selectedIds={globalGwIds} 
                          onToggle={handleToggleGlobalGw} 
                        />
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                          <Info className="h-4 w-4 text-slate-400" />
                          <p className="text-xs text-slate-500 font-medium italic">These choices will affect all {tenantOutlets.length} locations.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                         <Label className="text-[13px] font-bold text-slate-900">Pick for each branch ({tenantOutlets.length} total)</Label>
                         <div className="grid gap-4">
                            {tenantOutlets.map(o => (
                              <div key={o.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all gap-4">
                                <div>
                                  <p className="font-extrabold text-[15px] text-slate-900 leading-none">{o.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">{o.city}, {o.country}</p>
                                </div>
                                <div className="w-full md:w-[320px]">
                                  <MultiGatewaySelector 
                                    selectedIds={outletGwMap[o.id] || []} 
                                    onToggle={(gwId) => handleToggleOutletGw(o.id, gwId)} 
                                  />
                                </div>
                              </div>
                            ))}
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "Commission" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-2xl flex items-start gap-4">
                    <Info className="h-5 w-5 text-amber-500 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900">Standard Fees</h4>
                      <p className="text-sm text-slate-600 mt-1">Set the percentage we take from every order and any fixed caps.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[13px] font-bold text-slate-900">Our Percentage (%)</Label>
                      <Input defaultValue="0" type="number" className="h-12 bg-white border-slate-200 text-lg font-bold" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[13px] font-bold text-slate-900">Maximum Fee Amount</Label>
                      <Input defaultValue="0" type="number" className="h-12 bg-white border-slate-200 text-lg font-bold" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[13px] font-bold text-slate-900">Convenience Fee (%)</Label>
                      <Input defaultValue="0" type="number" className="h-12 bg-white border-slate-200 text-lg font-bold" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[13px] font-bold text-slate-900">Convenience Fee Cap</Label>
                      <Input defaultValue="0" type="number" className="h-12 bg-white border-slate-200 text-lg font-bold" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Tips" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                   <div className="bg-green-50/50 border border-green-100 p-6 rounded-2xl flex items-start gap-4">
                    <Info className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900">Handling Tips</h4>
                      <p className="text-sm text-slate-600 mt-1">Decide if staff can receive tips and how those tips are handled.</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="space-y-1">
                      <Label htmlFor="enable-tips" className="text-base font-bold text-slate-900 leading-none">Enable Tips</Label>
                      <p className="text-sm text-slate-500">Allow customers to add gratuity to their orders.</p>
                    </div>
                    <Switch 
                      id="enable-tips" 
                      checked={tipsEnabled} 
                      onCheckedChange={setTipsEnabled}
                    />
                  </div>

                  <div className={cn("space-y-8 transition-all duration-300", !tipsEnabled && "opacity-40 pointer-events-none")}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-[13px] font-bold text-slate-900">Tip Commission (%)</Label>
                        <Input defaultValue="0" type="number" className="h-12 bg-white border-slate-200 text-lg font-bold" />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[13px] font-bold text-slate-900">Highest Tip Allowed (%)</Label>
                        <Input defaultValue="0" type="number" className="h-12 bg-white border-slate-200 text-lg font-bold" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[13px] font-bold text-slate-900">Standard Tipping Buttons (%)</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {suggestedTipRates.map((rate, index) => (
                          <div key={index} className="flex gap-3">
                            <Input 
                              type="number"
                              value={rate} 
                              onChange={(e) => handleTipRateChange(index, e.target.value)}
                              className="h-12 bg-white border-slate-200 text-lg font-bold" 
                            />
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-12 w-12 shrink-0 border-slate-200 text-slate-400 hover:text-rose-500"
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
                        className="mt-2 h-10 px-6 font-bold text-primary border-primary/20 hover:bg-primary/5"
                        onClick={handleAddTipRate}
                      >
                        + Add another tip option
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Contract" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex items-start gap-4">
                    <CalendarIcon className="h-5 w-5 text-slate-500 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900">Contract Duration</h4>
                      <p className="text-sm text-slate-600 mt-1">Specify when the partnership agreement begins and expires.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[13px] font-bold text-slate-900">Agreement Starts On</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-12 justify-between text-left font-bold text-base bg-white border-slate-200",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="h-5 w-5 text-slate-400" />
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
                    <div className="space-y-3">
                      <Label className="text-[13px] font-bold text-slate-900">Agreement Ends On</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-12 justify-between text-left font-bold text-base bg-white border-slate-200",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="h-5 w-5 text-slate-400" />
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
                </div>
              )}

              {activeTab === "Payouts" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl flex items-start gap-4">
                    <Info className="h-5 w-5 text-emerald-500 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900">Payment Schedule</h4>
                      <p className="text-sm text-slate-600 mt-1">Set how often the brand receives their accumulated sales funds.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[13px] font-bold text-slate-900">How many days between payments?</Label>
                      <Input defaultValue="0" type="number" className="h-12 bg-white border-slate-200 text-lg font-bold" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[13px] font-bold text-slate-900">Days to hold funds (Security)</Label>
                      <Input defaultValue="0" type="number" className="h-12 bg-white border-slate-200 text-lg font-bold" />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label className="text-[13px] font-bold text-slate-900">Minimum Amount to Pay Out</Label>
                      <Input defaultValue="0" type="number" className="h-12 bg-white border-slate-200 text-lg font-bold" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Fees" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-2xl flex items-start gap-4">
                    <Info className="h-5 w-5 text-indigo-500 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900">Service Fees</h4>
                      <p className="text-sm text-slate-600 mt-1">Manage extra costs for specific services like delivery, payments, and table bookings.</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-6">
                      <h5 className="font-black text-[11px] text-indigo-500 uppercase tracking-widest">Delivery Service</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[13px] font-bold text-slate-900">Delivery Fee Commission Rate (%) <span className="text-red-500">*</span></Label>
                          <Input defaultValue="0" type="number" className="h-12 bg-white border-slate-200 text-lg font-bold" />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[13px] font-bold text-slate-900">Delivery Fee Commission Cap</Label>
                          <Input defaultValue="0" type="number" className="h-12 bg-white border-slate-200 text-lg font-bold" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-6">
                      <h5 className="font-black text-[11px] text-indigo-500 uppercase tracking-widest">Payment Processing</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[13px] font-bold text-slate-900">Payment Processing Fee Rate (%)</Label>
                          <Input defaultValue="0" type="number" className="h-12 bg-white border-slate-200 text-lg font-bold" />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[13px] font-bold text-slate-900">Payment Processing Flat Fee</Label>
                          <Input defaultValue="0" type="number" className="h-12 bg-white border-slate-200 text-lg font-bold" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-6">
                      <h5 className="font-black text-[11px] text-indigo-500 uppercase tracking-widest">Table Reservations</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[13px] font-bold text-slate-900">Reservation Fee Rate (%)</Label>
                          <Input defaultValue="0" type="number" className="h-12 bg-white border-slate-200 text-lg font-bold" />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[13px] font-bold text-slate-900">Reservation Flat Fee</Label>
                          <Input defaultValue="0" type="number" className="h-12 bg-white border-slate-200 text-lg font-bold" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </ScrollArea>

          <SheetFooter className="p-8 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:justify-end gap-4 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
            <Button variant="outline" onClick={onClose} className="px-10 h-14 font-black text-slate-500 border-slate-200 hover:bg-slate-50 text-base rounded-2xl">
              Discard Changes
            </Button>
            <Button 
              onClick={handleSave}
              className="px-12 h-14 font-black bg-primary hover:bg-primary/90 text-white border-none rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 text-base"
            >
              Apply All Settings
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
