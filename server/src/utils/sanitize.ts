import sanitizeHtml, { Attributes } from 'sanitize-html';

export function sanitizeContent(html: string) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'figure',
      'blockquote',
      'iframe'
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['class', 'data-align', 'data-type', 'data-size', 'data-video-id'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'class', 'data-type', 'data-size', 'data-align'],
      figure: ['class', 'data-type', 'data-size', 'data-align'],
      iframe: ['src', 'title', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'loading', 'referrerpolicy'],
      a: ['href', 'name', 'target', 'rel']
    },
    // Restringe iframes exclusivamente a embeds do YouTube.
    allowedIframeHostnames: ['www.youtube-nocookie.com', 'www.youtube.com'],
    allowIframeRelativeUrls: false,
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: (tagName: string, attribs: Attributes) => ({
        tagName,
        attribs: { ...attribs, rel: 'noopener noreferrer' }
      })
    }
  });
}
