import { Tenant, Outlet, User } from './types';

export const initialTenants: Tenant[] = [
  {
    id: '1',
    tenantName: 'Grand Hyatt Dining',
    contactName: 'Jane Doe',
    businessType: 'Hotel',
    country: 'UAE',
    state: 'Dubai',
    city: 'Dubai',
    zipCode: '00000',
    addressLine1: 'Sheikh Zayed Rd',
    configurationStatus: 'Active',
    contactEmail: 'admin@grandhyatt.com',
    contactPhone: '+971 50 123 4567',
    lastLoginDate: '2024-05-15',
    isPaymentGatewayConfigured: true,
    numberOfOutlets: 2,
    numberOfUsers: 12,
    merchantId: 'M-78291',
    imageUrl: 'https://picsum.photos/seed/10/200/200',
  },
  {
    id: '2',
    tenantName: 'QuickBite Express',
    contactName: 'John Smith',
    businessType: 'Fast Food',
    country: 'USA',
    state: 'New York',
    city: 'New York',
    zipCode: '10001',
    addressLine1: '5th Ave',
    configurationStatus: 'Configuration pending',
    contactEmail: 'setup@quickbite.io',
    contactPhone: '+1 555 987 6543',
    isPaymentGatewayConfigured: false,
    numberOfOutlets: 1,
    numberOfUsers: 3,
    imageUrl: 'https://picsum.photos/seed/21/200/200',
  }
];

export const initialOutlets: Outlet[] = [
  {
    id: 'o1',
    tenantId: '1',
    name: 'Outburst Main',
    slug: 'outburst-main',
    phone: '+971502430508',
    timezone: 'Asia/Dubai',
    city: 'Dubai',
    country: 'UAE',
    status: 'Active',
    userCount: 8
  },
  {
    id: 'o2',
    tenantId: '1',
    name: 'Crave Lounge',
    slug: 'crave-lounge',
    phone: '+971521650763',
    timezone: 'Asia/Dubai',
    city: 'Dubai',
    country: 'UAE',
    status: 'Active',
    userCount: 4
  }
];

export const initialUsers: User[] = [
  {
    id: 'u1',
    tenantId: '1',
    outletId: 'o1',
    fullName: 'John Doe',
    email: 'john@grandhyatt.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2024-05-21 14:30'
  }
];
