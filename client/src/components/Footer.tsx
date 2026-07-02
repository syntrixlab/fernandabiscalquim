import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faWhatsapp,
  faFacebook,
  faLinkedin,
  faYoutube,
  faTiktok,
  faXTwitter
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLink, faPhone, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from '@tanstack/react-query';
import { fetchNavbar } from '../api/queries';
import type { NavbarItem, SiteSettings, SocialLink } from '../types';

function formatCnpjDisplay(value?: string | null) {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 14) return value;
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

const socialIconMap: Record<SocialLink['platform'], any> = {
  instagram: faInstagram,
  whatsapp: faWhatsapp,
  facebook: faFacebook,
  linkedin: faLinkedin,
  youtube: faYoutube,
  tiktok: faTiktok,
  x: faXTwitter,
  email: faEnvelope,
  site: faGlobe,
  telefone: faPhone,
  custom: faLink
};

export function Footer({ settings }: { settings?: SiteSettings }) {
  const { data: navItems } = useQuery({ queryKey: ['navbar'], queryFn: fetchNavbar });
  const visibleNav = (navItems ?? [])
    .filter((item) => item.isVisible !== false && item.showInFooter)
    .sort((a, b) => (a.orderFooter ?? 0) - (b.orderFooter ?? 0));
  const socials = (settings?.socials ?? []).filter((item) => item.isVisible !== false);
  const year = new Date().getFullYear();

  const resolveHref = (item: NavbarItem) => {
    if (item.type === 'EXTERNAL_URL') return item.url ?? '#';
    const key = item.pageKey ?? '';
    if (!key || key === 'home') return '/';
    if (key === 'blog') return '/blog';
    if (key === 'sobre' || key === 'contato') return `/${key}`;
    return `/p/${key}`;
  };

  const parentMap = new Map(visibleNav.map((i) => [i.id, i]));
  const roots = visibleNav.filter((item) => {
    if (!item.parentId) return true;
    const parent = parentMap.get(item.parentId);
    return !parent || !parent.isParent;
  });
  const childrenMap = visibleNav.reduce<Record<string, NavbarItem[]>>((acc, item) => {
    if (item.parentId) {
      const parent = parentMap.get(item.parentId);
      if (parent && parent.isParent) {
        acc[item.parentId] = acc[item.parentId] || [];
        acc[item.parentId].push(item);
      }
    }
    return acc;
  }, {});
  Object.values(childrenMap).forEach((list) => list.sort((a, b) => (a.orderFooter ?? 0) - (b.orderFooter ?? 0)));

  const formatUrl = (link: SocialLink) => {
    if (link.platform === 'email') return `mailto:${link.url.replace(/^mailto:/i, '')}`;
    if (link.platform === 'whatsapp') {
      const digits = link.url.replace(/\D/g, '');
      return `https://wa.me/${digits}`;
    }
    if (link.platform === 'telefone') return `tel:${link.url.replace(/\D/g, '')}`;
    return link.url;
  };

  const siteName = settings?.siteName || 'seusite.com.br';
  const brandTagline = (settings?.brandTagline ?? '').trim();
  const showBrandTagline = brandTagline.length > 0;
  const hasMetaLine = Boolean(settings?.cnpj || settings?.crp || settings?.contactEmail);

  return (
    <footer className="footer brand-footer">
      {/* Camada decorativa (ondas do tema) — puramente ilustrativa, sem interação */}
      <div className="footer-illus" aria-hidden="true">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path
            className="footer-wave footer-wave--back"
            d="M0,192L60,208C120,224,240,256,360,256C480,256,600,224,720,186.7C840,149,960,107,1080,101.3C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
          <path
            className="footer-wave footer-wave--front"
            d="M0,64L60,96C120,128,240,192,360,218.7C480,245,600,235,720,224C840,213,960,203,1080,170.7C1200,139,1320,85,1380,58.7L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
      </div>

      <div className="container footer-content">
        <div className="footer-hero">
          <strong className="footer-heading">{siteName}</strong>
          {showBrandTagline && <p className="footer-tagline">{brandTagline}</p>}
          {hasMetaLine && (
            <div className="footer-meta-line muted">
              {settings?.cnpj && <span>CNPJ: {formatCnpjDisplay(settings.cnpj)}</span>}
              {settings?.crp && <span>CRP: {settings.crp}</span>}
              {settings?.contactEmail && (
                <a href={`mailto:${settings.contactEmail}`} className="footer-link">
                  {settings.contactEmail}
                </a>
              )}
            </div>
          )}
        </div>

        {roots.length > 0 && (
          <nav aria-label="Links do rodapé">
            <ul className="footer-links-row">
              {roots.map((item) => (
                <li key={item.id} className="footer-links-item">
                  {item.type === 'EXTERNAL_URL' ? (
                    <a href={resolveHref(item)} className="footer-link" target="_blank" rel="noreferrer">
                      {item.label}
                    </a>
                  ) : (
                    <a href={resolveHref(item)} className="footer-link">
                      {item.label}
                    </a>
                  )}
                  {(childrenMap[item.id] ?? []).length > 0 && (
                    <div className="footer-sub-links">
                      {childrenMap[item.id].map((child) =>
                        child.type === 'EXTERNAL_URL' ? (
                          <a key={child.id} href={resolveHref(child)} className="footer-link" target="_blank" rel="noreferrer">
                            {child.label}
                          </a>
                        ) : (
                          <a key={child.id} href={resolveHref(child)} className="footer-link">
                            {child.label}
                          </a>
                        )
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {year} {siteName}. Todos os direitos reservados.
          </p>
          <div className="footer-social-list">
            {socials.map((link) => {
              const href = formatUrl(link);
              const isExternal = /^https?:/i.test(href);
              return (
                <a
                  key={link.id}
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noreferrer' : undefined}
                  className="social-chip"
                  aria-label={link.label || link.platform}
                >
                  <FontAwesomeIcon icon={socialIconMap[link.platform]} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
