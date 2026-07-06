---
name: Fernanda Biscalquim — Psicoterapia
description: CMS de blocos cujo design é uma arquitetura de personalização — temas globais e overrides de cor por componente/módulo. As cores abaixo são apenas o seed do preset padrão, não a identidade.
colors:
  terracotta: "#8d2b00"
  terracotta-strong: "#b55119"
  clay: "#be6731"
  deep: "#1f2d16"
  forest: "#545e45"
  olive: "#76704c"
  paper: "#f9f4ec"
  shell: "#f3ede4"
  surface: "#fffaf4"
  lines: "#545e452e"
typography:
  brand:
    fontFamily: "Satisfy, cursive"
    fontWeight: 400
    letterSpacing: "normal"
  display:
    fontFamily: "var(--font-heading), Georgia, serif"
    fontSize: "clamp(2rem, 3vw, 2.6rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "var(--font-heading), Georgia, serif"
    fontSize: "clamp(1.5rem, 3vw, 2.1rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 700
    letterSpacing: "0.04em"
rounded:
  sm: "12px"
  md: "14px"
  lg: "18px"
  block: "16px"
  section: "20px"
  pill: "999px"
spacing:
  "1": "0.35rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "7": "3rem"
  "8": "4rem"
components:
  button-primary:
    backgroundColor: "{colors.clay}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0.95rem 2.25rem"
  button-primary-hover:
    backgroundColor: "{colors.clay}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0.95rem 2.25rem"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.deep}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 0.55rem 0.55rem 1.45rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.deep}"
    rounded: "{rounded.md}"
    padding: "0.85rem 1.35rem"
  pill:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0.45rem 0.9rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.deep}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
---

# Design System: Fernanda Biscalquim — Psicoterapia

## 1. Overview

**Creative North Star: "A Sala Personalizável"**

A identidade deste sistema **não é uma paleta** — é uma arquitetura de personalização. O objetivo da plataforma é o máximo de controle nas mãos de quem administra: temas globais trocáveis e, além deles, override de cor por componente/módulo (fundo, texto, borda e sombra, em estados normal e hover). Duas instalações do mesmo código podem parecer marcas completamente diferentes sem tocar em uma linha de estilo. O que permanece constante — e é onde mora a identidade real — é a estrutura: hierarquia editorial por tipografia e respiro, formas táteis, linguagem de sombra quente e o ritmo que dá espaço ao interior.

A cor é totalmente dirigida por dados. Um tema define **quatro cores-base** (fundo, texto, primária, acento) das quais `siteTheme.ts` deriva mais de vinte tokens; sobre isso, `elementStyleRegistry.ts` permite sobrescrever cor por elemento individual. Existem cinco presets de fábrica (terra-oliva, sereno-azul, salvia, vinho-suave, ameixa-rosa), mas nenhum é canônico — são pontos de partida. Os valores hex neste documento são apenas o seed do preset `terra-oliva`; tratá-los como "as cores da marca" seria um erro. O design tem que ficar coerente com **qualquer** tema e com overrides arbitrários por módulo.

O sistema rejeita explicitamente o registro corporativo (hero-métrica de SaaS, grids de cards idênticos, linguagem de "soluções") e os tells de conteúdo gerado por IA (eyebrow em maiúsculas com tracking largo acima de cada seção, marcadores 01/02/03 como scaffolding, texto em gradiente, glassmorphism decorativo). Também foge do clínico-frio (azul-hospitalar, consultório estéril) e do "wellness" genérico de banco de imagens.

**Key Characteristics:**

- Personalização em primeiro lugar: tema global + override de cor por componente/módulo.
- Cor dirigida por dados: nada de valor fixo; identidade vive na estrutura, não na paleta.
- Editorial e espaçado: hierarquia por tipografia e respiro, não por caixas.
- Táteis e vivos: pills arredondados, micro-movimento no hover, sombras suaves.
- Profundidade sobre pressa: ritmo que dá espaço ao interior.

## 2. Colors

Cor aqui é **sistema, não paleta**. Não existe "cor da marca" fixa: cada instalação pinta o site pelo tema e pelos overrides por módulo. O que se documenta é a *estrutura de papéis*, não os valores. Os hex citados são só o seed do preset `terra-oliva` — ilustram os papéis, não os prescrevem.

### As quatro cores-base (definidas por tema)

Todo tema é definido por quatro entradas em `siteTheme.ts`, e todo o resto deriva delas:

