import DOMPurify from 'dompurify';

// Hosts de embed do YouTube permitidos. Qualquer iframe fora dessa lista é removido.
const ALLOWED_IFRAME_HOSTS = new Set(['www.youtube-nocookie.com', 'www.youtube.com', 'youtube.com', 'youtube-nocookie.com']);

let hookRegistered = false;
function ensureIframeHook() {
  if (hookRegistered) return;
  hookRegistered = true;
  DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName !== 'iframe') return;
    const el = node as unknown as Element;
    const src = el.getAttribute?.('src') ?? '';
    let ok = false;
    try {
      ok = ALLOWED_IFRAME_HOSTS.has(new URL(src).hostname);
    } catch {
      ok = false;
    }
    if (!ok) el.parentNode?.removeChild(el);
  });
}

export function RichText({ html }: { html: string }) {
  ensureIframeHook();
  const clean = DOMPurify.sanitize(html, {
    ADD_TAGS: ['figure', 'iframe'],
    ADD_ATTR: [
      'class',
      'data-type',
      'data-size',
      'data-align',
      'data-video-id',
      'allow',
      'allowfullscreen',
      'frameborder',
      'loading',
      'referrerpolicy'
    ],
    ALLOW_DATA_ATTR: true
  });
  return <div className="rich-content" dangerouslySetInnerHTML={{ __html: clean }} />;
}
