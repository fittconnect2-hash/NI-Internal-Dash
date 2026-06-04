"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Check, Shield, Layers, UserCircle } from "lucide-react"
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const COUNTRY_DATA: Record<string, { cities: string[], states: string[] }> = {
  "UAE": {
    cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"],
    states: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"]
  },
  "KSA": {
    cities: ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar", "Tabuk", "Abha"],
    states: ["Riyadh Region", "Makkah Region", "Eastern Province", "Madinah Region", "Asir Region"]
  },
  "USA": {
    cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas"],
    states: ["California", "New York", "Texas", "Florida", "Illinois", "Pennsylvania", "Ohio", "Georgia", "North Carolina"]
  },
  "UK": {
    cities: ["London", "Birmingham", "Manchester", "Glasgow", "Newcastle", "Sheffield", "Liverpool", "Leeds"],
    states: ["England", "Scotland", "Wales", "Northern Ireland"]
  }
}

const AVAILABLE_FEATURES = [
  { id: "orders", title: "Orders service access", description: "Organization can use the orders service." },
  { id: "reservations", title: "Reservations service access", description: "Organization can use the reservations service." },
  { id: "roles", title: "Custom Roles", description: "Organization can create custom roles beyond the system catalog." },
  { id: "multi-order", title: "Multi-Order View", description: "Organization can view multiple orders in a single view." },
]

const formSchema = z.object({
  partnerName: z.string().min(1, "Company name is required"),
  adminName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  phoneCountryCode: z.string().default("+971"),
  businessType: z.string().min(1, "Business type is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  address: z.string().min(1, "Street address is required"),
})

interface PartnerFormProps {
  partner?: Partner | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Partner>) => void;
}

const steps = [
  { id: 1, title: "Partner Configuration", icon: Layers },
  { id: 2, title: "Features", icon: Shield },
  { id: 3, title: "Admin Account", icon: UserCircle },
]

