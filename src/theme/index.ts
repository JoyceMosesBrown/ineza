export const Colors = {
  // Brand
  primary: '#2D6A4F',       // deep forest green
  primaryLight: '#52B788',  // medium green
  primaryPale: '#D8F3DC',   // very light green tint
  accent: '#F4A261',        // warm amber
  accentLight: '#FFDDD2',   // soft peach

  // Neutrals
  white: '#FFFFFF',
  background: '#F7F9F8',    // off-white with green tint
  surface: '#FFFFFF',
  surfaceAlt: '#EEF4F1',    // light green-gray card bg
  border: '#E0EBE5',
  divider: '#EAF0EC',

  // Text
  textPrimary: '#1A2E25',   // near-black green
  textSecondary: '#4D7665', // muted green-gray
  textMuted: '#8BA89A',     // light muted

  // Status
  success: '#40916C',
  warning: '#E9C46A',
  danger: '#E76F51',
  info: '#4895EF',

  // Mood
  moodGreat: '#52B788',
  moodGood: '#90E0AB',
  moodOkay: '#E9C46A',
  moodLow: '#F4A261',
  moodBad: '#E76F51',

  // Overlay
  overlay: 'rgba(0,0,0,0.45)',
  scrim: 'rgba(26,46,37,0.6)',
};

export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 30,
    hero: 36,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  full: 999,
};

export const Shadow = {
  soft: {
    shadowColor: '#1A2E25',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  medium: {
    shadowColor: '#1A2E25',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
};
