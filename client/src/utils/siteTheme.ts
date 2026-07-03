import type { SiteTheme, SiteThemeColors, SiteThemePreset, SiteTypography } from '@/types';

export type SiteThemeCssVars = Record<string, string>;

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

export const DEFAULT_SITE_THEME: SiteTheme = {
  ...SITE_THEME_PRESETS['terra-oliva'],
  typography: { headingFont: null, bodyFont: null }
};

const presetKeys = Object.keys(SITE_THEME_PRESETS) as SiteThemePreset[];
const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

export function isSiteThemePreset(value: unknown): value is SiteThemePreset {
  return typeof value === 'string' && presetKeys.includes(value as SiteThemePreset);
}

export function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && hexColorPattern.test(value);
}

export function isTypographyObject(value: unknown): value is Partial<SiteTypography> {
  return typeof value === 'object' && value !== null;
}

export function normalizeSiteTheme(value?: Partial<SiteTheme> | null): SiteTheme {
  const preset = isSiteThemePreset(value?.preset) ? value.preset : DEFAULT_SITE_THEME.preset;
  const presetTheme = SITE_THEME_PRESETS[preset];
  const colors: Partial<SiteThemeColors> = value?.colors ?? {};

  // Normalize typography
  const rawTypography: Partial<SiteTypography> = isTypographyObject(value?.typography) ? value.typography : {};
  const headingFont = typeof rawTypography.headingFont === 'string' && rawTypography.headingFont.trim()
    ? rawTypography.headingFont.trim()
    : null;
  const bodyFont = typeof rawTypography.bodyFont === 'string' && rawTypography.bodyFont.trim()
    ? rawTypography.bodyFont.trim()
    : null;

  return {
    preset,
    colors: {
      background: isHexColor(colors.background) ? colors.background : presetTheme.colors.background,
      text: isHexColor(colors.text) ? colors.text : presetTheme.colors.text,
      primary: isHexColor(colors.primary) ? colors.primary : presetTheme.colors.primary,
      accent: isHexColor(colors.accent) ? colors.accent : presetTheme.colors.accent
    },
    typography: { headingFont, bodyFont }
  };
}

export function siteThemeToCssVars(themeInput?: Partial<SiteTheme> | null): SiteThemeCssVars {
  const theme = normalizeSiteTheme(themeInput);
  const { background, text, primary, accent } = theme.colors;
  const { typography } = theme;

  return {
    '--theme-background-rgb': hexToRgb(background),
    '--theme-text-rgb': hexToRgb(text),
    '--theme-primary-rgb': hexToRgb(primary),
    '--theme-accent-rgb': hexToRgb(accent),
    '--color-paper': background,
    '--color-shell': tintColor(background, '#ffffff', 0.4),
    '--color-surface': tintColor(background, '#ffffff', 0.72),
    '--color-deep': text,
    '--color-forest': tintColor(text, '#ffffff', 0.22),
    '--color-olive': tintColor(text, accent, 0.45),
    '--color-terracotta': primary,
    '--color-terracotta-strong': shadeColor(primary, '#000000', 0.14),
    '--color-clay': accent,
    '--color-clay-soft': desaturateColor(accent, 10),
    '--color-burnt': primary,
    '--color-rust': shadeColor(primary, '#000000', 0.14),
    '--color-amber': accent,
    '--brand-text-color': accent,
    '--section-bg': tintColor(background, '#ffffff', 0.34),
    '--section-fg': text,
    '--section-border': hexToRgba(primary, 0.18),
    '--section-surface': tintColor(background, '#ffffff', 0.82),
    '--section-surface-soft': hexToRgba(background, 0.75),
    '--font-heading': typography?.headingFont
      ? `'${typography.headingFont}', Georgia, serif`
      : 'var(--font-serif, Georgia, serif)',
    '--font-body': typography?.bodyFont
      ? `'${typography.bodyFont}', system-ui, sans-serif`
      : 'var(--font-sans, system-ui, sans-serif)'
  };
}

export function getPresetTheme(preset: SiteThemePreset): SiteTheme {
  return SITE_THEME_PRESETS[preset];
}

export function updateSiteThemeColor(theme: SiteTheme, key: keyof SiteThemeColors, value: string): SiteTheme {
  return normalizeSiteTheme({
    ...theme,
    colors: {
      ...theme.colors,
      [key]: value
    }
  });
}

function tintColor(from: string, to: string, amount: number): string {
  return mixHex(from, to, amount);
}

function shadeColor(from: string, to: string, amount: number): string {
  return mixHex(from, to, amount);
}

function mixHex(from: string, to: string, amount: number): string {
  const a = parseHex(from);
  const b = parseHex(to);
  const mix = (start: number, end: number) => Math.round(start + (end - start) * amount);
  return toHex(mix(a.r, b.r), mix(a.g, b.g), mix(a.b, b.b));
}

function hexToRgba(hex: string, alpha: number): string {
  const color = parseHex(hex);
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}

function hexToRgb(hex: string): string {
  const color = parseHex(hex);
  return `${color.r}, ${color.g}, ${color.b}`;
}

function parseHex(hex: string): { r: number; g: number; b: number } {
  const normalized = isHexColor(hex) ? hex.slice(1) : '000000';
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16)
  };
}

function toHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const { r, g, b } = parseHex(hex);
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rn:
        h = ((gn - bn) / d) % 6;
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) {
    r = c; g = x; b = 0;
  } else if (h < 120) {
    r = x; g = c; b = 0;
  } else if (h < 180) {
    r = 0; g = c; b = x;
  } else if (h < 240) {
    r = 0; g = x; b = c;
  } else if (h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  return toHex(Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255));
}

function desaturateColor(hex: string, amountPercent: number): string {
  const { h, s, l } = hexToHsl(hex);
  const nextS = Math.max(0, s - amountPercent);
  return hslToHex(h, nextS, l);
}
