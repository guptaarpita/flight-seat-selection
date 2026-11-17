// ============================================================
// SkySelect — Mock Data & Aircraft Configurations
// ============================================================

export const FLIGHT_INFO = {
  flightNumber: 'SS-402',
  airline: 'SkySelect Airlines',
  aircraftNarrow: 'Airbus A320neo',
  aircraftWide: 'Boeing 787-8 Dreamliner',
  departure: {
    city: 'New Delhi',
    code: 'DEL',
    airport: 'Indira Gandhi Int\'l Airport, T3',
    time: '08:30 AM',
    date: '18 Nov 2026',
  },
  arrival: {
    city: 'Mumbai',
    code: 'BOM',
    airport: 'Chhatrapati Shivaji Maharaj Int\'l, T2',
    time: '10:45 AM',
    date: '18 Nov 2026',
  },
  duration: '2h 15m',
  gate: 'B12',
  boardingGroup: 'Zone 2',
};

/**
 * Seat Categories
 */
export const SEAT_CATEGORIES = {
  free: {
    id: 'free',
    label: 'Standard (Free)',
    shortLabel: 'Free',
    price: 0,
    color: '#10B981', // Emerald
    bgColor: '#ECFDF5',
    borderColor: '#059669',
    description: 'Complimentary standard seat',
    pitch: '30" Seat Pitch',
    icon: '🪑',
  },
  standard: {
    id: 'standard',
    label: 'Standard Preferred',
    shortLabel: 'Preferred',
    price: 150,
    color: '#2563EB', // Blue
    bgColor: '#EFF6FF',
    borderColor: '#1D4ED8',
    description: 'Comfortable standard seat near front',
    pitch: '31" Seat Pitch',
    icon: '✨',
  },
  extraLegroom: {
    id: 'extraLegroom',
    label: 'Extra Legroom',
    shortLabel: 'Extra Legroom',
    price: 350,
    color: '#D97706', // Amber / Gold
    bgColor: '#FFFBEB',
    borderColor: '#B45309',
    description: '35% more legroom & priority exit',
    pitch: '35" Legroom Pitch',
    icon: '🦵',
  },
  premium: {
    id: 'premium',
    label: 'Premium Front',
    shortLabel: 'Premium',
    price: 250,
    color: '#7C3AED', // Purple
    bgColor: '#F5F3FF',
    borderColor: '#6D28D9',
    description: 'Early boarding & extra recline',
    pitch: '33" Recline Pitch',
    icon: '👑',
  },
};

/**
 * Layout 1: 3–2 Configuration (Narrow-body)
 * Columns: A B C (Left) | Aisle | D E (Right)
 */
