// Type model for a parsed UYAP UDF document (format_id 1.7).
//
// A UDF file is a ZIP archive containing:
//   - content.xml            the document itself (see below)
//   - documentproperties.xml  uyapsicil (watermark) + uyapdogrulamakodu (verify code)
//   - sign.sgn               detached digital signature (not needed for viewing)
//
// content.xml stores ALL visible text once, inside a single
// <content><![CDATA[ ... ]]></content> blob ("master text"). Formatting lives
// in <elements>, where every run references a slice of the master text by
// (startOffset, length). This offset model is the whole ballgame: paragraph
// breaks are the '\n' characters consumed at the end of each paragraph's runs,
// NOT separate line elements. Rendering the raw CDATA instead of honouring the
// element tree is what produces "random newlines", lost styling and lost tabs.

/** Run-level character styling, already resolved through the style cascade. */
export interface RunStyle {
  fontFamily: string;
  /** points */
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  /** CSS color, default black */
  color: string;
}

/** One styled run = a slice of the master text plus its resolved style. */
export interface Run {
  /** 'content' | 'field' | 'space' | 'tab' | 'image' */
  kind: string;
  /** the sliced master text (may contain '\t'); newline terminators stripped */
  text: string;
  style: RunStyle;
  /** present for kind === 'image' — raw base64 PNG */
  imageData?: string;
}

/** Paragraph-level layout, resolved through the style cascade. All spatial
 *  values are in typographic points (1pt = 1/72in), as stored by UYAP. */
export interface ParaStyle {
  /** 0 left · 1 center · 2 right · 3 justify */
  align: number;
  firstLineIndent: number;
  leftIndent: number;
  rightIndent: number;
  hanging: number;
  spaceAbove: number;
  spaceBelow: number;
  /** 0 => browser-normal line height */
  lineSpacing: number;
  /** tab stops parsed from TabSet: position in pt + type (0 left, 2 centre) */
  tabStops: { pos: number; type: number }[];
  fontFamily: string;
  fontSize: number;
}

export interface Paragraph {
  type: 'paragraph';
  style: ParaStyle;
  runs: Run[];
}

export interface TableCell {
  blocks: Block[];
}
export interface TableRow {
  cells: TableCell[];
}
export interface UdfTable {
  type: 'table';
  border: string;
  rows: TableRow[];
}

export type Block = Paragraph | UdfTable;

export interface PageFormat {
  /** all in points */
  width: number;
  height: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  headerOffset: number;
  footerOffset: number;
  /** true = portrait */
  portrait: boolean;
}

export interface FooterConfig {
  separator: string;
  fontFace: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  /** decoded ARGB CSS color */
  color: string;
}

export interface UdfDocument {
  pageFormat: PageFormat;
  /** running header, shown from this 1-based page number onward (0 = never) */
  headerStartPage: number;
  header: Paragraph[];
  footer: FooterConfig;
  blocks: Block[];
  /** documentproperties.xml */
  uyapsicil: string;
  uyapdogrulamakodu: string;
  /** webID barcode payload, if present */
  webId: string;
}
