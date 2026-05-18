"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Organization } from "@/lib/types"
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
  organizationName: z.string().min(1, "Business Name is required"),
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

interface OrganizationFormProps {
  organization?: Organization | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Organization>) => void;
}

export function OrganizationForm({ organization, isOpen, onClose, onSubmit }: OrganizationFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
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
    if (isOpen) {
      setIsLoading(true)
      if (organization) {
        form.reset({
          organizationName: organization.organizationName,
          contactName: organization.contactName || "",
          contactEmail: organization.contactEmail,
          contactPhone: organization.contactPhone,
          businessType: organization.businessType || "",
          country: organization.country || "",
          state: organization.state || "",
          city: organization.city || "",
          zipCode: organization.zipCode || "",
          addressLine1: organization.addressLine1 || "",
          addressLine2: organization.addressLine2 || "",
        })
      } else {
        form.reset({
          organizationName: "",
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
      setTimeout(() => setIsLoading(false), 500)
    }
  }, [organization, form, isOpen])

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[750px] p-0 border-l border-slate-200 bg-[#f8f9fc]">
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
                  {organization ? "Edit Organization" : "Add Organization"}
                </SheetTitle>
                <SheetDescription className="text-sm font-medium text-slate-500 mt-1">
                  {organization ? "Update existing brand profile." : "Register a new hospitality partner."}
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
                    <form className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {/* Business Name */}
                        <FormField
                          control={form.control}
                          name="organizationName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] font-bold text-[#1e293b]">Business Name <span className="text-red-500 font-black">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="Enter the business name" {...field} className="h-12 bg-white border-slate-200 focus-visible:ring-1 ring-primary/20" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Contact Name */}
                        <FormField
                          control={form.control}
                          name="contactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] font-bold text-[#1e293b]">Contact Name <span className="text-red-500 font-black">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="Enter the contact name" {...field} className="h-12 bg-white border-slate-200" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Email */}
                        <FormField
                          control={form.control}
                          name="contactEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] font-bold text-[#1e293b]">Email <span className="text-red-500 font-black">*</span></FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter the email address" {...field} className="h-12 bg-white border-slate-200" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Phone */}
                        <FormField
                          control={form.control}
                          name="contactPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] font-bold text-[#1e293b]">Phone <span className="text-red-500 font-black">*</span></FormLabel>
                              <div className="flex gap-2.5">
                                <Select defaultValue="+971">
                                  <SelectTrigger className="w-[110px] h-12 bg-white border-slate-200 font-bold">
                                    <SelectValue placeholder="+971" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="+971">+971</SelectItem>
                                    <SelectItem value="+1">+1</SelectItem>
                                    <SelectItem value="+44">+44</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormControl>
                                  <Input placeholder="Enter the phone number" {...field} className="h-12 flex-1 bg-white border-slate-200" />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Business Type */}
                        <FormField
                          control={form.control}
                          name="businessType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] font-bold text-[#1e293b]">Business Type <span className="text-red-500 font-black">*</span></FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12 bg-white border-slate-200">
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

                        {/* Country */}
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] font-bold text-[#1e293b]">Country <span className="text-red-500 font-black">*</span></FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12 bg-white border-slate-200">
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

                        {/* State */}
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] font-bold text-[#1e293b]">State <span className="text-red-500 font-black">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="Enter the state" {...field} className="h-12 bg-white border-slate-200" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* City */}
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] font-bold text-[#1e293b]">City <span className="text-red-500 font-black">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="Enter the city" {...field} className="h-12 bg-white border-slate-200" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Zip Code */}
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] font-bold text-[#1e293b]">Zip Code <span className="text-red-500 font-black">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="Enter the zip code" {...field} className="h-12 bg-white border-slate-200" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Address Line 1 */}
                        <FormField
                          control={form.control}
                          name="addressLine1"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] font-bold text-[#1e293b]">Address Line 1 <span className="text-red-500 font-black">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="Enter the street address" {...field} className="h-12 bg-white border-slate-200" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Address Line 2 - Spans Full Width */}
                        <FormField
                          control={form.control}
                          name="addressLine2"
                          render={({ field }) => (
                            <FormItem className="col-span-full">
                              <FormLabel className="text-[13px] font-bold text-[#1e293b]">Address Line 2</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter the street address 2 (optional)" {...field} className="h-12 bg-white border-slate-200" />
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
              {organization ? "Save Changes" : "Add Organization"}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
