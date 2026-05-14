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

function generateMockOutlets(tenants: Tenant[]): Outlet[] {
  const outlets: Outlet[] = [];
  
  tenants.forEach((tenant) => {
    const outletCount = tenant.numberOfOutlets;
    for (let j = 0; j < outletCount; j++) {
      outlets.push({
        id: `o-${tenant.id}-${j}`,
        tenantId: tenant.id,
        name: `${tenant.tenantName} - ${['Downtown', 'Marina', 'Airport', 'Mall', 'Harbor'][j % 5]}`,
        slug: `${tenant.tenantName.toLowerCase().replace(/\s+/g, '-')}-${['downtown', 'marina', 'airport', 'mall', 'harbor'][j % 5]}`,
        phone: tenant.contactPhone,
        timezone: tenant.country === 'UAE' ? 'Asia/Dubai' : 'America/New_York',
        city: tenant.city,
        country: tenant.country,
        status: 'Active',
        userCount: Math.floor(Math.random() * 10) + 2
      });
    }
  });

  return outlets;
}

export const initialOutlets: Outlet[] = generateMockOutlets(initialTenants);

function generateMockUsers(tenants: Tenant[], outlets: Outlet[]): User[] {
  const users: User[] = [];
  
  tenants.forEach((tenant) => {
    const tenantOutlets = outlets.filter(o => o.tenantId === tenant.id);
    const userCount = tenant.numberOfUsers;
    
    for (let k = 0; k < userCount; k++) {
      const assignedOutlet = tenantOutlets[k % tenantOutlets.length];
      const roles: ('Admin' | 'Manager' | 'Staff')[] = ['Admin', 'Manager', 'Staff', 'Staff', 'Staff'];
      const role = roles[k % roles.length];
      const firstNames = ['John', 'Jane', 'Michael', 'Sara', 'David', 'Emily', 'Robert', 'Lisa'];
      const lastNames = ['Smith', 'Doe', 'Wilson', 'Ahmed', 'Brown', 'Davis', 'Taylor', 'Miller'];
      const firstName = firstNames[k % firstNames.length];
      const lastName = lastNames[k % lastNames.length];
      
      users.push({
        id: `u-${tenant.id}-${k}`,
        tenantId: tenant.id,
        outletId: assignedOutlet?.id,
        fullName: `${firstName} ${lastName}`,
        username: `@${firstName.toLowerCase()}.${lastName.toLowerCase()}${k}`,
        email: `${firstName.toLowerCase()}.${k}@${tenant.tenantName.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: tenant.contactPhone,
        role: role,
        status: k % 10 === 0 ? 'Inactive' : 'Active',
        lastActive: `2024-05-${Math.floor(Math.random() * 20) + 1} ${Math.floor(Math.random() * 12) + 10}:00`
      });
    }
  });

  return users;
}

export const initialUsers: User[] = generateMockUsers(initialTenants, initialOutlets);

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
