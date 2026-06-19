// Render a parsed UdfDocument into faithful, paginated A4 pages in the DOM.
//
// Design notes that make the output match the official UYAP view:
//  * Spatial values are points; we lay out in CSS px at 96dpi.
//  * Paragraphs are real blocks; the '\n' terminators were already stripped in
//    parse, so there are no phantom blank lines.
//  * '\t' characters become zero-content spacer spans whose width is resolved
//    AFTER layout against the paragraph's tab stops (explicit stops first, then
//    a fixed grid) — this reproduces the centred T.C./ANKARA titles and the
//    aligned "LABEL : value" colon column.
//  * Header (from its startPage), page numbers, the tiled `uyapsicil`
//    watermark and the UYAP verification footer are all reproduced.

import type { Block, Paragraph, Run, UdfDocument } from './types';
import qrcode from 'qrcode-generator';
import { fontFaceCss, FONT_SANS, lineHeightPt, setFontBase } from './fonts';

const PX = 96 / 72; // px per point
const pt = (v: number) => v * PX;

const EPS = 0.75;

/** Calibratable knobs. Defaults are the reverse-engineered UYAP values; the
 *  demo exposes them as sliders so a document can be dialled to an exact match
 *  against the official editor and the value then locked in. */
export interface RenderOptions {
  /** scale on the font-derived integer line height (1 = as computed) */
  lineScale?: number;
  /** grid step (pt) for tabs that fall beyond a paragraph's explicit stops */
  defaultTabPt?: number;
  /** base URL the embedded woff2 files are served from */
  fontBase?: string;
}

// Active knob values (module-scoped so the build helpers can read them).
let lineScale = 1;
let DEFAULT_TAB_PT = 5.1;

const STYLE_ID = 'udf-viewer-styles';

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const css = fontFaceCss() + `
.udf-viewer{background:#5a5d61;padding:28px 0;display:flex;flex-direction:column;
  align-items:center;gap:22px;overflow:auto;font-kerning:normal;
  text-rendering:geometricPrecision;-webkit-font-smoothing:antialiased;}
.udf-page{background:#fff;position:relative;box-sizing:border-box;overflow:hidden;
  box-shadow:0 1px 6px rgba(0,0,0,.45);color:#000;}
.udf-watermark{position:absolute;inset:0;z-index:0;pointer-events:none;}
.udf-content{position:absolute;z-index:1;}
.udf-header{position:absolute;z-index:2;}
.udf-pageno{position:absolute;z-index:2;white-space:nowrap;}
.udf-verify{position:absolute;z-index:2;display:flex;align-items:center;
  gap:8px;border-top:1px solid #000;padding-top:2px;
  font-family:"${FONT_SANS}","Liberation Sans",Arial,sans-serif;color:#000;
  line-height:1.15;}
.udf-verify .v-text{flex:1;}
.udf-verify .v-code{font-weight:700;letter-spacing:.3px;white-space:nowrap;}
.udf-verify .v-qr{flex:none;}
.udf-p{margin:0;padding:0;}
.udf-tab{display:inline-block;width:0;}
.udf-table{border-collapse:collapse;width:100%;}
.udf-table td{vertical-align:top;padding:0;}
.udf-table.bordered td{border:1px solid #000;}
.udf-img{display:inline-block;max-width:100%;}
@media print{.udf-viewer{background:none;padding:0;gap:0;}
  .udf-page{box-shadow:none;margin:0;page-break-after:always;}}
`;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = css;
  document.head.appendChild(el);
}

const alignName = ['left', 'center', 'right', 'justify'];

/** Apply a run's character style to a span. */
function styleRun(span: HTMLElement, run: Run): void {
  const s = run.style;
  span.style.fontFamily = s.fontFamily;
  span.style.fontSize = pt(s.fontSize) + 'px';
  if (s.bold) span.style.fontWeight = '700';
  if (s.italic) span.style.fontStyle = 'italic';
  if (s.underline) span.style.textDecoration = 'underline';
  if (s.color && s.color !== '#000') span.style.color = s.color;
}

