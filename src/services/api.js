// Mock data - Indian apps with ₹ prices
const mockSubscriptions = [
  {
    id: 1,
    appName: 'Netflix',
    category: 'Entertainment',
    logo: '🎬',
    color: '#E50914',
    plan: 'Premium',
    price: 649,
    status: 'Active',
    nextBilling: 'April 15, 2024',
    devices: '4 screens',
    availablePlans: [
      { name: 'Mobile', price: 149, color: '#E50914' },
      { name: 'Basic', price: 199, color: '#E50914' },
      { name: 'Standard', price: 499, color: '#E50914' },
      { name: 'Premium', price: 649, color: '#E50914' }
    ]
  },
  {
    id: 2,
    appName: 'Spotify',
    category: 'Music',
    logo: '🎵',
    color: '#1DB954',
    plan: 'Individual',
    price: 119,
    status: 'Active',
    nextBilling: 'April 10, 2024',
    devices: '1 device',
    availablePlans: [
      { name: 'Individual', price: 119, color: '#1DB954' },
      { name: 'Duo', price: 149, color: '#1DB954' },
      { name: 'Family', price: 179, color: '#1DB954' },
      { name: 'Student', price: 59, color: '#1DB954' }
    ]
  },
  {
    id: 3,
    appName: 'Amazon Prime',
    category: 'Shopping',
    logo: '📦',
    color: '#00A8E1',
    plan: 'Yearly',
    price: 1499,
    status: 'Active',
    nextBilling: 'May 1, 2024',
    devices: '3 screens',
    availablePlans: [
      { name: 'Monthly', price: 179, color: '#00A8E1' },
      { name: 'Yearly', price: 1499, color: '#00A8E1' }
    ]
  },
  {
    id: 4,
    appName: 'Disney+ Hotstar',
    category: 'Entertainment',
    logo: '⭐',
    color: '#1AA2E6',
    plan: 'Premium',
    price: 899,
    status: 'Active',
    nextBilling: 'April 20, 2024',
    devices: '4 screens',
    availablePlans: [
      { name: 'Mobile', price: 399, color: '#1AA2E6' },
      { name: 'Super', price: 699, color: '#1AA2E6' },
      { name: 'Premium', price: 899, color: '#1AA2E6' }
    ]
  },
  {
    id: 5,
    appName: 'YouTube Premium',
    category: 'Video',
    logo: '▶️',
    color: '#FF0000',
    plan: 'Family',
    price: 189,
    status: 'Active',
    nextBilling: 'April 18, 2024',
    devices: '5 accounts',
    availablePlans: [
      { name: 'Individual', price: 129, color: '#FF0000' },
      { name: 'Family', price: 189, color: '#FF0000' },
      { name: 'Student', price: 79, color: '#FF0000' }
    ]
  }
];

// Empty mock bills - no predefined data!
const mockBills = [];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getSubscriptions: async () => {
    await delay(1000);
    return [...mockSubscriptions];
  },
  
  updatePlan: async (id, newPlan, newPrice) => {
    await delay(500);
    const subscription = mockSubscriptions.find(sub => sub.id === id);
    if (subscription) {
      subscription.plan = newPlan;
      subscription.price = newPrice;
    }
    return { success: true };
  },
  
  getBills: async () => {
    await delay(500);
    return [...mockBills]; // Always returns empty array
  },
  
  login: async (email, password) => {
    await delay(800);
    if (email === '24bct020@gmail.com' && password === 'Gunasri1820') {
      return { id: 1, name: 'User', email: '24bct020@gmail.com' };
    }
    return null;
  }
};