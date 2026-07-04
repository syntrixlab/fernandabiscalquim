import { useQuery } from '@tanstack/react-query';
import { fetchSiteSettings } from '@/api/queries';
import type { SiteSettings } from '@/types';
import type { BlockRendererProps } from '../_shared/types';
import type { CtaBlockData } from './schema';

export function CtaRenderer({ data }: BlockRendererProps<CtaBlockData>) {
  // Cor de máscara opcional (Configurações > Elementos > CTA > Máscara da imagem).
  // Quando definida, o PNG é pintado como silhueta sólida usando a própria imagem
  // como máscara — mesmo comportamento do logo na navbar.
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['site-settings'],
    queryFn: fetchSiteSettings
  });
  const maskColor = settings?.theme?.elements?.['cta-image']?.normal?.bg;

  const title = data.title ?? 'Vamos conversar?';
  const text = data.text ?? 'Agende uma conversa inicial para entender o melhor plano.';
  const ctaLabel = data.ctaLabel ?? 'Agendar';
  const ctaHref = data.ctaHref ?? '/contato';
  const imageUrl = data.imageUrl ?? null;
  const imageAlt = data.imageAlt ?? '';
  const imageSide = data.imageSide ?? 'right';
  const useMask = Boolean(maskColor && imageUrl);
  const dissolve = (data.imageDissolve ?? true) && !useMask;
  const dissolveStrength = data.imageDissolveStrength ?? 'medium';
  const openInNewTab = data.ctaLinkMode === 'manual' && /^https?:\/\//i.test(ctaHref);

  const mediaClasses = imageUrl
    ? [
        'cta-block--with-media',
        `cta-block--img-${imageSide}`,
        dissolve ? `cta-block--dissolve-${dissolveStrength}` : 'cta-block--no-dissolve'
      ].join(' ')
    : 'cta-block--no-media';

  return (
    <div className={`cta-block ${mediaClasses}`.trim()}>
      <div className="cta-content">
        <div className="section-title" style={{ marginBottom: '1rem' }}>
          <h2>{title}</h2>
          {text && <p>{text}</p>}
        </div>
        <div className="cta-actions">
          <a className="btn btn-primary" href={ctaHref} target={openInNewTab ? '_blank' : undefined} rel={openInNewTab ? 'noreferrer' : undefined}>
            {ctaLabel}
          </a>
        </div>
      </div>
      {imageUrl && (
        <div className="cta-media" aria-hidden="true">
          {useMask ? (
            <div
              className="cta-media-mask"
              role="img"
              aria-label={imageAlt || undefined}
              style={{
                backgroundColor: maskColor,
                WebkitMaskImage: `url("${imageUrl}")`,
                maskImage: `url("${imageUrl}")`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                WebkitMaskSize: 'contain',
                maskSize: 'contain'
              }}
            />
          ) : (
            <img src={imageUrl} alt={imageAlt} loading="lazy" />
          )}
        </div>
      )}
    </div>
  );
}