/** Emit a run as one or more inline spans, turning '\t' into spacer spans. */
function appendRun(parent: Node, run: Run): void {
  if (run.kind === 'image' && run.imageData) {
    const img = document.createElement('img');
    img.className = 'udf-img';
    img.src = 'data:image/png;base64,' + run.imageData;
    parent.appendChild(img);
    return;
  }
  const segments = run.text.split('\t');
  for (let i = 0; i < segments.length; i++) {
    if (i > 0) {
      const tab = document.createElement('span');
      tab.className = 'udf-tab';
      styleRun(tab, run);
      parent.appendChild(tab);
    }
    if (segments[i].length) {
      const span = document.createElement('span');
      styleRun(span, run);
      span.textContent = segments[i];
      parent.appendChild(span);
    }
  }
}

interface ParaOpts {
  /** continuation half of a split paragraph: drop first-line indent / space */
  continuation?: boolean;
  /** force last line justified (paragraph continues on next page) */
  flushTail?: boolean;
}

function buildParagraph(para: Paragraph, opts: ParaOpts = {}): HTMLElement {
  const st = para.style;
  const div = document.createElement('div');
  div.className = 'udf-p';
  div.style.textAlign = alignName[st.align] ?? 'left';
  div.style.fontFamily = st.fontFamily;
  div.style.fontSize = pt(st.fontSize) + 'px';
  // Row height = the integer FontMetrics height of the tallest run on the line
  // (Java rounds per-glyph-metric then sums). LineSpacing adds that fraction.
  let maxSize = st.fontSize;
  for (const r of para.runs) if (r.style.fontSize > maxSize) maxSize = r.style.fontSize;
  const lhPt = lineHeightPt(maxSize) * (1 + Math.max(0, st.lineSpacing)) * lineScale;
  div.style.lineHeight = pt(lhPt) + 'px';

  const padLeft = (st.leftIndent + st.hanging) * PX;
  const fli = opts.continuation ? 0 : st.firstLineIndent;
  div.style.paddingLeft = padLeft + 'px';
  div.style.textIndent = (fli - st.hanging) * PX + 'px';
  div.style.paddingRight = pt(st.rightIndent) + 'px';
  div.style.marginTop = (opts.continuation ? 0 : pt(st.spaceAbove)) + 'px';
  div.style.marginBottom = pt(st.spaceBelow) + 'px';
  if (opts.flushTail && st.align === 3) div.style.textAlignLast = 'justify';

  // tab metadata for the post-layout resolver
  div.dataset.tabStops = JSON.stringify(st.tabStops.map((t) => t.pos * PX));
  div.dataset.leftRef = String((st.leftIndent) * PX);

  let visible = false;
  for (const run of para.runs) {
    if (run.text.length || run.kind === 'image') visible = true;
    appendRun(div, run);
  }
  if (!visible) div.appendChild(document.createElement('br')); // keep blank-line height
  return div;
}

/** Resolve every tab spacer width inside `root`, sequentially per paragraph. */
function resolveTabs(root: HTMLElement): void {
  const paras = root.classList?.contains('udf-p')
    ? [root]
    : Array.from(root.querySelectorAll<HTMLElement>('.udf-p'));
  for (const p of paras) {
    const tabs = Array.from(p.querySelectorAll<HTMLElement>('.udf-tab'));
    if (!tabs.length) continue;
    const stops: number[] = JSON.parse(p.dataset.tabStops || '[]');
    const leftRef = Number(p.dataset.leftRef || '0');
    const inc = pt(DEFAULT_TAB_PT);
    const pRect = p.getBoundingClientRect();
    const origin = pRect.left + leftRef;
    for (const tab of tabs) {
      const pen = tab.getBoundingClientRect().left - origin;
      let target = stops.find((s) => s > pen + 0.5);
      if (target === undefined) target = pen + inc;
      tab.style.width = Math.max(0, target - pen) + 'px';
    }
  }
}

// ---- paragraph splitting across page boundaries ---------------------------

// A paragraph can be split across pages unless it carries an image (images
// live in table cells anyway). Tabs are fine: their characters are part of the
// run text and are preserved across the split.
const isSplittable = (p: Paragraph) => p.runs.every((r) => r.kind !== 'image');

/** Map the text nodes of a built paragraph back to global offsets in the
 *  run-text concatenation (which includes '\t' characters). */
