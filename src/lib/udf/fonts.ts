// Embedded, metric-locked fonts.
//
// UYAP renders with Times New Roman and Arial. To make pagination and line
// breaks deterministic for EVERY viewer (independent of the OS's installed
// fonts), we ship fonts whose glyph advance widths match Times New Roman /
// Arial exactly (Liberation Serif / Liberation Sans are metric-compatible
// substitutes) and force them. Same advances + same available width => same
// line breaks as the engine we are mirroring.
//
// The single-line height is NOT a guessed constant: it is the embedded serif's
// own metric, ascent+descent+lineGap over unitsPerEm, which is exactly what a
// Java FontMetrics.getHeight() yields and therefore what the row height is.

export const FONT_SERIF = 'UDF Serif';
export const FONT_SANS = 'UDF Sans';

// Embedded Liberation Serif metrics (unitsPerEm 2048): hhea asc 1825,
// desc -443, lineGap 87.
const UPM = 2048;
const HHEA_ASCENT = 1825;
const HHEA_DESCENT = 443;
const HHEA_LINEGAP = 87;

// Row height the way the engine we mirror computes it: a Java AWT FontMetrics
// rounds ascent, descent and leading to whole device pixels *separately* and
// sums them. At 72dpi (1pt = 1px) this yields, e.g., 15pt for a 12pt font
// (11 + 3 + 1) rather than the fractional 13.8pt. Pagination depends on this.
export function lineHeightPt(sizePt: number): number {
  const r = (units: number) => Math.round((units * sizePt) / UPM);
  return r(HHEA_ASCENT) + r(HHEA_DESCENT) + r(HHEA_LINEGAP);
}

let fontBase = '/fonts/';
/** Set the base URL the woff2 files are served from (default `/fonts/`). */
export function setFontBase(url: string): void {
  fontBase = url.endsWith('/') ? url : url + '/';
}

/** Inline @font-face block, optionally with data-URI sources for offline use. */
export function fontFaceCss(sources?: Record<string, string>): string {
  const src = (file: string) =>
    sources && sources[file] ? sources[file] : `url("${fontBase}${file}") format("woff2")`;
  return `
@font-face{font-family:"${FONT_SERIF}";font-style:normal;font-weight:400;
  font-display:block;src:${src('tinmetric-serif-regular.woff2')};}
@font-face{font-family:"${FONT_SERIF}";font-style:normal;font-weight:700;
  font-display:block;src:${src('tinmetric-serif-bold.woff2')};}
@font-face{font-family:"${FONT_SERIF}";font-style:italic;font-weight:400;
  font-display:block;src:${src('tinmetric-serif-italic.woff2')};}
@font-face{font-family:"${FONT_SERIF}";font-style:italic;font-weight:700;
  font-display:block;src:${src('tinmetric-serif-bolditalic.woff2')};}
@font-face{font-family:"${FONT_SANS}";font-style:normal;font-weight:400;
  font-display:block;src:${src('tinmetric-sans-regular.woff2')};}
@font-face{font-family:"${FONT_SANS}";font-style:normal;font-weight:700;
  font-display:block;src:${src('tinmetric-sans-bold.woff2')};}`;
}

/** Map a UYAP font family name to one of the embedded, metric-locked stacks. */
export function mapFamily(family: string | null | undefined): string {
  const f = (family || '').toLowerCase();
  if (f.includes('arial') || f.includes('helvetica') || f.includes('sans'))
    return `"${FONT_SANS}", "Liberation Sans", Arial, sans-serif`;
  // default and every serif/Times variant -> the metric-locked serif
  return `"${FONT_SERIF}", "Liberation Serif", "Times New Roman", serif`;
}