export const LAYOUT_3_2 = {
  id: '3-2',
  label: '3–2 Configuration',
  aircraftType: 'Airbus A320neo',
  description: 'Narrow-body · 3 seats | aisle | 2 seats',
  leftCols: ['A', 'B', 'C'],
  rightCols: ['D', 'E'],
  allCols: ['A', 'B', 'C', 'D', 'E'],
  exitRows: [4],
  rows: 8,
  seats: generateSeats(['A', 'B', 'C', 'D', 'E'], 8, [
    // Row 1 - Premium Front Row
    { row: 1, col: 'A', category: 'extraLegroom', occupied: false, feature: 'Window · Bulkhead' },
    { row: 1, col: 'B', category: 'free', occupied: false, feature: 'Middle' },
    { row: 1, col: 'C', category: 'extraLegroom', occupied: false, feature: 'Aisle' },
    { row: 1, col: 'D', category: 'free', occupied: false, feature: 'Aisle' },
    { row: 1, col: 'E', category: 'premium', occupied: false, feature: 'Window · Bulkhead' },

    // Row 2
    { row: 2, col: 'A', category: 'extraLegroom', occupied: false, feature: 'Window' },
    { row: 2, col: 'B', category: 'free', occupied: true, feature: 'Occupied' },
    { row: 2, col: 'C', category: 'standard', occupied: false, feature: 'Aisle' },
    { row: 2, col: 'D', category: 'free', occupied: true, feature: 'Occupied' },
    { row: 2, col: 'E', category: 'standard', occupied: false, feature: 'Window' },

    // Row 3
    { row: 3, col: 'A', category: 'standard', occupied: false, feature: 'Window' },
    { row: 3, col: 'B', category: 'free', occupied: false, feature: 'Middle' },
    { row: 3, col: 'C', category: 'free', occupied: true, feature: 'Occupied' },
    { row: 3, col: 'D', category: 'standard', occupied: false, feature: 'Aisle' },
    { row: 3, col: 'E', category: 'premium', occupied: false, feature: 'Window' },

    // Row 4 - Exit Row (Extra Legroom)
    { row: 4, col: 'A', category: 'extraLegroom', occupied: true, feature: 'Emergency Exit · Window' },
    { row: 4, col: 'B', category: 'extraLegroom', occupied: false, feature: 'Emergency Exit · Middle' },
    { row: 4, col: 'C', category: 'extraLegroom', occupied: false, feature: 'Emergency Exit · Aisle' },
    { row: 4, col: 'D', category: 'extraLegroom', occupied: false, feature: 'Emergency Exit · Aisle' },
    { row: 4, col: 'E', category: 'extraLegroom', occupied: false, feature: 'Emergency Exit · Window' },

    // Row 5
    { row: 5, col: 'A', category: 'standard', occupied: false, feature: 'Window · Overwing' },
    { row: 5, col: 'B', category: 'free', occupied: false, feature: 'Middle · Overwing' },
    { row: 5, col: 'C', category: 'standard', occupied: false, feature: 'Aisle · Overwing' },
    { row: 5, col: 'D', category: 'standard', occupied: true, feature: 'Occupied' },
    { row: 5, col: 'E', category: 'free', occupied: false, feature: 'Window · Overwing' },

    // Row 6
    { row: 6, col: 'A', category: 'free', occupied: false, feature: 'Window' },
    { row: 6, col: 'B', category: 'standard', occupied: true, feature: 'Occupied' },
    { row: 6, col: 'C', category: 'free', occupied: false, feature: 'Aisle' },
    { row: 6, col: 'D', category: 'premium', occupied: false, feature: 'Aisle' },
    { row: 6, col: 'E', category: 'standard', occupied: false, feature: 'Window' },

    // Row 7
    { row: 7, col: 'A', category: 'standard', occupied: false, feature: 'Window' },
    { row: 7, col: 'B', category: 'free', occupied: false, feature: 'Middle' },
    { row: 7, col: 'C', category: 'free', occupied: true, feature: 'Occupied' },
    { row: 7, col: 'D', category: 'standard', occupied: false, feature: 'Aisle' },
    { row: 7, col: 'E', category: 'free', occupied: false, feature: 'Window' },

    // Row 8
    { row: 8, col: 'A', category: 'free', occupied: false, feature: 'Window' },
    { row: 8, col: 'B', category: 'free', occupied: false, feature: 'Middle' },
    { row: 8, col: 'C', category: 'free', occupied: false, feature: 'Aisle' },
    { row: 8, col: 'D', category: 'standard', occupied: false, feature: 'Aisle' },
    { row: 8, col: 'E', category: 'free', occupied: false, feature: 'Window' },
  ]),
};

/**
 * Layout 2: 2–3–2 Configuration (Wide-body)
 * Columns: A B (Left) | Aisle | D E F (Middle) | Aisle | G H (Right)
 */