function mapTextNodes(el: HTMLElement, fullText: string): { node: Text; start: number; len: number }[] {
  const out: { node: Text; start: number; len: number }[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let cursor = 0;
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const len = node.nodeValue?.length ?? 0;
    while (cursor < fullText.length && fullText[cursor] === '\t') cursor++; // skip tab gaps
    out.push({ node, start: cursor, len });
    cursor += len;
  }
  return out;
}

function sliceRuns(runs: Run[], cut: number): [Run[], Run[]] {
  const fit: Run[] = [];
  const rest: Run[] = [];
  let acc = 0;
  for (const r of runs) {
    const end = acc + r.text.length;
    if (end <= cut) fit.push(r);
    else if (acc >= cut) rest.push(r);
    else {
      const k = cut - acc;
      fit.push({ ...r, text: r.text.slice(0, k) });
      rest.push({ ...r, text: r.text.slice(k) });
    }
    acc = end;
  }
  return [fit, rest];
}

function trimLeadingSpace(runs: Run[]): Run[] {
  const out = runs.map((r) => ({ ...r }));
  for (const r of out) {
    r.text = r.text.replace(/^\s+/, '');
    if (r.text.length) break;
  }
  return out;
}

/** Split `para` so its first part fits in `maxHeightPx`. Returns [fit, rest];
 *  fit is null when not even one line fits. */
function splitParagraph(
  para: Paragraph,
  maxHeightPx: number,
  measure: HTMLElement,
): [Paragraph | null, Paragraph | null] {
  const fullText = para.runs.map((r) => r.text).join('');
  const fullLen = fullText.length;
  if (!fullLen) return [null, para];

  const el = buildParagraph(para);
  measure.innerHTML = '';
  measure.appendChild(el);
  resolveTabs(el); // tab widths affect line wrapping (first-line indent etc.)

  const nodes = mapTextNodes(el, fullText);
  if (!nodes.length) return [null, para];

  const top = el.getBoundingClientRect().top;
  const range = document.createRange();
  range.setStart(nodes[0].node, 0);
  // offset is a global index into fullText (tabs included); clamp to the last
  // text node at or before it so the measure is monotonic.
  const bottomAt = (offset: number): number => {
    let t = nodes[0];
    for (const x of nodes) { if (x.start <= offset) t = x; else break; }
    range.setEnd(t.node, Math.max(0, Math.min(t.len, offset - t.start)));
    return range.getBoundingClientRect().bottom - top;
  };

  let lo = 0, hi = fullLen, best = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (bottomAt(mid) <= maxHeightPx) { best = mid; lo = mid + 1; } else hi = mid - 1;
  }
  let cut = best;
  while (cut > 0 && !/\s/.test(fullText[cut - 1])) cut--; // break on whitespace
  if (cut <= 0) return [null, para];

  const [fitRuns, restRuns] = sliceRuns(para.runs, cut);
  const fit: Paragraph = { ...para, runs: fitRuns };
  const rest: Paragraph = { ...para, runs: trimLeadingSpace(restRuns) };
  return [fit, rest];
}

// ---- decorations: watermark, header, footer -------------------------------

