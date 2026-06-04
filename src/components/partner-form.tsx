"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Partner } from "@/lib/types"
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

const formSchema = z.object({
  partnerName: z.string().min(1, "Partner Name is required"),
  adminName: z.string().min(1, "Admin Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
})

interface PartnerFormProps {
  partner?: Partner | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Partner>) => void;
}

export function PartnerForm({ partner, isOpen, onClose, onSubmit }: PartnerFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partnerName: "",
      adminName: "",
      email: "",
      phone: "",
    },
  })

  React.useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      if (partner) {
        form.reset({
          partnerName: partner.partnerName,
          adminName: partner.adminName,
          email: partner.email,
          phone: partner.phone,
        })
      } else {
        form.reset({
          partnerName: "",
          adminName: "",
          email: "",
          phone: "",
        })
      }
      setTimeout(() => setIsLoading(false), 500)
    }
  }, [partner, form, isOpen])

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[600px] p-0 border-l border-slate-200 bg-[#f8f9fc]">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-8 bg-white border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-4">
              <button 
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-slate-400 hover:text-slate-900" />
              </button>
              <div>
                <SheetTitle className="text-2xl font-black text-slate-900 tracking-tight">
                  {partner ? "Edit Partner" : "Create Partner"}
                </SheetTitle>
                <SheetDescription className="text-sm font-medium text-slate-500 mt-1">
                  {partner ? "Update partner administrative profile." : "Enroll a new platform administrative partner."}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="p-8">
              <div className="bg-white rounded-[24px] border border-slate-100 p-10 shadow-sm ring-1 ring-slate-100/50">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-40 space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Preparing Form...</p>
                  </div>
                ) : (
                  <Form {...form}>
                    <form className="space-y-8">
                      <FormField
                        control={form.control}
                        name="partnerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[13px] font-bold text-[#1e293b]">Partner Identity <span className="text-red-500 font-black">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter partner or company name" {...field} className="h-12 bg-white border-slate-200 focus-visible:ring-1 ring-primary/20" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="adminName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[13px] font-bold text-[#1e293b]">Admin Name <span className="text-red-500 font-black">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter primary administrator name" {...field} className="h-12 bg-white border-slate-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] font-bold text-[#1e293b]">Email <span className="text-red-500 font-black">*</span></FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="admin@partner.com" {...field} className="h-12 bg-white border-slate-200" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] font-bold text-[#1e293b]">Phone <span className="text-red-500 font-black">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="+971..." {...field} className="h-12 bg-white border-slate-200" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </form>
                  </Form>
                )}
              </div>
            </div>
          </ScrollArea>

          <SheetFooter className="p-8 bg-white border-t border-slate-100 flex sm:justify-end gap-4 flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="px-8 h-12 font-bold text-slate-500 border-slate-200 hover:bg-slate-50 active:scale-95 transition-all"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={form.handleSubmit(onSubmit)}
              className="px-10 h-12 font-black bg-primary hover:bg-primary/90 text-white border-none shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              {partner ? "Save Changes" : "Create Partner"}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