- **`primary`**: voz de ação — CTAs primários, links em hover, pills de destaque, traço sob os títulos. (Seed terra-oliva: `#8d2b00`.)
- **`accent`**: detalhe e brilho — gradiente dos botões, halos radiais em cards, glow de foco. (Seed: `#be6731`.)
- **`text`**: tinta — títulos e corpo de alto contraste; o sistema deriva tons secundários (floresta/oliva) a partir dele. (Seed: `#1f2d16`.)
- **`background`**: superfície — fundo base do qual se derivam as camadas claras (shell, surface, section). (Seed: `#f9f4ec`.)

`siteTheme.ts` expande esses quatro em 20+ tokens (`--color-terracotta`, `--color-clay`, `--color-forest`, `--color-surface`, `--theme-primary-rgb`, etc.). Nomes de token herdados da paleta original — a cor que carregam depende do tema.

### Override por componente/módulo

Sobre o tema global, `elementStyleRegistry.ts` expõe, para cada elemento personalizável (navbar, botões, cards, formulários, rodapé…), quatro propriedades — **fundo, texto, borda, sombra** — em estados **normal e hover**. O admin pinta módulo a módulo; a UI e o CSS aplicado saem automaticamente do registry. Adicionar um elemento personalizável = uma entrada no registry.

### Named Rules

**The Theme-Token Rule.** Proibido escrever cor fixa em componente. Toda cor sai de um token (`var(--color-*)`, `rgba(var(--theme-*-rgb), a)`) ou de um override do registry. Cor literal (`#8d2b00`) num componente é bug, não estilo — quebra o tema e a personalização por módulo.

**The No-Signature-Color Rule.** Nenhuma cor específica "pertence" à marca. Se uma decisão de design só funciona com terracota, ela está errada: tem que sobreviver a um tema azul, vinho ou verde e a um override arbitrário por módulo. A identidade está na estrutura (tipo, ritmo, forma, sombra), não no matiz.

## 3. Typography

**Brand Font:** Satisfy (script, cursivo) — exclusiva do logotipo/nome da marca.
**Display / Heading Font:** configurável via `--font-heading` (padrão Georgia, serif).
**Body Font:** Manrope (com fallback system-ui).
**Accent Font:** Quicksand — títulos de blocos de serviços.

**Character:** Um par por eixo de contraste: serifada editorial nos títulos contra a Manrope humanista e limpa no corpo. A Satisfy aparece só na assinatura da marca, como um toque manuscrito e humano. Nada de duas sans parecidas competindo.

### Hierarchy

- **Brand** (Satisfy, 400): apenas o nome/logo. Toque manuscrito, uso raríssimo.
- **Display** (600, `clamp(2rem, 3vw, 2.6rem)`, -0.02em): títulos de seção, com traço em gradiente por baixo.
- **Headline** (600, `clamp(1.5rem, 3vw, 2.1rem)`): títulos de artigo e cabeçalhos internos.
- **Body** (400, 1rem, line-height 1.7): texto corrido. Manter linha em 65–75ch para leitura confortável.
- **Label** (700, 0.85rem, tracking 0.04em, maiúsculas): pills e badges — o único lugar onde maiúsculas com tracking são permitidas.

### Named Rules

**The One-Script Rule.** A Satisfy é só da marca. Usá-la em título de seção ou corpo quebra a hierarquia e vira decoração. Uma voz manuscrita, um lugar.

**The Editorial-Air Rule.** Hierarquia se faz com tamanho, peso e respiro — nunca com eyebrow em maiúsculas acima de cada seção. Se um título precisa de kicker, ele precisa de espaço.

## 4. Elevation

O sistema usa **sombras suaves e difusas** para dar leveza e flutuação — cards e elementos parecem pousar sobre a superfície. A profundidade é ambiental (aconchego), não estrutural (separação dura). O padrão tinge a sombra com a cor do texto/tema translúcido (nunca preto neutro), e a sombra de cada módulo também é override do registry — então ela acompanha o tema em vez de ser um cinza fixo.

### Shadow Vocabulary

- **Soft** (`box-shadow: 0 18px 48px rgba(31,45,22,0.12)`): repouso de cards e superfícies elevadas.
- **Floating** (`box-shadow: 0 28px 70px rgba(31,45,22,0.16)`): elementos flutuantes (modais, dropdowns, hover mais pronunciado).
- **Accent glow** (`0 20px 30px -6px rgba(var(--theme-accent-rgb), 0.5)`): sob botões primários públicos — o brilho segue o accent do tema.

### Named Rules

