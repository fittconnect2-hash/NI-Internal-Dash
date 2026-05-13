import { Tenant, Outlet, User } from './types';

export const initialTenants: Tenant[] = [
  {
    id: '1',
    tenantName: 'Grand Hyatt Dining',
    configurationStatus: 'Active',
    contactEmail: 'admin@grandhyatt.com',
    contactPhone: '+1 (555) 123-4567',
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
    configurationStatus: 'Configuration pending',
    contactEmail: 'setup@quickbite.io',
    contactPhone: '+1 (555) 987-6543',
    isPaymentGatewayConfigured: false,
    numberOfOutlets: 1,
    numberOfUsers: 3,
    imageUrl: 'https://picsum.photos/seed/21/200/200',
  },
  {
    id: '3',
    tenantName: 'Seaside Brasserie',
    configurationStatus: 'Active',
    contactEmail: 'hello@seaside.com',
    contactPhone: '+44 20 7123 4567',
    lastLoginDate: '2024-05-20',
    isPaymentGatewayConfigured: true,
    numberOfOutlets: 1,
    numberOfUsers: 5,
    merchantId: 'M-00212',
    imageUrl: 'https://picsum.photos/seed/33/200/200',
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
  },
  {
    id: 'o3',
    tenantId: '2',
    name: 'QuickBite Downtown',
    slug: 'qb-downtown',
    phone: '+15551234567',
    timezone: 'America/New_York',
    city: 'New York',
    country: 'USA',
    status: 'Active',
    userCount: 3
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
  },
  {
    id: 'u2',
    tenantId: '1',
    outletId: 'o1',
    fullName: 'Sarah Smith',
    email: 'sarah@grandhyatt.com',
    role: 'Manager',
    status: 'Active',
    lastActive: '2024-05-21 09:15'
  },
  {
    id: 'u3',
    tenantId: '1',
    outletId: 'o2',
    fullName: 'Mike Ross',
    email: 'mike@grandhyatt.com',
    role: 'Staff',
    status: 'Active',
    lastActive: '2024-05-20 18:45'
  }
];
