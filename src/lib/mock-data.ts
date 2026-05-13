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
      numberOfOutlets: (i % 5) + 1,
      numberOfUsers: (i % 15) + 3,
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
    name: 'Grand Hyatt - Downtown',
    slug: 'grand-hyatt-downtown',
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
    name: 'Grand Hyatt - Marina',
    slug: 'grand-hyatt-marina',
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
    name: 'QuickBite NYC - Broadway',
    slug: 'quickbite-nyc-broadway',
    phone: '+15559876543',
    timezone: 'America/New_York',
    city: 'New York',
    country: 'USA',
    status: 'Active',
    userCount: 3
  },
  {
    id: 'o4',
    tenantId: '3',
    name: 'Saffron Dubai - Creek',
    slug: 'saffron-dubai-creek',
    phone: '+971501112222',
    timezone: 'Asia/Dubai',
    city: 'Dubai',
    country: 'UAE',
    status: 'Active',
    userCount: 5
  }
];

export const initialUsers: User[] = [
  // Tenant 1 (Grand Hyatt) Users
  {
    id: 'u1',
    tenantId: '1',
    outletId: 'o1',
    fullName: 'John Doe',
    email: 'john.doe@grandhyatt.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2024-05-21 14:30'
  },
  {
    id: 'u2',
    tenantId: '1',
    outletId: 'o1',
    fullName: 'Michael Smith',
    email: 'michael.s@grandhyatt.com',
    role: 'Manager',
    status: 'Active',
    lastActive: '2024-05-21 16:20'
  },
  {
    id: 'u3',
    tenantId: '1',
    outletId: 'o2',
    fullName: 'Sara Ahmed',
    email: 'sara.a@grandhyatt.com',
    role: 'Manager',
    status: 'Active',
    lastActive: '2024-05-21 15:45'
  },
  {
    id: 'u4',
    tenantId: '1',
    outletId: 'o2',
    fullName: 'David Wilson',
    email: 'david.w@grandhyatt.com',
    role: 'Staff',
    status: 'Active',
    lastActive: '2024-05-20 09:15'
  },
  {
    id: 'u5',
    tenantId: '1',
    fullName: 'Executive Admin',
    email: 'exec.admin@grandhyatt.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2024-05-21 12:00'
  },
  
  // Tenant 2 (QuickBite) Users
  {
    id: 'u6',
    tenantId: '2',
    outletId: 'o3',
    fullName: 'Robert Brown',
    email: 'robert@quickbite.io',
    role: 'Admin',
    status: 'Active',
    lastActive: '2024-05-21 11:30'
  },
  {
    id: 'u7',
    tenantId: '2',
    outletId: 'o3',
    fullName: 'Emily Davis',
    email: 'emily@quickbite.io',
    role: 'Staff',
    status: 'Inactive',
    lastActive: '2024-05-18 10:00'
  },
  
  // Tenant 3 (Saffron) Users
  {
    id: 'u8',
    tenantId: '3',
    outletId: 'o4',
    fullName: 'Ali Hassan',
    email: 'ali@saffron.com',
    role: 'Manager',
    status: 'Active',
    lastActive: '2024-05-21 17:00'
  },
  {
    id: 'u9',
    tenantId: '3',
    outletId: 'o4',
    fullName: 'Fatima Z.',
    email: 'fatima@saffron.com',
    role: 'Staff',
    status: 'Active',
    lastActive: '2024-05-21 08:30'
  },
  {
    id: 'u10',
    tenantId: '3',
    fullName: 'Saffron Corp Admin',
    email: 'corp@saffron.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2024-05-19 22:00'
  }
];

export const servingPerformance = [
  { time: '6am', selected: 24, previous: 20 },
  { time: '8am', selected: 26, previous: 22 },
  { time: '10am', selected: 28, previous: 24 },
  { time: '12pm', selected: 32, previous: 28 },
  { time: '2pm', selected: 36, previous: 30 },
  { time: '4pm', selected: 34, previous: 32 },
  { time: '6pm', selected: 30, previous: 28 },
  { time: '8pm', selected: 28, previous: 26 },
];

export const topRestaurants = [
  { name: 'Al Fanar Restaurant', location: 'Dubai Creek • Traditional', orders: 184, revenue: 'AED 12,340', progress: 85 },
  { name: 'Pizzeria Napoli', location: 'JBR • Italian', orders: 157, revenue: 'AED 9,820', progress: 70 },
  { name: 'Noodle House', location: 'DIFC • Asian', orders: 143, revenue: 'AED 8,150', progress: 65 },
  { name: 'The Burger Joint', location: 'Marina • American', orders: 121, revenue: 'AED 6,900', progress: 55 },
];

export const liveOrders = [
  { id: '#48821', customer: 'Khalid M.', restaurant: 'Al Fanar', status: 'Served', amount: 'AED 94' },
  { id: '#48820', customer: 'Sara J.', restaurant: 'Noodle House', status: 'On the way', amount: 'AED 67' },
  { id: '#48819', customer: 'Ahmed K.', restaurant: 'Pizzeria Napoli', status: 'Preparing', amount: 'AED 112' },
  { id: '#48818', customer: 'Layla K.', restaurant: 'Grains Bowl', status: 'Served', amount: 'AED 55' },
  { id: '#48817', customer: 'Omar H.', restaurant: 'Bedouin Grill', status: 'Cancelled', amount: 'AED 88' },
];
