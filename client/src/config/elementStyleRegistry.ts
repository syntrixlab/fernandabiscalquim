import type { ElementStyleProp, ElementStyleStateName } from '@/types/elementStyles';

// Registry central que descreve TODOS os elementos personalizáveis do site público.
// Ele alimenta tanto a UI de acordeão no admin quanto a geração de CSS aplicada
// no site. Adicionar um novo elemento = adicionar uma entrada aqui (a UI e o CSS
// passam a suportá-lo automaticamente).

export type ElementDef = {
  /** Identificador único e estável (usado como chave em theme.elements). */
  id: string;
  label: string;
  description?: string;
  /**
   * Seletor CSS base (estado normal). O estado hover é derivado adicionando
   * `:hover`. Já deve vir escopado sob `.app-shell` para casar a especificidade
   * do CSS existente.
   */
  selector: string;
  /** Propriedades de cor disponíveis para este elemento. */
  props: ElementStyleProp[];
  /** Estados disponíveis. `normal` é sempre incluído. */
  states: ElementStyleStateName[];
  /**
   * Pseudo-classe usada para o estado "hover" na geração de CSS.
   * Padrão `:hover`. Campos de formulário usam `:focus`.
   */
  hoverPseudo?: string;
  /** Se true, o CSS deste elemento é tratado fora do gerador genérico (ex.: máscara). */
  skipCss?: boolean;
  /** Sobrescreve rótulos de propriedades na UI (ex.: bg -> "Cor do logo"). */
  propLabelOverrides?: Partial<Record<ElementStyleProp, string>>;
  /**
   * Seletores de filhos que também recebem a cor de TEXTO (color).
   * Necessário quando o texto vive em filhos com cor própria (ex.: título/resumo
   * de um card), pois `color` no pai não sobrescreve filhos com cor definida.
   * São relativos ao `selector` base (ex.: '.article-title').
   */
  textChildren?: string[];
  /**
   * Se definido, a propriedade `bg` deste elemento define uma CSS var
   * (em `bgVarSelector`, padrão `.app-shell`) em vez de `background` no seletor.
   * Útil quando outras partes do layout precisam acompanhar a mesma cor
   * (ex.: o degradê do fim do conteúdo acompanhar a cor do rodapé).
   */
  bgVarName?: string;
  bgVarSelector?: string;
  /** Se definido, a propriedade `bg` usa esta propriedade CSS (ex.: 'fill' para SVG) em vez de `background`. */
  bgCssProp?: string;
};

export type CategoryDef = {
  id: string;
  label: string;
  icon: string;
  description?: string;
  elements: ElementDef[];
};

const ALL_PROPS: ElementStyleProp[] = ['bg', 'text', 'border', 'shadow'];
const NO_SHADOW: ElementStyleProp[] = ['bg', 'text', 'border'];
const TEXT_ONLY: ElementStyleProp[] = ['text'];
const BOTH_STATES: ElementStyleStateName[] = ['normal', 'hover'];
const NORMAL_ONLY: ElementStyleStateName[] = ['normal'];

export const ELEMENT_PROP_LABELS: Record<ElementStyleProp, string> = {
  bg: 'Fundo',
  text: 'Texto',
  border: 'Borda',
  shadow: 'Sombra'
};

export const ELEMENT_STATE_LABELS: Record<ElementStyleStateName, string> = {
  normal: 'Normal',
  hover: 'Hover'
};

