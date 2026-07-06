import type { Media, SocialLink } from './auth';
import type { Page } from './layout';
import type { SiteElementStyles } from './elementStyles';

export type ArticleAuthor = {
  name: string;
  photoUrl?: string | null;
  photoMediaId?: string | null;
  /** Link do perfil no Instituto Junguiano de Ensino e Pesquisa (IJEP). */
  profileUrl?: string | null;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  authors?: ArticleAuthor[];
  publishedAt?: string | null;
  status: 'draft' | 'published';
  isFeatured: boolean;
  views: number;
  createdAt?: string;
  updatedAt?: string;
  coverMediaId?: string | null;
  coverMedia?: Media | null;
  coverImageUrl?: string | null;
  coverAlt?: string | null;
  coverCrop?: Record<string, unknown> | null;
  coverOriginalUrl?: string | null;
};

export type SiteThemePreset = 'terra-oliva' | 'sereno-azul' | 'salvia' | 'vinho-suave' | 'ameixa-rosa';

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

export type SiteTheme = {
  preset: SiteThemePreset;
  colors: SiteThemeColors;
  typography?: SiteTypography;
  /** Overrides granulares de cor por elemento/estado (opcional). */
  elements?: SiteElementStyles;
};

export type SiteAddress = {
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip?: string;
};

export type OfficeHour = {
  label: string;
  hours: string;
};

export type SiteSettings = {
  siteName: string;
  cnpj?: string | null;
  crp?: string | null;
  contactEmail?: string | null;
  logoUrl?: string | null;
  phone?: string | null;
  address?: SiteAddress | null;
  officeHours?: OfficeHour[] | null;
  socials: SocialLink[];
  whatsappEnabled?: boolean | null;
  whatsappLink?: string | null;
  whatsappMessage?: string | null;
  whatsappPosition?: 'right' | 'left' | null;
  hideScheduleCta?: boolean | null;
  brandTagline?: string | null;
  theme?: SiteTheme | null;
  metaDescription?: string | null;
  ogImageUrl?: string | null;
  gaId?: string | null;
  gscVerification?: string | null;
};

export type FormSubmission = {
  id: string;
  pageId: string;
  formBlockId: string;
  data: Record<string, unknown>;
  summary?: Record<string, unknown> | null;
  userAgent?: string | null;
  ip?: string | null;
  createdAt: string;
  updatedAt: string;
  page?: Page;
};
