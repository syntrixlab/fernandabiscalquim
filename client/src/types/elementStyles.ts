// Personalização granular de cores por elemento/estado do site público.
//
// A ideia: para cada elemento (ex.: botão CTA, link "Voltar ao blog", card, pill),
// o usuário pode sobrescrever as cores de fundo/texto/borda/sombra nos estados
// normal e hover. Quando uma propriedade NÃO é definida, o elemento continua
// reagindo ao tema escolhido nas configurações (fallback pelas variáveis do tema).
//
// Estes dados são salvos dentro do campo JSON `theme.elements`, então não exigem
// migração de banco.

/** Propriedades de cor customizáveis por elemento. */
export type ElementStyleProp = 'bg' | 'text' | 'border' | 'shadow';

/** Estados em que as cores podem variar. */
export type ElementStyleStateName = 'normal' | 'hover';

/** Cores de um estado. Cada valor é opcional — ausente = herda do tema. */
export type ElementStyleState = Partial<Record<ElementStyleProp, string>>;

/** Estilo completo de um elemento (por estado). */
export type ElementStyle = Partial<Record<ElementStyleStateName, ElementStyleState>>;

/** Mapa de overrides: id do elemento (ex.: "button-cta") -> estilo. */
export type SiteElementStyles = Record<string, ElementStyle>;
