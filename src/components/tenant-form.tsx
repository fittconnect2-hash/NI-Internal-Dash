"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

const formSchema = z.object({
  tenantName: z.string().min(1, "Business Name is required"),
  contactName: z.string().min(1, "Contact Name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(1, "Phone number is required"),
  businessType: z.string().min(1, "Business Type is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Zip Code is required"),
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
})

interface TenantFormProps {
  tenant?: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Tenant>) => void;
}

export function TenantForm({ tenant, isOpen, onClose, onSubmit }: TenantFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantName: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      businessType: "",
      country: "",
      state: "",
      city: "",
      zipCode: "",
      addressLine1: "",
      addressLine2: "",
    },
  })

  React.useEffect(() => {
    if (tenant) {
      form.reset({
        tenantName: tenant.tenantName,
        contactName: tenant.contactName || "",
        contactEmail: tenant.contactEmail,
        contactPhone: tenant.contactPhone,
        businessType: tenant.businessType || "",
        country: tenant.country || "",
        state: tenant.state || "",
        city: tenant.city || "",
        zipCode: tenant.zipCode || "",
        addressLine1: tenant.addressLine1 || "",
        addressLine2: tenant.addressLine2 || "",
      })
    } else {
      form.reset({
        tenantName: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        businessType: "",
        country: "",
        state: "",
        city: "",
        zipCode: "",
        addressLine1: "",
        addressLine2: "",
      })
    }
  }, [tenant, form, isOpen])

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[700px] p-0 border-l border-slate-200 bg-[#f8f9fc]">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 bg-white border-b border-slate-200">
            <div className="flex items-center gap-4">
              <button 
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </button>
              <div>
                <SheetTitle className="text-xl font-bold text-slate-900">
                  {tenant ? "Edit Tenant" : "Add Tenant"}
                </SheetTitle>
                <SheetDescription className="text-sm text-slate-500">
                  {tenant ? "Update the tenant profile details." : "Create a new tenant profile."}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="p-6">
              <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <FormField
                        control={form.control}
                        name="tenantName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700">Business Name <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter the business name" {...field} className="h-11 bg-white border-slate-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700">Contact Name <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter the contact name" {...field} className="h-11 bg-white border-slate-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700">Email <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter the email address" {...field} className="h-11 bg-white border-slate-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700">Phone <span className="text-red-500">*</span></FormLabel>
                            <div className="flex gap-2">
                              <Select defaultValue="+971">
                                <SelectTrigger className="w-[100px] h-11 bg-white border-slate-200">
                                  <SelectValue placeholder="+971" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="+971">+971</SelectItem>
                                  <SelectItem value="+1">+1</SelectItem>
                                  <SelectItem value="+44">+44</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormControl>
                                <Input placeholder="Enter the phone number" {...field} className="h-11 flex-1 bg-white border-slate-200" />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="businessType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700">Business Type <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 bg-white border-slate-200">
                                  <SelectValue placeholder="Select a business type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Restaurant">Restaurant</SelectItem>
                                <SelectItem value="Cafe">Cafe</SelectItem>
                                <SelectItem value="Hotel">Hotel</SelectItem>
                                <SelectItem value="Catering">Catering</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700">Country <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 bg-white border-slate-200">
                                  <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="UAE">United Arab Emirates</SelectItem>
                                <SelectItem value="USA">United States</SelectItem>
                                <SelectItem value="UK">United Kingdom</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700">State <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter the state" {...field} className="h-11 bg-white border-slate-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700">City <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter the city" {...field} className="h-11 bg-white border-slate-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700">Zip Code <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter the zip code" {...field} className="h-11 bg-white border-slate-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="addressLine1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700">Address Line 1 <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter the street address" {...field} className="h-11 bg-white border-slate-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="addressLine2"
                        render={({ field }) => (
                          <FormItem className="col-span-1 md:col-span-2">
                            <FormLabel className="text-sm font-semibold text-slate-700">Address Line 2</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter the street address 2 (optional)" {...field} className="h-11 bg-white border-slate-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </ScrollArea>

          <SheetFooter className="p-6 bg-white border-t border-slate-200 flex sm:justify-end gap-3">
            <Button variant="outline" onClick={onClose} className="px-6 h-10 font-medium text-slate-600 border-slate-200">
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={form.handleSubmit(onSubmit)}
              className="px-6 h-10 font-medium bg-[#94b8d7] hover:bg-[#83a7c6] text-white border-none"
            >
              {tenant ? "Save Changes" : "Add Tenant"}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