export function PartnerForm({ partner, isOpen, onClose, onSubmit }: PartnerFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [currentStep, setCurrentStep] = React.useState(1)
  const [selectedFeatures, setSelectedFeatures] = React.useState<string[]>([])

  const defaultValues = React.useMemo(() => ({
    partnerName: "",
    adminName: "",
    email: "",
    phone: "",
    phoneCountryCode: "+971",
    businessType: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    address: "",
  }), [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const watchCountry = form.watch("country")

  React.useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      setCurrentStep(1)
      setSelectedFeatures([])
      
      if (partner) {
        form.reset({
          partnerName: partner.partnerName,
          adminName: partner.adminName,
          email: partner.email,
          phone: partner.phone,
          phoneCountryCode: partner.phoneCountryCode || "+971",
          businessType: partner.businessType || "",
          country: partner.country || "",
          state: partner.state || "",
          city: partner.city || "",
          zipCode: partner.zipCode || "",
          address: partner.address || "",
        })
      } else {
        form.reset(defaultValues)
      }
      
      const timer = setTimeout(() => setIsLoading(false), 400)
      return () => clearTimeout(timer)
    }
  }, [partner, isOpen, defaultValues, form])

  // Handle country change to reset city/state
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "country") {
        form.setValue("city", "")
        form.setValue("state", "")
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  const handleToggleFeature = (id: string) => {
    setSelectedFeatures(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const handleToggleAllFeatures = (checked: boolean) => {
    if (checked) {
      setSelectedFeatures(AVAILABLE_FEATURES.map(f => f.id))
    } else {
      setSelectedFeatures([])
    }
  }

  const isAllSelected = selectedFeatures.length === AVAILABLE_FEATURES.length

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await form.trigger()
      if (isValid) {
        setCurrentStep(2)
      }
    } else if (currentStep === 2) {
      setCurrentStep(3)
    } else {
      form.handleSubmit(onSubmit)()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const cities = watchCountry ? COUNTRY_DATA[watchCountry]?.cities || [] : []
  const states = watchCountry ? COUNTRY_DATA[watchCountry]?.states || [] : []

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[850px] p-0 border-l border-slate-200 bg-white flex flex-col">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-8 bg-white border-b border-slate-50 flex-shrink-0">
            <div>
              <SheetTitle className="text-3xl font-black text-slate-900 tracking-tight">
                {partner ? "Edit Partner" : "Create Partner"}
              </SheetTitle>
              <SheetDescription className="text-[15px] font-medium text-slate-500 mt-1">
                Provide the partner's basic information.
              </SheetDescription>
            </div>
          </SheetHeader>

          {/* Stepper */}
          <div className="px-8 py-8 flex items-center justify-center bg-white border-b border-slate-50">
            <div className="flex items-center gap-12">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center group">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300",
                      currentStep === step.id ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : 
                      currentStep > step.id ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"
                    )}>
                      {currentStep > step.id ? <Check className="h-5 w-5 stroke-[3px]" /> : step.id}
                    </div>
                    <span className={cn(
                      "text-sm font-bold tracking-tight whitespace-nowrap transition-colors",
                      currentStep === step.id ? "text-slate-900" : "text-slate-400"
                    )}>
                      {step.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="mx-6 w-12 h-[1px] bg-slate-200" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <ScrollArea className="flex-1 bg-[#fcfcfd]">
            <div className="p-8 max-w-4xl mx-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 space-y-4">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Preparing Workspace...</p>
                </div>
              ) : (
                <Form {...form}>
                  <form className="space-y-12 animate-in fade-in duration-500">
                    {currentStep === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        {/* Company */}
                        <FormField
                          control={form.control}
                          name="partnerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[14px] font-extrabold text-slate-700 flex items-center gap-1">Company <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="Enter the company name" {...field} className="h-12 bg-white border-slate-200 focus-visible:ring-1 ring-primary/20 rounded-xl" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Name */}
                        <FormField
                          control={form.control}
                          name="adminName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[14px] font-extrabold text-slate-700">Name <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="Enter the contact name" {...field} className="h-12 bg-white border-slate-200 rounded-xl" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Email */}
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[14px] font-extrabold text-slate-700">Email <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter the email address" {...field} className="h-12 bg-white border-slate-200 rounded-xl" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Phone */}
                        <div className="space-y-2">
                          <FormLabel className="text-[14px] font-extrabold text-slate-700">Phone <span className="text-red-500">*</span></FormLabel>
                          <div className="flex gap-3">
                            <FormField
                              control={form.control}
                              name="phoneCountryCode"
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger className="w-[110px] h-12 bg-white border-slate-200 font-bold rounded-xl">
                                    <SelectValue placeholder="+971" />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-xl border-slate-200">
                                    <SelectItem value="+971">+971</SelectItem>
                                    <SelectItem value="+1">+1</SelectItem>
                                    <SelectItem value="+44">+44</SelectItem>
                                    <SelectItem value="+966">+966</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormControl className="flex-1">
                                  <Input placeholder="Enter the phone number" {...field} className="h-12 bg-white border-slate-200 rounded-xl" />
                                </FormControl>
                              )}
                            />
                          </div>
                        </div>

                        {/* Business Type */}
                        <FormField
                          control={form.control}
                          name="businessType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[14px] font-extrabold text-slate-700">Business Type <span className="text-red-500">*</span></FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl">
                                    <SelectValue placeholder="Select a business type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-xl border-slate-200">
                                  <SelectItem value="Hospitality">Hospitality</SelectItem>
                                  <SelectItem value="Retail">Retail</SelectItem>
                                  <SelectItem value="Logistics">Logistics</SelectItem>
                                  <SelectItem value="Real Estate">Real Estate</SelectItem>
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
                              <FormLabel className="text-[14px] font-extrabold text-slate-700">Country <span className="text-red-500">*</span></FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl">
                                    <SelectValue placeholder="Select a country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-xl border-slate-200">
                                  <SelectItem value="UAE">United Arab Emirates</SelectItem>
                                  <SelectItem value="KSA">Saudi Arabia</SelectItem>
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
                              <FormLabel className="text-[14px] font-extrabold text-slate-700">State / Region <span className="text-red-500">*</span></FormLabel>
                              <Select onValueChange={field.onChange} value={field.value} disabled={!watchCountry}>
                                <FormControl>
                                  <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl">
                                    <SelectValue placeholder={watchCountry ? "Select state" : "Choose country first"} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-xl border-slate-200">
                                  {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                              </Select>
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
                              <FormLabel className="text-[14px] font-extrabold text-slate-700">City <span className="text-red-500">*</span></FormLabel>
                              <Select onValueChange={field.onChange} value={field.value} disabled={!watchCountry}>
                                <FormControl>
                                  <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl">
                                    <SelectValue placeholder={watchCountry ? "Select city" : "Choose country first"} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-xl border-slate-200">
                                  {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                              </Select>
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
                              <FormLabel className="text-[14px] font-extrabold text-slate-700">Zip Code <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="Enter the zip code" {...field} className="h-12 bg-white border-slate-200 rounded-xl" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Address */}
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[14px] font-extrabold text-slate-700">Address <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="Enter the street address" {...field} className="h-12 bg-white border-slate-200 rounded-xl" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-8 animate-in slide-in-from-right duration-400">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-black text-slate-900 text-lg">Features</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-600">Select all</span>
                            <Checkbox 
                              checked={isAllSelected} 
                              onCheckedChange={handleToggleAllFeatures}
                              className="h-5 w-5 border-2 border-slate-300 data-[state=checked]:border-primary"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {AVAILABLE_FEATURES.map((feature) => {
                            const isSelected = selectedFeatures.includes(feature.id)
                            return (
                              <div 
                                key={feature.id} 
                                className={cn(
                                  "p-5 bg-white border-2 rounded-2xl flex gap-4 transition-all cursor-pointer group",
                                  isSelected ? "border-primary bg-primary/5" : "border-slate-100 hover:border-slate-200"
                                )}
                                onClick={() => handleToggleFeature(feature.id)}
                              >
                                <Checkbox 
                                  checked={isSelected} 
                                  className="mt-1 h-5 w-5 border-2 border-slate-300 data-[state=checked]:border-primary"
                                />
                                <div className="space-y-1">
                                  <p className={cn(
                                    "font-black text-[15px] leading-tight transition-colors",
                                    isSelected ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"
                                  )}>{feature.title}</p>
                                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    {feature.description}
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        <p className="text-[13px] text-slate-400 font-medium italic">
                          Select the features available to this partner.
                        </p>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-8 animate-in slide-in-from-right duration-400">
                         <div className="bg-amber-50 border border-amber-100 p-8 rounded-3xl">
                          <h4 className="font-black text-slate-900 text-lg">Administrative Account</h4>
                          <p className="text-sm text-slate-500 mt-1">Setup the primary credentials for this partner.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2.5">
                            <FormLabel className="text-[14px] font-extrabold text-slate-700">Login Username</FormLabel>
                            <Input placeholder="@partner_admin" className="h-12 rounded-xl" />
                          </div>
                          <div className="space-y-2.5">
                            <FormLabel className="text-[14px] font-extrabold text-slate-700">Account Role</FormLabel>
                            <Select defaultValue="Partner Admin">
                              <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                              <SelectContent className="rounded-xl"><SelectItem value="Partner Admin">Partner Admin</SelectItem><SelectItem value="Super Partner">Super Partner</SelectItem></SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2.5">
                            <FormLabel className="text-[14px] font-extrabold text-slate-700">New Password</FormLabel>
                            <Input type="password" placeholder="••••••••" className="h-12 rounded-xl" />
                          </div>
                          <div className="space-y-2.5">
                            <FormLabel className="text-[14px] font-extrabold text-slate-700">Verify Password</FormLabel>
                            <Input type="password" placeholder="••••••••" className="h-12 rounded-xl" />
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </Form>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <SheetFooter className="p-8 bg-white border-t border-slate-100 flex items-center justify-between sm:justify-between flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-10 h-14 font-bold text-slate-500 bg-slate-50/50 border-slate-200 rounded-xl disabled:opacity-30"
            >
              Back
            </Button>
            
            <div className="flex gap-4">
              <Button 
                variant="ghost" 
                onClick={onClose} 
                className="px-8 h-14 font-bold text-slate-500 hover:text-slate-900"
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleNext}
                className="px-12 h-14 font-black bg-[#0069B1] hover:bg-[#005a96] text-white rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95"
              >
                {currentStep === 3 ? "Complete Registration" : "Save & Next"}
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
