"use client"

import * as React from "react"
import { Sparkles, AlertCircle, CheckCircle2, Loader2, Info } from "lucide-react"
import { tenantIssueAssistant, type TenantIssueAssistantOutput } from "@/ai/flows/tenant-issue-assistant"
import { Tenant } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AIStatusAssistantProps {
  tenant: Tenant;
}

export function AIStatusAssistant({ tenant }: AIStatusAssistantProps) {
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<TenantIssueAssistantOutput | null>(null)
  const [isOpen, setIsOpen] = React.useState(false)

  const analyzeTenant = async () => {
    setLoading(true)
    try {
      const output = await tenantIssueAssistant({
        tenantName: tenant.tenantName,
        configurationStatus: tenant.configurationStatus,
        contactEmail: tenant.contactEmail,
        contactPhone: tenant.contactPhone,
        lastLoginDate: tenant.lastLoginDate,
        isPaymentGatewayConfigured: tenant.isPaymentGatewayConfigured,
        numberOfOutlets: tenant.numberOfOutlets,
        numberOfUsers: tenant.numberOfUsers,
        merchantId: tenant.merchantId,
        additionalNotes: tenant.additionalNotes,
      })
      setResult(output)
    } catch (error) {
      console.error("AI Analysis failed", error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (isOpen && !result && !loading) {
      analyzeTenant()
    }
  }, [isOpen])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full gap-2 border-primary/20 hover:border-primary/50 text-primary transition-all duration-300"
        >
          <Sparkles className="h-4 w-4" />
          AI Review
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-hidden shadow-2xl rounded-2xl border-primary/10">
        <div className="bg-primary p-4 text-primary-foreground">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Status Assistant
            </h3>
            {loading && <Loader2 className="h-4 w-4 animate-spin opacity-70" />}
          </div>
          <p className="text-xs text-primary-foreground/80 mt-1">
            Analyzing {tenant.tenantName} configuration...
          </p>
        </div>

        <ScrollArea className="max-h-[350px] p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground animate-pulse">Consulting AI experts...</p>
            </div>
          ) : result && result.issues.length > 0 ? (
            <div className="space-y-4">
              {result.issues.map((issue, idx) => (
                <div key={idx} className="space-y-2 border-b pb-3 last:border-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-sm leading-tight">{issue.description}</span>
                    <Badge variant={issue.priority === 'High' ? 'destructive' : 'secondary'} className="text-[10px] h-5 px-1.5 uppercase tracking-wider font-bold">
                      {issue.priority}
                    </Badge>
                  </div>
                  <div className="bg-muted/50 p-2 rounded-lg text-xs flex gap-2 items-start">
                    <Info className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
                    <p>{issue.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : result && result.issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sm">Everything looks great!</p>
                <p className="text-xs text-muted-foreground">No configuration issues were detected for this tenant.</p>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">
              <Button variant="ghost" size="sm" onClick={analyzeTenant}>Retry Analysis</Button>
            </div>
          )}
        </ScrollArea>
        
        <div className="p-3 bg-muted/30 border-t">
          <Button 
            variant="ghost" 
            className="w-full text-xs h-8 text-muted-foreground hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Close Assistant
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}