function watermarkSvg(text: string): string {
  // a diagonal tile repeated across the page, very light grey
  const w = 230, h = 150;
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>` +
    `<text x='${w / 2}' y='${h / 2}' fill='%23000000' fill-opacity='0.07' ` +
    `font-family='Arial, sans-serif' font-size='17' font-weight='700' ` +
    `text-anchor='middle' transform='rotate(-30 ${w / 2} ${h / 2})'>${text}</text></svg>`;
  return svg.replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E')
    .replace(/"/g, "'").replace(/\s/g, '%20');
}

function decoratePage(
  page: HTMLElement,
  doc: UdfDocument,
  pageNo: number,
  total: number,
  geo: Geo,
): void {
  // watermark
  if (doc.uyapsicil) {
    const wm = document.createElement('div');
    wm.className = 'udf-watermark';
    const tile = watermarkSvg(doc.uyapsicil);
    wm.style.backgroundImage = `url("data:image/svg+xml,${tile}")`;
    wm.style.backgroundRepeat = 'repeat';
    page.insertBefore(wm, page.firstChild);
  }

  // running header (from its startPage onward)
  if (doc.headerStartPage && pageNo >= doc.headerStartPage && doc.header.length) {
    const head = document.createElement('div');
    head.className = 'udf-header';
    head.style.left = geo.leftMarginPx + 'px';
    head.style.top = pt(doc.pageFormat.headerOffset) + 'px';
    head.style.width = geo.textWidthPx + 'px';
    for (const p of doc.header) head.appendChild(buildParagraph(p));
    page.appendChild(head);
    resolveTabs(head);
  }

  // page number, bottom-right inside the bottom margin
  const pn = document.createElement('div');
  pn.className = 'udf-pageno';
  pn.style.right = geo.rightMarginPx + 'px';
  pn.style.bottom = pt(doc.pageFormat.footerOffset) + 'px';
  pn.style.fontFamily = `"${FONT_SANS}", "Liberation Sans", Arial, sans-serif`;
  pn.style.fontSize = pt(doc.footer.fontSize) + 'px';
  pn.style.color = doc.footer.color;
  if (doc.footer.bold) pn.style.fontWeight = '700';
  pn.textContent = `${pageNo}${doc.footer.separator}${total}`;
  page.appendChild(pn);

  // UYAP verification strip pinned to the very bottom
  if (doc.uyapdogrulamakodu || doc.webId) {
    const v = document.createElement('div');
    v.className = 'udf-verify';
    v.style.left = geo.leftMarginPx + 'px';
    v.style.right = geo.rightMarginPx + 'px';
    v.style.bottom = pt(18) + 'px';
    v.style.fontSize = pt(6) + 'px';

    // webID already carries '-' separators; show them spaced as UYAP does.
    const raw = doc.webId || doc.uyapdogrulamakodu;
    const code = raw.includes('-') ? raw.split('-').join('  -  ') : raw;
    const txt = document.createElement('div');
    txt.className = 'v-text';
    txt.innerHTML =
      `UYAP Bilişim Sistemindeki bu dokümana <b>http://vatandas.uyap.gov.tr</b> ` +
      `adresinden <span class="v-code">${code}</span> ile erişebilirsiniz.`;
    v.appendChild(txt);

    const qr = document.createElement('div');
    qr.className = 'v-qr';
    qr.style.width = pt(34) + 'px';
    qr.style.height = pt(34) + 'px';
    qr.style.background = qrCss(doc.webId || doc.uyapdogrulamakodu);
    qr.title = doc.uyapdogrulamakodu;
    v.appendChild(qr);

    page.appendChild(v);
  }
}

/** A real QR (model 2) of the document's verification payload, as a CSS bg. */
function qrCss(payload: string): string {
  if (!payload) return '#fff';
  const qr = qrcode(0, 'M');
  qr.addData(payload);
  qr.make();
  const n = qr.getModuleCount();
  let rects = '';
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (qr.isDark(r, c)) rects += `%3Crect x='${c}' y='${r}' width='1' height='1'/%3E`;
  const svg =
    `%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${n} ${n}' shape-rendering='crispEdges'%3E` +
    `%3Crect width='${n}' height='${n}' fill='%23fff'/%3E%3Cg fill='%23000'%3E${rects}%3C/g%3E%3C/svg%3E`;
  return `#fff url("data:image/svg+xml,${svg}") center/contain no-repeat`;
}

// ---- table ----------------------------------------------------------------

