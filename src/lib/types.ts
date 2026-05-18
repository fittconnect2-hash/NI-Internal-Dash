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
  state: string;
  streetAddress: string;
  zipCode: string;
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
  role: 'Organization Admin' | 'Manager' | 'Partner Admin';
  status: 'Active' | 'Inactive' | 'Suspended';
  lastActive?: string;
}

export interface Gateway {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  provider: string;
  type: 'Credit Card' | 'Digital Wallet' | 'Bank Transfer';
  supportedCurrencies: string[];
}