export const LAYOUT_2_3_2 = {
  id: '2-3-2',
  label: '2–3–2 Configuration',
  aircraftType: 'Boeing 787 Dreamliner',
  description: 'Wide-body · 2 seats | aisle | 3 seats | aisle | 2 seats',
  leftCols: ['A', 'B'],
  middleCols: ['D', 'E', 'F'],
  rightCols: ['G', 'H'],
  allCols: ['A', 'B', 'D', 'E', 'F', 'G', 'H'],
  exitRows: [4],
  rows: 8,
  seats: generateSeats(['A', 'B', 'D', 'E', 'F', 'G', 'H'], 8, [
    // Row 1 - Premium Row
    { row: 1, col: 'A', category: 'extraLegroom', occupied: false, feature: 'Window · Bulkhead' },
    { row: 1, col: 'B', category: 'extraLegroom', occupied: false, feature: 'Aisle · Bulkhead' },
    { row: 1, col: 'D', category: 'free', occupied: false, feature: 'Aisle' },
    { row: 1, col: 'E', category: 'premium', occupied: false, feature: 'Middle' },
    { row: 1, col: 'F', category: 'free', occupied: false, feature: 'Aisle' },
    { row: 1, col: 'G', category: 'extraLegroom', occupied: false, feature: 'Aisle · Bulkhead' },
    { row: 1, col: 'H', category: 'extraLegroom', occupied: false, feature: 'Window · Bulkhead' },

    // Row 2
    { row: 2, col: 'A', category: 'standard', occupied: false, feature: 'Window' },
    { row: 2, col: 'B', category: 'free', occupied: true, feature: 'Occupied' },
    { row: 2, col: 'D', category: 'standard', occupied: false, feature: 'Aisle' },
    { row: 2, col: 'E', category: 'standard', occupied: false, feature: 'Middle' },
    { row: 2, col: 'F', category: 'free', occupied: true, feature: 'Occupied' },
    { row: 2, col: 'G', category: 'standard', occupied: false, feature: 'Aisle' },
    { row: 2, col: 'H', category: 'free', occupied: false, feature: 'Window' },

    // Row 3
    { row: 3, col: 'A', category: 'free', occupied: false, feature: 'Window' },
    { row: 3, col: 'B', category: 'premium', occupied: false, feature: 'Aisle' },
    { row: 3, col: 'D', category: 'free', occupied: true, feature: 'Occupied' },
    { row: 3, col: 'E', category: 'standard', occupied: false, feature: 'Middle' },
    { row: 3, col: 'F', category: 'standard', occupied: false, feature: 'Aisle' },
    { row: 3, col: 'G', category: 'premium', occupied: false, feature: 'Aisle' },
    { row: 3, col: 'H', category: 'free', occupied: true, feature: 'Occupied' },

    // Row 4 - Exit Row
    { row: 4, col: 'A', category: 'extraLegroom', occupied: true, feature: 'Emergency Exit · Window' },
    { row: 4, col: 'B', category: 'extraLegroom', occupied: false, feature: 'Emergency Exit · Aisle' },
    { row: 4, col: 'D', category: 'extraLegroom', occupied: false, feature: 'Emergency Exit · Aisle' },
    { row: 4, col: 'E', category: 'extraLegroom', occupied: false, feature: 'Emergency Exit · Middle' },
    { row: 4, col: 'F', category: 'extraLegroom', occupied: false, feature: 'Emergency Exit · Aisle' },
    { row: 4, col: 'G', category: 'extraLegroom', occupied: false, feature: 'Emergency Exit · Aisle' },
    { row: 4, col: 'H', category: 'extraLegroom', occupied: false, feature: 'Emergency Exit · Window' },

    // Row 5
    { row: 5, col: 'A', category: 'free', occupied: false, feature: 'Window · Overwing' },
    { row: 5, col: 'B', category: 'standard', occupied: false, feature: 'Aisle · Overwing' },
    { row: 5, col: 'D', category: 'free', occupied: false, feature: 'Aisle' },
    { row: 5, col: 'E', category: 'premium', occupied: true, feature: 'Occupied' },
    { row: 5, col: 'F', category: 'free', occupied: false, feature: 'Aisle' },
    { row: 5, col: 'G', category: 'standard', occupied: false, feature: 'Aisle · Overwing' },
    { row: 5, col: 'H', category: 'free', occupied: false, feature: 'Window · Overwing' },

    // Row 6
    { row: 6, col: 'A', category: 'standard', occupied: false, feature: 'Window' },
    { row: 6, col: 'B', category: 'extraLegroom', occupied: false, feature: 'Aisle' },
    { row: 6, col: 'D', category: 'standard', occupied: true, feature: 'Occupied' },
    { row: 6, col: 'E', category: 'free', occupied: false, feature: 'Middle' },
    { row: 6, col: 'F', category: 'standard', occupied: false, feature: 'Aisle' },
    { row: 6, col: 'G', category: 'free', occupied: true, feature: 'Occupied' },
    { row: 6, col: 'H', category: 'standard', occupied: false, feature: 'Window' },

    // Row 7
    { row: 7, col: 'A', category: 'free', occupied: false, feature: 'Window' },
    { row: 7, col: 'B', category: 'standard', occupied: false, feature: 'Aisle' },
    { row: 7, col: 'D', category: 'free', occupied: false, feature: 'Aisle' },
    { row: 7, col: 'E', category: 'standard', occupied: false, feature: 'Middle' },
    { row: 7, col: 'F', category: 'free', occupied: true, feature: 'Occupied' },
    { row: 7, col: 'G', category: 'standard', occupied: false, feature: 'Aisle' },
    { row: 7, col: 'H', category: 'free', occupied: false, feature: 'Window' },

    // Row 8
    { row: 8, col: 'A', category: 'free', occupied: false, feature: 'Window' },
    { row: 8, col: 'B', category: 'free', occupied: false, feature: 'Aisle' },
    { row: 8, col: 'D', category: 'standard', occupied: false, feature: 'Aisle' },
    { row: 8, col: 'E', category: 'free', occupied: false, feature: 'Middle' },
    { row: 8, col: 'F', category: 'standard', occupied: false, feature: 'Aisle' },
    { row: 8, col: 'G', category: 'free', occupied: false, feature: 'Aisle' },
    { row: 8, col: 'H', category: 'free', occupied: false, feature: 'Window' },
  ]),
};