export const ELEMENT_STYLE_REGISTRY: CategoryDef[] = [
  {
    id: 'navbar',
    label: 'Navbar',
    icon: '▤',
    description: 'Barra de navegação no topo.',
    elements: [
      { id: 'nav-brand', label: 'Marca (nome)', description: 'Cor do nome do site.', selector: '.app-shell .nav-brand-name', props: TEXT_ONLY, states: NORMAL_ONLY },
      { id: 'nav-tagline', label: 'Tagline', description: 'Texto pequeno abaixo do nome.', selector: '.app-shell .nav-brand-tagline', props: TEXT_ONLY, states: NORMAL_ONLY },
      { id: 'nav-logo', label: 'Logo', description: 'Recolore o logo via máscara. Ideal PNG transparente.', selector: '.app-shell .nav-brand-logo', props: ['bg'], states: NORMAL_ONLY, skipCss: true, propLabelOverrides: { bg: 'Cor do logo' } },
      { id: 'link-navbar', label: 'Links', description: 'Itens de navegação.', selector: '.app-shell .nav-link', props: NO_SHADOW, states: BOTH_STATES },
      { id: 'navbar-cta', label: 'Botão CTA', description: 'Botão de destaque na navbar (ex.: "Agendar").', selector: '.app-shell .navbar .btn-primary', props: ALL_PROPS, states: BOTH_STATES },
      { id: 'navbar', label: 'Fundo da barra', description: 'Fundo, borda e sombra da barra.', selector: '.app-shell .navbar', props: ALL_PROPS, states: NORMAL_ONLY }
    ]
  },
  {
    id: 'hero',
    label: 'Hero',
    icon: '◈',
    description: 'Seção de destaque no topo das páginas.',
    elements: [
      { id: 'hero-title', label: 'Título', description: 'Título principal do hero.', selector: '.app-shell .hero h1, .app-shell .hero h2, .app-shell .hero h3', props: TEXT_ONLY, states: NORMAL_ONLY },
      { id: 'hero-description', label: 'Descrição', description: 'Parágrafos de descrição do hero.', selector: '.app-shell .hero p', props: TEXT_ONLY, states: NORMAL_ONLY },
      { id: 'hero-pills', label: 'Pills', description: 'Etiquetas/pills do hero.', selector: '.app-shell .hero .pill, .app-shell .hero .badge', props: NO_SHADOW, states: NORMAL_ONLY },
      { id: 'hero-cta', label: 'Botões CTA', description: 'Botões dentro do hero.', selector: '.app-shell .hero .btn', props: ALL_PROPS, states: BOTH_STATES },
      { id: 'hero-text', label: 'Texto', description: 'Textos secundários/discretos do hero.', selector: '.app-shell .hero .muted', props: TEXT_ONLY, states: NORMAL_ONLY },
      { id: 'hero', label: 'Fundo da seção', description: 'Fundo e borda da seção hero.', selector: '.app-shell .hero', props: NO_SHADOW, states: NORMAL_ONLY }
    ]
  },
  {
    id: 'blog',
    label: 'Blog e Artigos',
    icon: '▦',
    description: 'Listagem e páginas de artigos.',
    elements: [
      { id: 'blog-section-bg', label: 'Fundo das seções', description: 'Cor de fundo das caixas de seção do blog (Em destaque, Mais vistos, Todos os artigos).', selector: '.app-shell .blog-section', props: NO_SHADOW, states: NORMAL_ONLY, propLabelOverrides: { bg: 'Cor de fundo' } },
      { id: 'article-card', label: 'Card de artigo', description: 'Cartão de artigo no blog e posts recentes.', selector: '.app-shell .article-card', props: ALL_PROPS, states: BOTH_STATES, textChildren: ['.article-title', '.article-excerpt', '.article-meta', '.article-views'] },
      { id: 'article-chip', label: 'Etiqueta do card', description: 'Tag sobre a imagem do card.', selector: '.app-shell .article-chip', props: NO_SHADOW, states: NORMAL_ONLY },
      { id: 'button-article-cta', label: 'Botão "Ler mais"', description: 'Botão "Ler mais" nos cards.', selector: '.app-shell .article-cta', props: ALL_PROPS, states: BOTH_STATES },
      { id: 'button-outline', label: 'Botão "Ver todos"', description: 'Botão de contorno, ex.: "Ver todos os artigos".', selector: '.app-shell .btn-outline', props: NO_SHADOW, states: BOTH_STATES },
      { id: 'link-default', label: 'Link "Voltar ao blog"', description: 'Links de texto no conteúdo.', selector: '.app-shell .link', props: TEXT_ONLY, states: BOTH_STATES },
      { id: 'recent-title', label: 'Título "Conteúdos recentes"', description: 'Título da seção de artigos recentes e das seções do blog (Em destaque, Mais vistos, etc).', selector: '.app-shell .recent-posts-section .section-title h2, .app-shell .blog-header .section-title h1, .app-shell .blog-section .section-title h2', props: TEXT_ONLY, states: NORMAL_ONLY },
      { id: 'recent-bar', label: 'Barra degradê', description: 'Barrinha sob o título da seção de recentes e das seções do blog.', selector: '.app-shell .recent-posts-section .section-title h2::after, .app-shell .blog-header .section-title h1::after, .app-shell .blog-section .section-title h2::after', props: ['bg'], states: NORMAL_ONLY, propLabelOverrides: { bg: 'Cor da barra' } },
      { id: 'recent-subtitle', label: 'Descrição da seção', description: 'Texto abaixo do título dos recentes e das seções do blog.', selector: '.app-shell .recent-posts-section .section-title > p, .app-shell .blog-header .section-title > p, .app-shell .blog-section .section-title > p', props: TEXT_ONLY, states: NORMAL_ONLY }
    ]
  },
  {
    id: 'article-page',
    label: 'Página do artigo',
    icon: '▥',
    description: 'Artigo aberto (página de leitura).',
    elements: [
      { id: 'article-page-bg', label: 'Fundo da página', description: 'Cor de fundo da página do artigo aberto.', selector: '.app-shell .article-page', props: ['bg'], states: NORMAL_ONLY, propLabelOverrides: { bg: 'Cor de fundo' } },
      { id: 'article-page-title', label: 'Título', description: 'Título do artigo aberto.', selector: '.app-shell .article-page .section-title h1', props: TEXT_ONLY, states: NORMAL_ONLY },
      { id: 'article-page-excerpt', label: 'Resumo', description: 'Linha de resumo abaixo do título.', selector: '.app-shell .article-page .section-title > p', props: TEXT_ONLY, states: NORMAL_ONLY },
      { id: 'article-page-meta', label: 'Metadados', description: 'Data, visualizações e etiqueta de leitura.', selector: '.app-shell .article-page .section-title .muted, .app-shell .article-page .section-title .muted span', props: TEXT_ONLY, states: NORMAL_ONLY },
      { id: 'article-author-link', label: 'Autores', description: 'Links/etiquetas de autores do artigo (foto + nome).', selector: '.app-shell .article-author', props: NO_SHADOW, states: BOTH_STATES, textChildren: ['.article-author-name'] },
      { id: 'article-page-content', label: 'Conteúdo (caixa e texto)', description: 'Caixa e texto do corpo do artigo.', selector: '.app-shell .article-page .card', props: ALL_PROPS, states: NORMAL_ONLY, textChildren: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'strong', 'em', 'a'] },
      { id: 'article-page-cta', label: 'Botão "Conversar"', description: 'Botão de CTA ao final do artigo.', selector: '.app-shell .article-page .btn-primary', props: ALL_PROPS, states: BOTH_STATES }
    ]
  },
  {
    id: 'cta',
    label: 'Chamada para ação (CTA)',
    icon: '◆',
    description: 'Blocos de chamada para ação e WhatsApp.',
    elements: [
      { id: 'cta-block', label: 'Fundo do bloco CTA', description: 'Superfície do bloco de CTA.', selector: '.app-shell .cta-block', props: NO_SHADOW, states: NORMAL_ONLY },
      { id: 'cta-image', label: 'Máscara da imagem', description: 'Pinta a imagem/PNG do bloco CTA com uma cor sólida (usa o PNG como máscara, igual ao logo da navbar). Sem cor definida, a imagem aparece normal.', selector: '.app-shell .cta-media-mask', props: ['bg'], states: NORMAL_ONLY, skipCss: true, propLabelOverrides: { bg: 'Cor da máscara' } },
      { id: 'button-cta', label: 'Botão do bloco CTA', description: 'Botão dentro do bloco CTA.', selector: '.app-shell .cta-block .btn-primary', props: ALL_PROPS, states: BOTH_STATES },
      { id: 'whatsapp-cta', label: 'Botão WhatsApp (bloco)', description: 'Botão do bloco de CTA de WhatsApp.', selector: '.app-shell .whatsapp-cta-wrapper .page-public-button', props: ALL_PROPS, states: BOTH_STATES },
      { id: 'button-whatsapp-float', label: 'WhatsApp flutuante', description: 'Botão redondo flutuante de WhatsApp.', selector: '.app-shell .whatsapp-fab', props: ALL_PROPS, states: BOTH_STATES }
    ]
  },
  {
    id: 'footer',
    label: 'Rodapé',
    icon: '▤',
    description: 'Rodapé do site.',
    elements: [
      { id: 'footer', label: 'Fundo do rodapé', description: 'Fundo do rodapé (a emenda com o conteúdo acompanha).', selector: '.app-shell .footer', props: NO_SHADOW, states: NORMAL_ONLY, bgVarName: '--footer-surface', bgVarSelector: '.app-shell' },
      { id: 'footer-name', label: 'Nome', description: 'Nome do site no rodapé.', selector: '.app-shell .footer-heading', props: TEXT_ONLY, states: NORMAL_ONLY },
      { id: 'footer-tagline', label: 'Tagline', description: 'Tagline no rodapé.', selector: '.app-shell .footer-tagline', props: TEXT_ONLY, states: NORMAL_ONLY },
      { id: 'footer-copyright', label: 'Direitos reservados', description: 'Linha de copyright do rodapé.', selector: '.app-shell .footer-bottom .copyright', props: TEXT_ONLY, states: NORMAL_ONLY },
      { id: 'footer-social', label: 'Redes sociais', description: 'Botões de redes sociais (ícone, fundo e borda).', selector: '.app-shell .social-chip', props: NO_SHADOW, states: BOTH_STATES },
      { id: 'link-footer', label: 'Links do rodapé', description: 'Links de navegação no rodapé.', selector: '.app-shell .footer-link', props: TEXT_ONLY, states: BOTH_STATES },
      { id: 'footer-wave-back', label: 'Onda de trás', description: 'Cor da onda de trás.', selector: '.app-shell .footer-wave--back', props: ['bg'], states: NORMAL_ONLY, bgCssProp: 'fill', propLabelOverrides: { bg: 'Cor da onda' } },
      { id: 'footer-wave-front', label: 'Onda da frente', description: 'Cor da onda da frente.', selector: '.app-shell .footer-wave--front', props: ['bg'], states: NORMAL_ONLY, bgCssProp: 'fill', propLabelOverrides: { bg: 'Cor da onda' } },
      { id: 'footer-butterfly', label: 'Borboleta de fundo', description: 'Marca-d\u2019água da borboleta atrás do rodapé (cor + opacidade). Usa o logo.', selector: '.app-shell .footer-butterfly', props: ['bg'], states: NORMAL_ONLY, skipCss: true }
    ]
  },
  {
    id: 'forms',
    label: 'Formulários',
    icon: '▭',
    description: 'Campos e botões de formulário.',
    elements: [
      { id: 'form-input', label: 'Campos', description: 'Inputs, textareas e selects (normal e foco).', selector: '.app-shell .form-field input, .app-shell .form-field textarea, .app-shell .form-field select', props: NO_SHADOW, states: BOTH_STATES, hoverPseudo: ':focus' },
      { id: 'button-form-submit', label: 'Botão enviar', description: 'Botão de envio dos formulários.', selector: '.app-shell .form-submit', props: ALL_PROPS, states: BOTH_STATES }
    ]
  },
  {
    id: 'general',
    label: 'Componentes gerais',
    icon: '▢',
    description: 'Estilos padrão usados em todo o site (fallback).',
    elements: [
      { id: 'body-bg', label: 'Fundo geral', description: 'Cor de fundo de todas as páginas do site.', selector: '.app-shell', props: ['bg'], states: NORMAL_ONLY, propLabelOverrides: { bg: 'Cor de fundo' } },
      { id: 'app-main-bg', label: 'Fundo do conteúdo', description: 'Cor de fundo da área principal de conteúdo (entre a barra e o rodapé).', selector: '.app-shell .app-main', props: ['bg'], states: NORMAL_ONLY, propLabelOverrides: { bg: 'Cor de fundo' } },
      { id: 'button-primary', label: 'Botão primário', description: 'Botão de destaque padrão.', selector: '.app-shell .btn-primary', props: ALL_PROPS, states: BOTH_STATES },
      { id: 'button-secondary', label: 'Botão secundário', description: 'Botão pill com borda e seta.', selector: '.app-shell .btn-secondary', props: NO_SHADOW, states: BOTH_STATES },
      { id: 'button-ghost', label: 'Botão fantasma', description: 'Botão discreto de fundo suave.', selector: '.app-shell .btn-ghost', props: NO_SHADOW, states: BOTH_STATES },
      { id: 'card', label: 'Card genérico', description: 'Cartões de conteúdo.', selector: '.app-shell .card', props: ALL_PROPS, states: BOTH_STATES },
      { id: 'pill', label: 'Pill / tag', description: 'Etiquetas arredondadas destacadas.', selector: '.app-shell .pill', props: NO_SHADOW, states: NORMAL_ONLY },
      { id: 'badge', label: 'Badge', description: 'Selos discretos de informação.', selector: '.app-shell .badge', props: NO_SHADOW, states: NORMAL_ONLY }
    ]
  }
];

/** Mapa id -> definição, para lookup rápido. */
export const ELEMENT_DEF_BY_ID: Record<string, ElementDef> = Object.fromEntries(
  ELEMENT_STYLE_REGISTRY.flatMap((cat) => cat.elements).map((el) => [el.id, el])
);