function buildTable(tbl: Block & { type: 'table' }): HTMLElement {
  const t = document.createElement('table');
  t.className = 'udf-table' + (tbl.border && tbl.border !== 'borderNone' ? ' bordered' : '');
  const tbody = document.createElement('tbody');
  for (const row of tbl.rows) {
    const tr = document.createElement('tr');
    for (const cell of row.cells) {
      const td = document.createElement('td');
      for (const b of cell.blocks) td.appendChild(buildBlock(b));
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  t.appendChild(tbody);
  return t;
}

function buildBlock(b: Block): HTMLElement {
  return b.type === 'table' ? buildTable(b) : buildParagraph(b);
}

// ---- geometry + pager -----------------------------------------------------

interface Geo {
  pageWpx: number; pageHpx: number;
  leftMarginPx: number; rightMarginPx: number;
  topMarginPx: number; bottomMarginPx: number;
  textWidthPx: number; contentHpx: number;
}

function geometry(doc: UdfDocument): Geo {
  const f = doc.pageFormat;
  const leftMarginPx = pt(f.leftMargin), rightMarginPx = pt(f.rightMargin);
  const topMarginPx = pt(f.topMargin), bottomMarginPx = pt(f.bottomMargin);
  const pageWpx = pt(f.width), pageHpx = pt(f.height);
  return {
    pageWpx, pageHpx, leftMarginPx, rightMarginPx, topMarginPx, bottomMarginPx,
    textWidthPx: pageWpx - leftMarginPx - rightMarginPx,
    contentHpx: pageHpx - topMarginPx - bottomMarginPx,
  };
}

class Pager {
  pages: { page: HTMLElement; content: HTMLElement }[] = [];
  content!: HTMLElement;
  constructor(
    private container: HTMLElement,
    private geo: Geo,
    private measure: HTMLElement,
  ) { this.newPage(); }

  private newPage(): void {
    const page = document.createElement('div');
    page.className = 'udf-page';
    page.style.width = this.geo.pageWpx + 'px';
    page.style.height = this.geo.pageHpx + 'px';
    const content = document.createElement('div');
    content.className = 'udf-content';
    content.style.left = this.geo.leftMarginPx + 'px';
    content.style.top = this.geo.topMarginPx + 'px';
    content.style.width = this.geo.textWidthPx + 'px';
    // Height is intentionally auto: a fixed height would clamp scrollHeight and
    // defeat the fill measurement below. The page clips any overflow.
    page.appendChild(content);
    this.container.appendChild(page);
    this.pages.push({ page, content });
    this.content = content;
  }

  add(block: Block): void {
    if (block.type === 'table') { this.addNonSplit(() => buildTable(block)); return; }
    let current: Paragraph | null = block;
    let guard = 0;
    while (current && guard++ < 5000) {
      const before = this.content.scrollHeight; // natural height already on page
      const el = buildParagraph(current);
      this.content.appendChild(el);
      if (this.content.scrollHeight <= this.geo.contentHpx + EPS) {
        resolveTabs(el);
        return;
      }
      this.content.removeChild(el);
      const remaining = this.geo.contentHpx - before - pt(current.style.spaceAbove);
      if (isSplittable(current) && remaining > pt(current.style.fontSize)) {
        const [fit, rest] = splitParagraph(current, remaining, this.measure);
        if (fit) {
          const fe = buildParagraph(fit, { flushTail: true });
          this.content.appendChild(fe);
          resolveTabs(fe);
        }
        this.newPage();
        current = rest ? { ...rest, style: { ...rest.style, firstLineIndent: 0, spaceAbove: 0 } } : null;
      } else {
        if (this.content.childNodes.length > 0) this.newPage();
        const el2 = buildParagraph(current);
        this.content.appendChild(el2);
        resolveTabs(el2);
        current = null;
      }
    }
  }

  private addNonSplit(make: () => HTMLElement): void {
    const el = make();
    this.content.appendChild(el);
    if (this.content.scrollHeight > this.geo.contentHpx + EPS && this.content.childNodes.length > 1) {
      this.content.removeChild(el);
      this.newPage();
      this.content.appendChild(el);
    }
    resolveTabs(el);
  }
}

/** Render `doc` into `container`, returning the page count. */
export function renderDocument(
  doc: UdfDocument,
  container: HTMLElement,
  options: RenderOptions = {},
): number {
  if (options.lineScale && options.lineScale > 0) lineScale = options.lineScale;
  if (options.defaultTabPt && options.defaultTabPt > 0) DEFAULT_TAB_PT = options.defaultTabPt;
  if (options.fontBase) setFontBase(options.fontBase);
  injectStyles();
  container.className = 'udf-viewer';
  container.innerHTML = '';
  const geo = geometry(doc);

  // offscreen measuring column at the exact text width
  const measure = document.createElement('div');
  measure.style.cssText =
    `position:absolute;left:-99999px;top:0;visibility:hidden;` +
    `width:${geo.textWidthPx}px;`;
  measure.className = 'udf-content';
  document.body.appendChild(measure);

  try {
    const pager = new Pager(container, geo, measure);
    for (const block of doc.blocks) pager.add(block);

    const total = pager.pages.length;
    pager.pages.forEach((p, i) => decoratePage(p.page, doc, i + 1, total, geo));
    return total;
  } finally {
    measure.remove();
  }
}