function generateSeats(cols, rows, overrides) {
  const map = {};
  overrides.forEach((s) => {
    map[`${s.row}${s.col}`] = s;
  });

  const seats = {};
  for (let r = 1; r <= rows; r++) {
    for (const col of cols) {
      const id = `${r}${col}`;
      if (map[id]) {
        seats[id] = map[id];
      } else {
        const isWindow = col === cols[0] || col === cols[cols.length - 1];
        seats[id] = {
          row: r,
          col,
          category: 'free',
          occupied: false,
          feature: isWindow ? 'Window' : 'Standard',
        };
      }
    }
  }
  return seats;
}

export const ALL_LAYOUTS = [LAYOUT_3_2, LAYOUT_2_3_2];

export const DEFAULT_PASSENGER_NAMES = [
  'Aarav Sharma',
  'Priya Patel',
  'Rohan Mehta',
  'Ananya Iyer',
  'Kabir Verma',
  'Meera Kapoor',
];

/**
 * Meal options (Free & Paid)
 */
export const MEAL_OPTIONS = [
  {
    id: 'none',
    label: 'No Meal',
    description: 'Skip onboard meal service',
    price: 0,
    dietary: 'None',
    emoji: '🚫',
    badge: 'Skip',
  },
  {
    id: 'veg-thali',
    label: 'Indian Veg Thali',
    description: 'Paneer butter masala, dal makhani, jeera rice, paratha & gulab jamun',
    price: 0,
    dietary: 'Vegetarian',
    emoji: '🥗',
    badge: 'Free',
  },
  {
    id: 'fruit-platter',
    label: 'Fresh Seasonal Fruit Platter',
    description: 'Assorted seasonal fresh cut fruits, nuts & mint dressing',
    price: 0,
    dietary: 'Vegan / Healthy',
    emoji: '🍉',
    badge: 'Free',
  },
  {
    id: 'chicken-biryani',
    label: 'Dum Awadhi Chicken Biryani',
    description: 'Slow-cooked aromatic basmati rice, tender chicken, burani raita & salan',
    price: 249,
    dietary: 'Non-Vegetarian',
    emoji: '🍗',
    badge: 'Chef Special',
  },
  {
    id: 'pasta-alfredo',
    label: 'Creamy Penne Alfredo',
    description: 'Penne in rich parmesan cream sauce, roasted bell peppers, garlic toast',
    price: 189,
    dietary: 'Vegetarian',
    emoji: '🍝',
    badge: 'Popular',
  },
  {
    id: 'grilled-sandwich',
    label: 'Smoked Chicken Club Sandwich',
    description: 'Triple-decker sandwich with herb-grilled chicken, egg, cheddar & chips',
    price: 149,
    dietary: 'Non-Vegetarian',
    emoji: '🥪',
    badge: 'Quick Bite',
  },
];

export const MAX_PASSENGERS = 6;
