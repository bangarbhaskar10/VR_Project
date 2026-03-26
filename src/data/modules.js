/**
 * Master module registry — CBSE/ICSE Junior KG Curriculum
 * Import this to get metadata for all learning modules.
 * Used by LearningHub and TestPage to list available modules.
 */

export const ALL_MODULES = [
  // ── Core modules ──────────────────────────────────────────────
  {
    id: 'numbers',
    title: 'Numbers',
    marathiTitle: 'अंक',
    emoji: '🔢',
    color: '#EF4444',
    description: 'Count 1 to 50!',
    totalItems: 50,
  },
  {
    id: 'alphabets',
    title: 'Alphabets',
    marathiTitle: 'अक्षरे',
    emoji: '🔤',
    color: '#7C3AED',
    description: 'Learn A to Z!',
    totalItems: 26,
  },
  {
    id: 'colors',
    title: 'Colors',
    marathiTitle: 'रंग',
    emoji: '🎨',
    color: '#EC4899',
    description: 'Explore colors!',
    totalItems: 10,
  },
  {
    id: 'shapes',
    title: 'Shapes',
    marathiTitle: 'आकार',
    emoji: '🔷',
    color: '#6366F1',
    description: 'Find fun shapes!',
    totalItems: 8,
  },

  // ── EVS: Living World ─────────────────────────────────────────
  {
    id: 'animals',
    title: 'Animals',
    marathiTitle: 'प्राणी',
    emoji: '🐘',
    color: '#F59E0B',
    description: 'Meet the animals!',
    totalItems: 18,
  },
  {
    id: 'birds',
    title: 'Birds',
    marathiTitle: 'पक्षी',
    emoji: '🦜',
    color: '#10B981',
    description: 'Fly with birds!',
    totalItems: 12,
  },
  {
    id: 'fruits',
    title: 'Fruits',
    marathiTitle: 'फळे',
    emoji: '🍎',
    color: '#FF6B6B',
    description: 'Yummy fruits!',
    totalItems: 14,
  },
  {
    id: 'vegetables',
    title: 'Vegetables',
    marathiTitle: 'भाज्या',
    emoji: '🥦',
    color: '#22C55E',
    description: 'Healthy veggies!',
    totalItems: 12,
  },

  // ── EVS: My World ─────────────────────────────────────────────
  {
    id: 'bodyparts',
    title: 'My Body',
    marathiTitle: 'माझे शरीर',
    emoji: '👀',
    color: '#F97316',
    description: 'Know your body!',
    totalItems: 12,
  },
  {
    id: 'family',
    title: 'My Family',
    marathiTitle: 'माझे कुटुंब',
    emoji: '👨‍👩‍👧',
    color: '#E84393',
    description: 'Know your family!',
    totalItems: 9,
  },
  {
    id: 'community',
    title: 'Our Helpers',
    marathiTitle: 'आपले सहायक',
    emoji: '👨‍⚕️',
    color: '#3B82F6',
    description: 'People who help us!',
    totalItems: 10,
  },
  {
    id: 'vehicles',
    title: 'Vehicles',
    marathiTitle: 'वाहने',
    emoji: '🚗',
    color: '#EF4444',
    description: 'Vroom vroom!',
    totalItems: 12,
  },

  // ── EVS: Environment ──────────────────────────────────────────
  {
    id: 'weather',
    title: 'Weather',
    marathiTitle: 'हवामान',
    emoji: '🌤️',
    color: '#06B6D4',
    description: 'Sun, rain & more!',
    totalItems: 10,
  },
  {
    id: 'days',
    title: 'Days',
    marathiTitle: 'दिवस',
    emoji: '📅',
    color: '#8B5CF6',
    description: '7 days of the week!',
    totalItems: 7,
  },
  {
    id: 'months',
    title: 'Months',
    marathiTitle: 'महिने',
    emoji: '📆',
    color: '#0EA5E9',
    description: '12 months of the year!',
    totalItems: 12,
  },

  // ── Language ──────────────────────────────────────────────────
  {
    id: 'clothes',
    title: 'Clothes',
    marathiTitle: 'कपडे',
    emoji: '👕',
    color: '#8B5CF6',
    description: 'What do we wear?',
    totalItems: 10,
  },
  {
    id: 'food',
    title: 'Food',
    marathiTitle: 'अन्न',
    emoji: '🍽️',
    color: '#F59E0B',
    description: 'Yummy food!',
    totalItems: 12,
  },
  {
    id: 'opposites',
    title: 'Opposites',
    marathiTitle: 'विरुद्धार्थी',
    emoji: '🔄',
    color: '#EC4899',
    description: 'Big & Small, Hot & Cold!',
    totalItems: 12,
  },
];

/**
 * Get module metadata by id.
 * @param {string} id
 */
export function getModule(id) {
  return ALL_MODULES.find((m) => m.id === id) || null;
}

/**
 * Dynamically import module data by id.
 * Returns the items array for that module.
 */
export async function loadModuleData(id) {
  switch (id) {
    case 'numbers':    return (await import('./numbers.js')).numbers;
    case 'alphabets':  return (await import('./alphabets.js')).alphabets;
    case 'animals':    return (await import('./animals.js')).animals;
    case 'birds':      return (await import('./birds.js')).birds;
    case 'colors':     return (await import('./colors.js')).colors;
    case 'shapes':     return (await import('./shapes.js')).shapes;
    case 'days':       return (await import('./days.js')).days;
    case 'months':     return (await import('./months.js')).months;
    case 'fruits':     return (await import('./fruits.js')).fruits;
    case 'vegetables': return (await import('./vegetables.js')).vegetables;
    case 'bodyparts':  return (await import('./bodyparts.js')).bodyparts;
    case 'family':     return (await import('./family.js')).family;
    case 'vehicles':   return (await import('./vehicles.js')).vehicles;
    case 'clothes':    return (await import('./clothes.js')).clothes;
    case 'food':       return (await import('./food.js')).food;
    case 'weather':    return (await import('./weather.js')).weather;
    case 'community':  return (await import('./community.js')).community;
    case 'opposites':  return (await import('./opposites.js')).opposites;
    default:           return [];
  }
}
