
"use client"

import * as React from "react"
import { ArrowLeft } from "lucide-react"
import { Tenant } from "@/lib/types"
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
import { cn } from "@/lib/utils"

interface TenantConfigurationProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const configTabs = [
  "Currency", "Commission", "Tips", "Contract", "Payouts", "Fees", "Penalties", "Platform", "Small Order"
]

export function TenantConfiguration({ tenant, isOpen, onClose, onSave }: TenantConfigurationProps) {
  const [activeTab, setActiveTab] = React.useState("Currency")

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
                <SheetTitle className="text-xl font-bold text-slate-900">
                  Tenant Configuration
                </SheetTitle>
                <SheetDescription className="text-sm text-slate-500">
                  Update tenant configuration.
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
                      activeTab === tab 
                        ? "bg-white text-slate-900 border border-slate-200 shadow-sm hover:bg-white" 
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
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
            <div className="p-8 max-w-4xl space-y-8">
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
              
              {!["Currency", "Commission"].includes(activeTab) && (
                <div className="py-20 text-center space-y-2">
                  <h4 className="font-bold text-slate-900">{activeTab} Settings</h4>
                  <p className="text-sm text-slate-500">Configuration options for {activeTab.toLowerCase()} will appear here.</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <SheetFooter className="p-6 bg-white border-t border-slate-200 flex sm:justify-end gap-3">
            <Button variant="outline" onClick={onClose} className="px-6 h-10 font-medium text-slate-600 border-slate-200">
              Cancel
            </Button>
            <Button 
              onClick={() => onSave({})}
              className="px-6 h-10 font-medium bg-[#1a73e8] hover:bg-[#1557b0] text-white border-none rounded-md"
            >
              Save Tenant Configuration
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
