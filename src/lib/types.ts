export interface Tenant {
  id: string;
  tenantName: string; // Business Name
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  businessType: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  addressLine1: string;
  addressLine2?: string;
  configurationStatus: 'Active' | 'Inactive' | 'Configuration pending';
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
  userCount: number;
}

export interface User {
  id: string;
  tenantId: string;
  outletId?: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: 'Admin' | 'Manager' | 'Staff';
  status: 'Active' | 'Inactive';
  lastActive?: string;
}
