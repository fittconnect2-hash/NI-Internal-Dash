export interface Organization {
  id: string;
  organizationName: string; // Business Name
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
  paymentGatewayMode?: 'global' | 'by-outlet';
  globalGatewayIds?: string[];
  numberOfOutlets: number;
  numberOfUsers: number;
  merchantId?: string;
  additionalNotes?: string;
  imageUrl?: string;
}

export interface Outlet {
  id: string;
  organizationId: string;
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
  gatewayIds?: string[];
}

export interface User {
  id: string;
  organizationId: string;
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
