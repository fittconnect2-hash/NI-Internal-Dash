"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Tenant } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  tenantName: z.string().min(2, "Name must be at least 2 characters"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(5, "Phone is required"),
  configurationStatus: z.enum(["Active", "Inactive", "Configuration pending"]),
  isPaymentGatewayConfigured: z.boolean().default(false),
  numberOfOutlets: z.coerce.number().min(0),
  numberOfUsers: z.coerce.number().min(0),
  merchantId: z.string().optional(),
  additionalNotes: z.string().optional(),
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
      contactEmail: "",
      contactPhone: "",
      configurationStatus: "Configuration pending",
      isPaymentGatewayConfigured: false,
      numberOfOutlets: 0,
      numberOfUsers: 0,
      merchantId: "",
      additionalNotes: "",
    },
  })

  React.useEffect(() => {
    if (tenant) {
      form.reset({
        tenantName: tenant.tenantName,
        contactEmail: tenant.contactEmail,
        contactPhone: tenant.contactPhone,
        configurationStatus: tenant.configurationStatus,
        isPaymentGatewayConfigured: tenant.isPaymentGatewayConfigured,
        numberOfOutlets: tenant.numberOfOutlets,
        numberOfUsers: tenant.numberOfUsers,
        merchantId: tenant.merchantId || "",
        additionalNotes: tenant.additionalNotes || "",
      })
    } else {
      form.reset({
        tenantName: "",
        contactEmail: "",
        contactPhone: "",
        configurationStatus: "Configuration pending",
        isPaymentGatewayConfigured: false,
        numberOfOutlets: 0,
        numberOfUsers: 0,
        merchantId: "",
        additionalNotes: "",
      })
    }
  }, [tenant, form, isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>{tenant ? "Edit Tenant Profile" : "Add New Tenant"}</DialogTitle>
          <DialogDescription>
            {tenant ? "Update the details for this tenant." : "Enter the details to create a new tenant record."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tenantName"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Tenant Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tenant name" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="configurationStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Configuration pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="merchantId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Merchant ID</FormLabel>
                    <FormControl>
                      <Input placeholder="M-XXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numberOfOutlets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outlets</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numberOfUsers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Users</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isPaymentGatewayConfigured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Payment Gateway Configured</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any additional information..." className="resize-none h-20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {tenant ? "Save Changes" : "Create Tenant"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}