**The Themed-Shadow Rule.** Sombra nunca é preto neutro fixo. O padrão deriva da cor do tema (texto/accent translúcido) e é sobrescrevível por módulo — a profundidade acompanha a personalização, não a contraria.

## 5. Components

### Buttons

- **Shape:** pills totalmente arredondados nas páginas públicas (`999px`); no admin, cantos suaves (`14px`).
- **Primary:** gradiente argila→argila-suave (`--color-clay` → `--color-clay-soft`), texto branco, glow do accent embaixo. Padding generoso (`0.95rem 2.25rem`). Táctil e convidativo.
- **Hover / Focus:** primário desce 3px (afunda) e apaga o glow — micro-movimento que responde ao toque; foco visível com `outline: 3px solid rgba(var(--theme-accent-rgb), 0.45)`.
- **Secondary:** pill sem preenchimento, borda em argila, com seta circular que desliza 5px no hover. Nunca um verde-limão fixo — a cor vem do tema.
- **Outline / Ghost:** borda floresta ou fundo accent translúcido a 12%, para ações de baixa ênfase.

### Chips / Pills & Badges

- **Pill:** fundo terracota, texto papel, maiúsculas com tracking 0.04em — destaque de alta ênfase.
- **Badge:** fundo oliva translúcido (12%), texto floresta, borda hairline. Metadado discreto.

### Cards / Containers

- **Corner Style:** `18px` (lg) para cards, `16px` para blocos, `20px` para containers de seção.
- **Background:** gradiente sutil claro (`#fffefb → #f7f1e9`), derivado do fundo do tema.
- **Shadow Strategy:** `soft` no repouso (ver Elevation).
- **Border:** hairline em `--color-lines` (oliva translúcido).
- **Signature:** halo radial em accent no canto (`radial-gradient(... rgba(var(--theme-accent-rgb), 0.12) ...)`) — detalhe decorativo que segue o tema.
- **Internal Padding:** `1.5rem` (space-5).

### Inputs / Fields

- **Style:** fundo claro, borda hairline em primary translúcido, cantos `12px`.
- **Focus:** `outline: 2–3px solid rgba(var(--theme-primary-rgb), 0.2–0.4)` + borda reforçada. O foco carrega a cor do tema.

### Navigation

- Navbar sem fundo próprio no topo (alpha 0), assumindo tint creme após ~120px de rolagem para emendar sem degrau com o conteúdo. Links herdam a cor do texto; hover em terracota.

### Section Title (signature)

Título com traço curto em gradiente (floresta→argila, `96px × 8px`, cantos `999px`) por baixo — a marca visual das seções, no lugar de eyebrows.

## 6. Do's and Don'ts

### Do:

- **Do** derivar toda cor de token do tema (`var(--color-*)`, `rgba(var(--theme-*-rgb), a)`) ou de override do registry, para o componente reagir ao tema e à personalização por módulo.
- **Do** garantir que cada decisão de design sobreviva a qualquer tema (azul, vinho, verde) e a overrides arbitrários por módulo — testar mentalmente com um preset oposto.
- **Do** validar contraste do texto ≥ 4.5:1 contra o fundo do tema **atual**, revalidando a cada tema/override — não só no preset padrão.
- **Do** usar sombras translúcidas derivadas do tema (`soft` / `floating`), nunca preto neutro fixo.
- **Do** dar respiro: hierarquia por tipografia e espaço, ritmo que dá lugar ao interior.
- **Do** reservar a Satisfy para a assinatura da marca e só ela.
- **Do** honrar `prefers-reduced-motion` em todo micro-movimento (afundar do botão, deslizar da seta).

### Don't:

- **Don't** escrever cor fixa em componente (`#be6731`, `#8d2b00` literais) — quebra o Theme-Token Rule e a personalização por módulo.
- **Don't** tratar os tons terra-oliva como "as cores da marca": são só o seed de um preset. Nenhuma cor é assinatura (No-Signature-Color Rule).
- **Don't** parecer corporativo: nada de hero-métrica de SaaS, grids de cards idênticos ou linguagem de "soluções".
- **Don't** cair nos tells de IA: eyebrow em maiúsculas com tracking acima de cada seção, marcadores 01/02/03 como scaffolding, texto em gradiente (`background-clip: text`), glassmorphism decorativo.
- **Don't** parecer clínico-frio (azul-hospitalar, consultório estéril) nem "wellness" de banco de imagens.
- **Don't** usar `border-left`/`border-right` > 1px como faixa colorida de destaque.
