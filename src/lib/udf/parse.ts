// Parse content.xml + documentproperties.xml into a UdfDocument.
//
// The heavy lifting is the style cascade and the offset model. Every run takes
// its text from masterText.slice(offset, offset+length); every paragraph/run
// resolves its visual attributes by walking run -> paragraph -> named style
// (via `resolver`) -> document default.

import type {
  Block, Paragraph, PageFormat, ParaStyle, Run, RunStyle, TableCell,
  TableRow, UdfDocument, UdfTable, FooterConfig,
} from './types';
import { mapFamily } from './fonts';

function parseXml(xml: string): Document {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const err = doc.querySelector('parsererror');
  if (err) throw new Error('UDF parse error: ' + err.textContent);
  return doc;
}

/** Map a UYAP font family to the embedded, metric-locked CSS stack. */
const fontStack = (family: string | null | undefined): string => mapFamily(family);

/** Decode a Java ARGB integer (e.g. -16777216) to a CSS color. */
function decodeColor(v: string | null | undefined): string | undefined {
  if (v == null || v === '') return undefined;
  const n = Number(v);
  if (!Number.isFinite(n)) return undefined;
  const argb = n >>> 0;
  const r = (argb >> 16) & 0xff;
  const g = (argb >> 8) & 0xff;
  const b = argb & 0xff;
  return `rgb(${r}, ${g}, ${b})`;
}

/** Resolver: walk a named-style chain collecting the first attribute hit. */
class Styles {
  private map = new Map<string, Element>();
  constructor(stylesEl: Element | null) {
    if (!stylesEl) return;
    for (const s of Array.from(stylesEl.children)) {
      const name = s.getAttribute('name');
      if (name) this.map.set(name, s);
    }
  }
  /** Look up `attr` starting at style `name`, following `resolver` parents. */
  attr(name: string | null | undefined, attr: string, seen = new Set<string>()): string | null {
    if (!name || seen.has(name)) return null;
    seen.add(name);
    const el = this.map.get(name);
    if (!el) return null;
    const v = el.getAttribute(attr);
    if (v != null) return v;
    return this.attr(el.getAttribute('resolver'), attr, seen);
  }
}

const bool = (v: string | null) => v === 'true';

/** First attribute found across run, paragraph, then the style chain. */
function cascade(
  attr: string,
  runEl: Element | null,
  paraEl: Element,
  styles: Styles,
): string | null {
  if (runEl) {
    const rv = runEl.getAttribute(attr);
    if (rv != null) return rv;
  }
  const pv = paraEl.getAttribute(attr);
  if (pv != null) return pv;
  // paragraph may itself carry a resolver into named styles
  return styles.attr(paraEl.getAttribute('resolver'), attr);
}

function runStyle(runEl: Element, paraEl: Element, styles: Styles): RunStyle {
  return {
    fontFamily: fontStack(cascade('family', runEl, paraEl, styles)),
    fontSize: Number(cascade('size', runEl, paraEl, styles) ?? '12') || 12,
    bold: bool(cascade('bold', runEl, paraEl, styles)),
    italic: bool(cascade('italic', runEl, paraEl, styles)),
    underline: bool(cascade('underline', runEl, paraEl, styles)),
    color: decodeColor(cascade('foreground', runEl, paraEl, styles)) ?? '#000',
  };
}

function num(v: string | null, d = 0): number {
  if (v == null) return d;
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}

/** Parse TabSet="236.0:0:0 354.0:2:0" into stops. */
function parseTabSet(v: string | null): { pos: number; type: number }[] {
  if (!v) return [];
  const out: { pos: number; type: number }[] = [];
  for (const tok of v.trim().split(/\s+/)) {
    const parts = tok.split(':');
    const pos = Number(parts[0]);
    if (Number.isFinite(pos)) out.push({ pos, type: Number(parts[1]) || 0 });
  }
  return out.sort((a, b) => a.pos - b.pos);
}

function paraStyle(paraEl: Element, styles: Styles): ParaStyle {
  const get = (a: string) => {
    const pv = paraEl.getAttribute(a);
    if (pv != null) return pv;
    return styles.attr(paraEl.getAttribute('resolver'), a);
  };
  return {
    align: num(get('Alignment'), 0),
    firstLineIndent: num(get('FirstLineIndent')),
    leftIndent: num(get('LeftIndent')),
    rightIndent: num(get('RightIndent')),
    hanging: num(get('Hanging')),
    spaceAbove: num(get('SpaceAbove')),
    spaceBelow: num(get('SpaceBelow')),
    lineSpacing: num(get('LineSpacing')),
    tabStops: parseTabSet(get('TabSet')),
    fontFamily: fontStack(get('family')),
    fontSize: num(get('size'), 12) || 12,
  };
}

function slice(master: string, el: Element): string {
  const so = el.getAttribute('startOffset');
  const ln = el.getAttribute('length');
  if (so == null || ln == null) return '';
  const start = Number(so);
  return master.substr(start, Number(ln));
}

