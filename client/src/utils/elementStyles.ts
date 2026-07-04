import {
  ELEMENT_DEF_BY_ID,
  ELEMENT_STYLE_REGISTRY,
  type ElementDef
} from '@/config/elementStyleRegistry';
import type {
  ElementStyle,
  ElementStyleProp,
  ElementStyleState,
  ElementStyleStateName,
  SiteElementStyles
} from '@/types/elementStyles';

// Valida um valor de cor de forma segura (evita injeção de CSS).
// Aceita: #rgb, #rrggbb, #rrggbbaa e funções rgb()/rgba()/hsl()/hsla().
const HEX_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const FUNC_RE = /^(?:rgb|rgba|hsl|hsla)\(\s*[0-9.,%\s/]+\)$/;

export function isSafeColor(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  if (!v || /[;{}<>]/.test(v)) return false;
  return HEX_RE.test(v) || FUNC_RE.test(v);
}

// CSS: como cada propriedade vira declaração(ões).
function propDeclarations(prop: ElementStyleProp, value: string): string[] {
  switch (prop) {
    case 'bg':
      return [`background: ${value} !important`];
    case 'text':
      return [`color: ${value} !important`];
    case 'border':
      // Garante que a borda apareça mesmo em elementos sem borda visível.
      return [`border-color: ${value} !important`, `border-style: solid !important`];
    case 'shadow':
      return [`box-shadow: 0 10px 30px -4px ${value} !important`];
    default:
      return [];
  }
}

function sanitizeState(def: ElementDef, state?: ElementStyleState): ElementStyleState | undefined {
  if (!state || typeof state !== 'object') return undefined;
  const out: ElementStyleState = {};
  for (const prop of def.props) {
    const raw = state[prop];
    if (isSafeColor(raw)) out[prop] = raw;
  }
  return Object.keys(out).length ? out : undefined;
}

/**
 * Normaliza os overrides de elementos: mantém apenas ids/props/estados
 * conhecidos e valores de cor válidos. Descarta lixo silenciosamente.
 */
export function normalizeSiteElementStyles(value?: unknown): SiteElementStyles {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const input = value as Record<string, unknown>;
  const out: SiteElementStyles = {};

  for (const [id, rawStyle] of Object.entries(input)) {
    const def = ELEMENT_DEF_BY_ID[id];
    if (!def || !rawStyle || typeof rawStyle !== 'object') continue;
    const style = rawStyle as ElementStyle;
    const normalized: ElementStyle = {};
    for (const stateName of def.states) {
      const cleaned = sanitizeState(def, style[stateName]);
      if (cleaned) normalized[stateName] = cleaned;
    }
    if (Object.keys(normalized).length) out[id] = normalized;
  }

  return out;
}

// Adiciona uma pseudo-classe a cada parte (separada por vírgula) de um seletor.
function withPseudo(selector: string, pseudo: string): string {
  return selector
    .split(',')
    .map((part) => `${part.trim()}${pseudo}`)
    .join(', ');
}

// Acrescenta um seletor de filho a cada parte (separada por vírgula) de um
// seletor base, opcionalmente aplicando uma pseudo-classe ao ancestral.
function descend(base: string, child: string, pseudo: string | null): string {
  return base
    .split(',')
    .map((part) => {
      const t = part.trim();
      return pseudo ? `${t}${pseudo} ${child}` : `${t} ${child}`;
    })
    .join(', ');
}

/**
 * Gera a folha de estilos de overrides. Só emite declarações para as
 * propriedades efetivamente definidas — o restante continua herdando do tema.
 * A cor de texto pode ser propagada para filhos declarados em `textChildren`,
 * pois `color` no elemento pai não sobrescreve filhos com cor própria.
 */
export function generateElementStylesCss(elements?: SiteElementStyles | null): string {
  const normalized = normalizeSiteElementStyles(elements);
  const rules: string[] = [];

  for (const category of ELEMENT_STYLE_REGISTRY) {
    for (const def of category.elements) {
      if (def.skipCss) continue;
      const style = normalized[def.id];
      if (!style) continue;

      const emit = (isHover: boolean) => {
        const stateObj = isHover ? style.hover : style.normal;
        if (!stateObj) return;
        if (isHover && !def.states.includes('hover')) return;

        const pseudo = def.hoverPseudo ?? ':hover';
        const baseSel = isHover ? withPseudo(def.selector, pseudo) : def.selector;

        // Propriedades que não são texto -> aplicadas no elemento base,
        // exceto `bg` quando o elemento define uma CSS var (bgVarName).
        const nonText: string[] = [];
        for (const prop of def.props) {
          if (prop === 'text') continue;
          const v = stateObj[prop];
          if (!isSafeColor(v)) continue;
          if (prop === 'bg' && def.bgVarName) {
            const varSel = def.bgVarSelector ?? '.app-shell';
            rules.push(`${varSel} { ${def.bgVarName}: ${v} !important; }`);
          } else if (prop === 'bg' && def.bgCssProp) {
            nonText.push(`${def.bgCssProp}: ${v} !important`);
          } else {
            nonText.push(...propDeclarations(prop, v));
          }
        }
        if (nonText.length) rules.push(`${baseSel} { ${nonText.join('; ')}; }`);

        // Texto (color): pode mirar o base e também filhos de texto.
        if (def.props.includes('text') && isSafeColor(stateObj.text)) {
          const decl = propDeclarations('text', stateObj.text).join('; ');
          const targets = [baseSel];
          if (def.textChildren?.length) {
            for (const child of def.textChildren) {
              targets.push(descend(def.selector, child, isHover ? pseudo : null));
            }
          }
          rules.push(`${targets.join(', ')} { ${decl}; }`);
        }
      };

      emit(false);
      emit(true);
    }
  }

  return rules.join('\n');
}
// Helpers imutáveis para a UI do admin.
export function setElementColor(
  elements: SiteElementStyles,
  id: string,
  state: ElementStyleStateName,
  prop: ElementStyleProp,
  value: string | null
): SiteElementStyles {
  const next: SiteElementStyles = { ...elements };
  const current: ElementStyle = { ...(next[id] ?? {}) };
  const currentState: ElementStyleState = { ...(current[state] ?? {}) };

  if (value && isSafeColor(value)) {
    currentState[prop] = value;
  } else {
    delete currentState[prop];
  }

  if (Object.keys(currentState).length) {
    current[state] = currentState;
  } else {
    delete current[state];
  }

  if (Object.keys(current).length) {
    next[id] = current;
  } else {
    delete next[id];
  }

  return next;
}

export function getElementColor(
  elements: SiteElementStyles | undefined,
  id: string,
  state: ElementStyleStateName,
  prop: ElementStyleProp
): string | undefined {
  return elements?.[id]?.[state]?.[prop];
}
