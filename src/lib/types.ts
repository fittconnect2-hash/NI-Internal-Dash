export interface Tenant {
  id: string;
  tenantName: string;
  configurationStatus: 'Active' | 'Inactive' | 'Configuration pending';
  contactEmail: string;
  contactPhone: string;
  lastLoginDate?: string;
  isPaymentGatewayConfigured: boolean;
  numberOfOutlets: number;
  numberOfUsers: number;
  merchantId?: string;
  additionalNotes?: string;
  imageUrl?: string;
}

export interface Outlet {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  phone: string;
  timezone: string;
  city: string;
  country: string;
  status: 'Active' | 'Inactive';
}