/** Build the runs of a paragraph, stripping the paragraph-terminating newline. */
function buildRuns(paraEl: Element, master: string, styles: Styles): Run[] {
  const runs: Run[] = [];
  for (const el of Array.from(paraEl.children)) {
    const kind = el.tagName;
    if (kind === 'image') {
      runs.push({
        kind,
        text: '',
        style: runStyle(el, paraEl, styles),
        imageData: el.getAttribute('imageData') ?? undefined,
      });
      continue;
    }
    let text = slice(master, el);
    text = text.replace(/\r/g, '');
    runs.push({ kind, text, style: runStyle(el, paraEl, styles) });
  }
  // Strip a single trailing '\n' (the paragraph separator) from the last
  // text-bearing run — this is what stops the "extra blank line" bug.
  for (let i = runs.length - 1; i >= 0; i--) {
    if (runs[i].kind === 'image') break;
    if (runs[i].text.length) {
      if (runs[i].text.endsWith('\n')) runs[i].text = runs[i].text.slice(0, -1);
      break;
    }
  }
  // Drop any now-empty trailing run so emptiness detection is clean.
  return runs;
}

function parseParagraph(paraEl: Element, master: string, styles: Styles): Paragraph {
  return { type: 'paragraph', style: paraStyle(paraEl, styles), runs: buildRuns(paraEl, master, styles) };
}

function parseTable(tableEl: Element, master: string, styles: Styles): UdfTable {
  const rows: TableRow[] = [];
  for (const rowEl of Array.from(tableEl.children).filter((c) => c.tagName === 'row')) {
    const cells: TableCell[] = [];
    for (const cellEl of Array.from(rowEl.children).filter((c) => c.tagName === 'cell')) {
      const blocks: Block[] = [];
      for (const child of Array.from(cellEl.children)) {
        if (child.tagName === 'paragraph') blocks.push(parseParagraph(child, master, styles));
        else if (child.tagName === 'table') blocks.push(parseTable(child, master, styles));
      }
      cells.push({ blocks });
    }
    rows.push({ cells });
  }
  return { type: 'table', border: tableEl.getAttribute('border') ?? 'borderNone', rows };
}

function parsePageFormat(el: Element | null): PageFormat {
  // A4 portrait default (mediaSizeName="1" => A4 in UYAP).
  const A4_W = 595.276, A4_H = 841.89;
  const portrait = (el?.getAttribute('paperOrientation') ?? '1') !== '0';
  return {
    width: portrait ? A4_W : A4_H,
    height: portrait ? A4_H : A4_W,
    leftMargin: num(el?.getAttribute('leftMargin') ?? null, 70.875),
    rightMargin: num(el?.getAttribute('rightMargin') ?? null, 70.875),
    topMargin: num(el?.getAttribute('topMargin') ?? null, 70.875),
    bottomMargin: num(el?.getAttribute('bottomMargin') ?? null, 70.875),
    headerOffset: num(el?.getAttribute('headerFOffset') ?? null, 15),
    footerOffset: num(el?.getAttribute('footerFOffset') ?? null, 60),
    portrait,
  };
}

function parseFooter(el: Element | null): FooterConfig {
  return {
    separator: el?.getAttribute('pageNumber-seperator') ?? '/',
    fontFace: el?.getAttribute('pageNumber-fontFace') ?? 'Arial',
    fontSize: num(el?.getAttribute('pageNumber-fontSize') ?? null, 11),
    bold: bool(el?.getAttribute('pageNumber-fontBold') ?? null),
    italic: bool(el?.getAttribute('pageNumber-fontItalic') ?? null),
    color: decodeColor(el?.getAttribute('pageNumber-color')) ?? '#000',
  };
}

/** Parse the two XML members of a UDF into a renderable document model. */
export function parseUdf(contentXml: string, propsXml?: string): UdfDocument {
  const doc = parseXml(contentXml);
  const template = doc.documentElement;

  // Direct-child <content> holds the CDATA master text (do not match run
  // <content> elements nested inside <elements>).
  let master = '';
  for (const node of Array.from(template.childNodes)) {
    if (node.nodeType === 1 && (node as Element).tagName === 'content') {
      master = node.textContent ?? '';
      break;
    }
  }

  const styles = new Styles(template.querySelector('styles'));
  const elementsEl = template.querySelector('elements');
  const pageFormat = parsePageFormat(template.querySelector('properties > pageFormat'));

  const blocks: Block[] = [];
  const header: Paragraph[] = [];
  let headerStartPage = 0;
  let footer = parseFooter(null);

  if (elementsEl) {
    for (const child of Array.from(elementsEl.children)) {
      switch (child.tagName) {
        case 'paragraph':
          blocks.push(parseParagraph(child, master, styles));
          break;
        case 'table':
          blocks.push(parseTable(child, master, styles));
          break;
        case 'header': {
          headerStartPage = num(child.getAttribute('startPage'), 1) || 1;
          for (const p of Array.from(child.children).filter((c) => c.tagName === 'paragraph'))
            header.push(parseParagraph(p, master, styles));
          break;
        }
        case 'footer':
          footer = parseFooter(child);
          break;
      }
    }
  }

  // documentproperties.xml -> watermark + verification code.
  let uyapsicil = '', uyapdogrulamakodu = '';
  if (propsXml) {
    try {
      const pdoc = parseXml(propsXml);
      for (const e of Array.from(pdoc.getElementsByTagName('entry'))) {
        const k = e.getAttribute('key');
        if (k === 'uyapsicil') uyapsicil = e.textContent?.trim() ?? '';
        else if (k === 'uyapdogrulamakodu') uyapdogrulamakodu = e.textContent?.trim() ?? '';
      }
    } catch { /* properties are optional */ }
  }

  const webId = template.querySelector('webID')?.getAttribute('id')?.replace(/\s+/g, '') ?? '';

  return { pageFormat, headerStartPage, header, footer, blocks, uyapsicil, uyapdogrulamakodu, webId };
}
