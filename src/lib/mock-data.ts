import { Tenant, Outlet, User } from './types';

const businessTypes = ['Hotel', 'Fast Food', 'Restaurant', 'Cafe', 'Catering', 'Fine Dining', 'Bakery', 'Pizzeria'];
const statusOptions: ('Active' | 'Configuration pending' | 'Inactive')[] = ['Active', 'Configuration pending', 'Active', 'Active', 'Inactive'];

function generateMockTenants(count: number): Tenant[] {
  const tenants: Tenant[] = [
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
    }
  ];

  const names = [
    'Saffron', 'The Gourmet', 'Blue Ocean', 'Urban Plate', 'Golden Dragon', 
    'Spicy Bites', 'Mountain Grill', 'Harbor Side', 'The Kitchen', 'Wild Flavour',
    'Morning Brew', 'Midnight Diner', 'Pasta Palace', 'Steak House', 'Veggies',
    'Burger King', 'Sushi Zen', 'Taco Time', 'Pizza Hut', 'Desert Rose',
    'Noodle Bar', 'Bistro 55', 'The Terrace', 'Oasis Lounge', 'Sky Dine',
    'Rustic Charm', 'Modern Eats', 'Fresh Catch', 'The Butcher', 'Sweet Treats',
    'Spices of India', 'Italian Garden', 'French Corner', 'Greek Greek', 'Mexican Way',
    'Thai Delight', 'Korean BBQ', 'Japanese Soul', 'Turkish Grill', 'Arabian Nights'
  ];

  for (let i = 0; i < count; i++) {
    const id = (i + 3).toString();
    const name = `${names[i % names.length]} ${i >= names.length ? (Math.floor(i / names.length) + 1) : ''}`.trim();
    const type = businessTypes[i % businessTypes.length];
    const status = statusOptions[i % statusOptions.length];
    
    // Using deterministic calculations based on index i to avoid hydration mismatches
    tenants.push({
      id,
      tenantName: name,
      contactName: `Manager ${id}`,
      businessType: type,
      country: i % 2 === 0 ? 'UAE' : 'USA',
      state: i % 2 === 0 ? 'Dubai' : 'California',
      city: i % 2 === 0 ? 'Dubai' : 'San Francisco',
      zipCode: (10000 + i).toString(),
      addressLine1: `${100 + i} Main St`,
      configurationStatus: status,
      contactEmail: `contact@${name.toLowerCase().replace(/\s+/g, '')}.com`,
      contactPhone: `+971 50 ${1000000 + i}`,
      lastLoginDate: '2024-05-20',
      isPaymentGatewayConfigured: status === 'Active',
      numberOfOutlets: (i % 5) + 1, // Deterministic
      numberOfUsers: (i % 15) + 3,  // Deterministic
      merchantId: status === 'Active' ? `M-${10000 + i}` : undefined,
    });
  }

  return tenants;
}

export const initialTenants: Tenant[] = generateMockTenants(40);

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
