import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import {
  ELEMENT_PROP_LABELS,
  ELEMENT_STATE_LABELS,
  ELEMENT_STYLE_REGISTRY,
  type CategoryDef,
  type ElementDef
} from '@/config/elementStyleRegistry';
import { getElementColor, isSafeColor, setElementColor } from '@/utils/elementStyles';
import type {
  ElementStyleProp,
  ElementStyleStateName,
  SiteElementStyles
} from '@/types/elementStyles';

type Props = {
  elements: SiteElementStyles;
  onChange: (next: SiteElementStyles) => void;
};

const DEFAULT_SWATCH = '#8d2b00';

function ColorField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string | null) => void;
}) {
  const isSet = isSafeColor(value);
  // O input nativo só aceita #rrggbb; para valores avançados (rgba/hsl) usamos o texto.
  const pickerValue = isSet && /^#[0-9a-fA-F]{6}$/.test(value as string) ? (value as string) : DEFAULT_SWATCH;

  return (
    <div className="element-color-field">
      <div className="element-color-field-head">
        <span>{label}</span>
        {isSet && (
          <button
            type="button"
            className="element-color-reset"
            onClick={() => onChange(null)}
            title="Voltar a herdar do tema"
            aria-label={`Limpar ${label}`}
          >
            <FontAwesomeIcon icon={faRotateLeft} />
          </button>
        )}
      </div>
      <div className="color-input-wrapper element-color-inputs">
        <input
          type="color"
          value={pickerValue}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label} (seletor de cor)`}
          className={isSet ? '' : 'is-inherited'}
        />
        <input
          type="text"
          value={isSet ? (value as string) : ''}
          onChange={(e) => {
            const v = e.target.value.trim();
            onChange(v ? v : null);
          }}
          placeholder="herda do tema"
        />
      </div>
    </div>
  );
}

function parseColorOpacity(value: string | undefined): { hex: string; opacity: number } {
  if (value) {
    const m = value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i);
    if (m) {
      const hex = '#' + [m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, '0')).join('');
      const a = m[4] !== undefined ? parseFloat(m[4]) : 1;
      return { hex, opacity: Math.round(a * 100) };
    }
    if (/^#[0-9a-fA-F]{6}$/.test(value)) return { hex: value, opacity: 100 };
  }
  return { hex: '#ffffff', opacity: 20 };
}

function composeRgba(hex: string, opacity: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`;
}

function FooterButterflyControl({
  elements,
  onChange
}: {
  elements: SiteElementStyles;
  onChange: (next: SiteElementStyles) => void;
}) {
  const current = getElementColor(elements, 'footer-butterfly', 'normal', 'bg');
  const isSet = isSafeColor(current);
  const { hex, opacity } = parseColorOpacity(current);
  const effOpacity = isSet ? opacity : 20;
  const update = (nextHex: string, nextOpacity: number) => {
    onChange(setElementColor(elements, 'footer-butterfly', 'normal', 'bg', composeRgba(nextHex, nextOpacity)));
  };
  return (
    <div className="element-state-row">
      <span className="element-state-label">Marca-d’água (usa o logo)</span>
      <div className="element-props-grid">
        <div className="element-color-field">
          <div className="element-color-field-head"><span>Cor</span></div>
          <div className="color-input-wrapper element-color-inputs">
            <input type="color" value={hex} onChange={(e) => update(e.target.value, effOpacity)} aria-label="Cor da borboleta" />
            <input type="text" value={isSet ? (current as string) : ''} readOnly placeholder="herda do tema" />
          </div>
        </div>
        <div className="element-color-field">
          <div className="element-color-field-head"><span>Opacidade: {isSet ? opacity : 0}%</span></div>
          <input
            type="range"
            min={0}
            max={100}
            value={effOpacity}
            onChange={(e) => update(hex, Number(e.target.value))}
            aria-label="Opacidade da borboleta"
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}

function StateRow({
  def,
  state,
  elements,
  onChange
}: {
  def: ElementDef;
  state: ElementStyleStateName;
  elements: SiteElementStyles;
  onChange: (next: SiteElementStyles) => void;
}) {
  return (
    <div className="element-state-row">
      <span className="element-state-label">{ELEMENT_STATE_LABELS[state]}</span>
      <div className="element-props-grid">
        {def.props.map((prop: ElementStyleProp) => (
          <ColorField
            key={prop}
            label={def.propLabelOverrides?.[prop] ?? ELEMENT_PROP_LABELS[prop]}
            value={getElementColor(elements, def.id, state, prop)}
            onChange={(value) => onChange(setElementColor(elements, def.id, state, prop, value))}
          />
        ))}
      </div>
    </div>
  );
}

function countOverrides(elements: SiteElementStyles, def: ElementDef): number {
  const style = elements[def.id];
  if (!style) return 0;
  let count = 0;
  for (const state of def.states) {
    const s = style[state];
    if (s) count += Object.keys(s).length;
  }
  return count;
}

function ElementAccordion({
  def,
  elements,
  onChange
}: {
  def: ElementDef;
  elements: SiteElementStyles;
  onChange: (next: SiteElementStyles) => void;
}) {
  const [open, setOpen] = useState(false);
  const overrides = countOverrides(elements, def);

  return (
    <div className={`element-accordion ${open ? 'is-open' : ''}`}>
      <button type="button" className="element-accordion-head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <FontAwesomeIcon icon={faChevronDown} className="element-accordion-chevron" />
        <span className="element-accordion-title">
          <strong>{def.label}</strong>
          {def.description && <span className="muted small">{def.description}</span>}
        </span>
        {overrides > 0 && <span className="element-accordion-badge">{overrides}</span>}
      </button>
      {open && (
        <div className="element-accordion-body">
          {def.id === 'footer-butterfly' ? (
            <FooterButterflyControl elements={elements} onChange={onChange} />
          ) : (
            def.states.map((state) => (
              <StateRow key={state} def={def} state={state} elements={elements} onChange={onChange} />
            ))
          )}
          {overrides > 0 && (
            <button
              type="button"
              className="btn btn-outline btn-sm element-clear-all"
              onClick={() => {
                const next = { ...elements };
                delete next[def.id];
                onChange(next);
              }}
            >
              Limpar tudo deste elemento
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function CategoryAccordion({
  category,
  elements,
  onChange,
  defaultOpen
}: {
  category: CategoryDef;
  elements: SiteElementStyles;
  onChange: (next: SiteElementStyles) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const total = category.elements.reduce((sum, def) => sum + (elements[def.id] ? 1 : 0), 0);

  return (
    <div className={`element-category ${open ? 'is-open' : ''}`}>
      <button type="button" className="element-category-head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="element-category-icon" aria-hidden="true">{category.icon}</span>
        <span className="element-category-title">
          <strong>{category.label}</strong>
          {category.description && <span className="muted small">{category.description}</span>}
        </span>
        {total > 0 && <span className="element-category-badge">{total}</span>}
        <FontAwesomeIcon icon={faChevronDown} className="element-category-chevron" />
      </button>
      {open && (
        <div className="element-category-body">
          {category.elements.map((def) => (
            <ElementAccordion key={def.id} def={def} elements={elements} onChange={onChange} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ElementStyleEditor({ elements, onChange }: Props) {
  return (
    <div className="element-style-editor">
      {ELEMENT_STYLE_REGISTRY.map((category, index) => (
        <CategoryAccordion
          key={category.id}
          category={category}
          elements={elements}
          onChange={onChange}
          defaultOpen={index === 0}
        />
      ))}
    </div>
  );
}
