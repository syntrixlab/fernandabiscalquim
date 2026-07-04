export const siteThemePresetValues = ['terra-oliva', 'sereno-azul', 'salvia', 'vinho-suave', 'ameixa-rosa'] as const;

export type SiteThemePreset = (typeof siteThemePresetValues)[number];

export type SiteThemeColors = {
  background: string;
  text: string;
  primary: string;
  accent: string;
};

export type SiteTypography = {
  headingFont: string | null;
  bodyFont: string | null;
};

export type ElementStyleState = Record<string, string>;
export type ElementStyle = Record<string, ElementStyleState>;
export type SiteElementStyles = Record<string, ElementStyle>;

export type SiteTheme = {
  preset: SiteThemePreset;
  colors: SiteThemeColors;
  typography?: SiteTypography;
  elements?: SiteElementStyles;
};

const ELEMENT_STATE_KEYS = ['normal', 'hover'];
const ELEMENT_PROP_KEYS = ['bg', 'text', 'border', 'shadow'];
const colorHexPattern = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const colorFuncPattern = /^(?:rgb|rgba|hsl|hsla)\(\s*[0-9.,%\s/]+\)$/;

function isSafeColor(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  if (!v || /[;{}<>]/.test(v)) return false;
  return colorHexPattern.test(v) || colorFuncPattern.test(v);
}

/**
 * Sanitiza os overrides de elementos de forma genérica (sem depender do registry
 * do client): mantém apenas estados/propriedades conhecidos e cores válidas.
 * Ids de elementos são preservados como chaves livres.
 */
export function sanitizeElementStyles(value: unknown): SiteElementStyles {
  if (!isThemeObject(value)) return {};
  const out: SiteElementStyles = {};

  for (const [id, rawStyle] of Object.entries(value)) {
    if (!isThemeObject(rawStyle) || id.length > 64) continue;
    const style: ElementStyle = {};
    for (const stateName of ELEMENT_STATE_KEYS) {
      const rawState = (rawStyle as Record<string, unknown>)[stateName];
      if (!isThemeObject(rawState)) continue;
      const state: ElementStyleState = {};
      for (const prop of ELEMENT_PROP_KEYS) {
        const raw = (rawState as Record<string, unknown>)[prop];
        if (isSafeColor(raw)) state[prop] = raw;
      }
      if (Object.keys(state).length) style[stateName] = state;
    }
    if (Object.keys(style).length) out[id] = style;
  }

  return out;
}

export const SITE_THEME_PRESETS: Record<SiteThemePreset, SiteTheme> = {
  'terra-oliva': {
    preset: 'terra-oliva',
    colors: {
      background: '#f9f4ec',
      text: '#1f2d16',
      primary: '#8d2b00',
      accent: '#be6731'
    }
  },
  'sereno-azul': {
    preset: 'sereno-azul',
    colors: {
      background: '#f2f7fb',
      text: '#172636',
      primary: '#2f638f',
      accent: '#78a6c8'
    }
  },
  salvia: {
    preset: 'salvia',
    colors: {
      background: '#f4f7ef',
      text: '#1e2b1c',
      primary: '#5f7c58',
      accent: '#b68b5f'
    }
  },
  'vinho-suave': {
    preset: 'vinho-suave',
    colors: {
      background: '#fff7f8',
      text: '#331822',
      primary: '#8a3651',
      accent: '#c9798d'
    }
  },
  'ameixa-rosa': {
    preset: 'ameixa-rosa',
    colors: {
      background: '#fffbec',
      text: '#72215c',
      primary: '#894777',
      accent: '#eec4be'
    }
  }
};

export const DEFAULT_SITE_THEME: SiteTheme = SITE_THEME_PRESETS['terra-oliva'];

const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

export function isSiteThemePreset(value: unknown): value is SiteThemePreset {
  return typeof value === 'string' && siteThemePresetValues.includes(value as SiteThemePreset);
}

export function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && hexColorPattern.test(value);
}

export function isTypographyObject(value: unknown): value is Partial<SiteTypography> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function normalizeSiteTheme(value?: unknown): SiteTheme {
  const raw = isThemeObject(value) ? value : {};
  const preset = isSiteThemePreset(raw.preset) ? raw.preset : DEFAULT_SITE_THEME.preset;
  const presetTheme = SITE_THEME_PRESETS[preset];
  const colors = isThemeObject(raw.colors) ? raw.colors : {};

  // Normalize typography
  const rawTypography = isTypographyObject(raw.typography) ? raw.typography : {};
  const headingFont = typeof rawTypography.headingFont === 'string' && rawTypography.headingFont.trim()
    ? rawTypography.headingFont.trim()
    : null;
  const bodyFont = typeof rawTypography.bodyFont === 'string' && rawTypography.bodyFont.trim()
    ? rawTypography.bodyFont.trim()
    : null;

  const elements = sanitizeElementStyles(raw.elements);

  return {
    preset,
    colors: {
      background: isHexColor(colors.background) ? colors.background : presetTheme.colors.background,
      text: isHexColor(colors.text) ? colors.text : presetTheme.colors.text,
      primary: isHexColor(colors.primary) ? colors.primary : presetTheme.colors.primary,
      accent: isHexColor(colors.accent) ? colors.accent : presetTheme.colors.accent
    },
    typography: { headingFont, bodyFont },
    elements
  };
}

function isThemeObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
