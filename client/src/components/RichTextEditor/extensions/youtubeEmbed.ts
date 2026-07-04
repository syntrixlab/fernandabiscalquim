import { Node, mergeAttributes } from '@tiptap/core';

/**
 * Node de vídeo do YouTube.
 *
 * Guarda apenas o `videoId` (11 caracteres) e renderiza um wrapper responsivo
 * (`div.rte-youtube`) contendo o `iframe` de embed. O bloco fica exatamente na
 * posição onde foi inserido no texto, como qualquer outro bloco do editor.
 *
 * A cor/raio da moldura são controlados via CSS (variáveis de tema), então o
 * vídeo acompanha o tema escolhido nas configurações.
 */

const YT_ID = /^[a-zA-Z0-9_-]{11}$/;

/** Extrai o ID de 11 caracteres de qualquer formato comum de URL do YouTube. */
export function extractYoutubeId(input: string): string | null {
  const value = (input ?? '').trim();
  if (!value) return null;

  // Já é um ID puro.
  if (YT_ID.test(value)) return value;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, '').toLowerCase();

  // youtu.be/<id>
  if (host === 'youtu.be') {
    const id = url.pathname.split('/').filter(Boolean)[0] ?? '';
    return YT_ID.test(id) ? id : null;
  }

  if (host === 'youtube.com' || host === 'youtube-nocookie.com' || host === 'm.youtube.com') {
    // watch?v=<id>
    const v = url.searchParams.get('v');
    if (v && YT_ID.test(v)) return v;

    // /embed/<id>, /shorts/<id>, /live/<id>, /v/<id>
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length >= 2 && ['embed', 'shorts', 'live', 'v'].includes(parts[0])) {
      return YT_ID.test(parts[1]) ? parts[1] : null;
    }
  }

  return null;
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    youtubeEmbed: {
      /** Insere um vídeo do YouTube na posição atual do cursor. */
      setYoutubeVideo: (options: { src: string }) => ReturnType;
    };
  }
}

export const YoutubeEmbed = Node.create({
  name: 'youtubeEmbed',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      videoId: { default: '', rendered: false }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="youtube"]',
        getAttrs: (element) => {
          if (typeof element === 'string' || typeof element.querySelector !== 'function') return false;
          const fromData = element.getAttribute('data-video-id') ?? '';
          if (YT_ID.test(fromData)) return { videoId: fromData };
          const iframe = element.querySelector('iframe');
          const id = extractYoutubeId(iframe?.getAttribute('src') ?? '');
          return id ? { videoId: id } : false;
        }
      }
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const videoId = String(node.attrs.videoId ?? '');

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'rte-youtube',
        'data-type': 'youtube',
        'data-video-id': videoId
      }),
      [
        'iframe',
        {
          src: youtubeEmbedUrl(videoId),
          title: 'Vídeo do YouTube',
          frameborder: '0',
          allow:
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
          allowfullscreen: 'true',
          loading: 'lazy',
          referrerpolicy: 'strict-origin-when-cross-origin'
        }
      ]
    ];
  },

  addCommands() {
    return {
      setYoutubeVideo:
        (options) =>
        ({ commands }) => {
          const videoId = extractYoutubeId(options.src);
          if (!videoId) return false;
          return commands.insertContent({ type: this.name, attrs: { videoId } });
        }
    };
  }
});
