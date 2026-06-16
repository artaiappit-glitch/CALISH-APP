// Single source of truth for the visual language.
// No component may hardcode a colour, radius, or font size — import from here.

export const colors = {
  background: '#FFFFFF',     // screen + surface
  surfaceMuted: '#F4F4F2',   // subtle fills
  mapBackground: '#EBEBE8',  // map canvas tint
  ink: '#111113',            // primary text + active icons
  inkSecondary: '#6E6E73',   // metadata, roles, distances
  inkTertiary: '#AEAEB2',    // inactive icons, hints
  hairline: '#E6E6E4',       // borders + dividers
  dark: '#1C1C1E',           // dark chips / dark surfaces
  onDark: '#FFFFFF',
  ring: '#FFFFFF',           // white ring around avatars
  overlayBottom: 'rgba(0,0,0,0.62)', // gradient over photo cards
  accent: '#111113',         // KEEP MONOCHROME by default. Swap to one brand colour (e.g. '#30D158') if asked.
} as const;

export const radius = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 } as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;

export const fonts = {
  light: 'Inter_300Light',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const typography = {
  family: fonts,
  display:   { fontSize: 30,   lineHeight: 34, weight: '700', letterSpacing: -0.4 }, // screen titles
  title:     { fontSize: 22,   lineHeight: 26, weight: '700', letterSpacing: -0.3 },
  section:   { fontSize: 18,   lineHeight: 22, weight: '600' },                       // section headers
  cardTitle: { fontSize: 15,   lineHeight: 19, weight: '600' },                       // names / labels
  body:      { fontSize: 15,   lineHeight: 20, weight: '400' },
  meta:      { fontSize: 12.5, lineHeight: 16, weight: '500' },                       // address • distance
} as const;

export const shadow = {
  pill:     { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,  shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  card:     { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  floating: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
} as const;

// Maps a typography weight string to the matching Inter family name.
export const weightToFamily: Record<string, string> = {
  '300': fonts.light,
  '400': fonts.regular,
  '500': fonts.medium,
  '600': fonts.semibold,
  '700': fonts.bold,
};

export type TypeVariant = Exclude<keyof typeof typography, 'family'>;
