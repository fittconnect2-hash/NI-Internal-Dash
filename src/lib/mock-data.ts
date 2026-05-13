import { Tenant, Outlet } from './types';

export const initialTenants: Tenant[] = [
  {
    id: '1',
    tenantName: 'Grand Hyatt Dining',
    configurationStatus: 'Active',
    contactEmail: 'admin@grandhyatt.com',
    contactPhone: '+1 (555) 123-4567',
    lastLoginDate: '2024-05-15',
    isPaymentGatewayConfigured: true,
    numberOfOutlets: 12,
    numberOfUsers: 45,
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
    numberOfOutlets: 2,
    numberOfUsers: 5,
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
    numberOfUsers: 8,
    merchantId: 'M-00212',
    imageUrl: 'https://picsum.photos/seed/33/200/200',
  },
  {
    id: '4',
    tenantName: 'Urban Coffee Co.',
    configurationStatus: 'Inactive',
    contactEmail: 'accounts@urbancoffee.com',
    contactPhone: '+1 (555) 444-3333',
    lastLoginDate: '2024-04-10',
    isPaymentGatewayConfigured: true,
    numberOfOutlets: 8,
    numberOfUsers: 24,
    merchantId: 'M-55123',
    imageUrl: 'https://picsum.photos/seed/45/200/200',
  },
  {
    id: '5',
    tenantName: 'Mountain Lodge Eats',
    configurationStatus: 'Configuration pending',
    contactEmail: 'manager@mountainlodge.com',
    contactPhone: '+1 (555) 777-8888',
    isPaymentGatewayConfigured: false,
    numberOfOutlets: 3,
    numberOfUsers: 12,
    imageUrl: 'https://picsum.photos/seed/56/200/200',
  }
];

export const initialOutlets: Outlet[] = [
  {
    id: 'o1',
    tenantId: '1',
    name: 'Outburst',
    slug: 'outburst',
    phone: '+971502430508',
    timezone: 'Indian/Antananarivo',
    city: 'qcity',
    country: 'United Kingdom',
    status: 'Active'
  },
  {
    id: 'o2',
    tenantId: '1',
    name: 'Crave',
    slug: 'crave',
    phone: '+971521650763',
    timezone: 'Asia/Dubai',
    city: 'Dubai',
    country: 'Albania',
    status: 'Active'
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
    status: 'Active'
  }
];