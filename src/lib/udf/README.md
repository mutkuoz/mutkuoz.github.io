# UDF viewer

A dependency-light, **client-side** renderer that displays UYAP `.udf`
documents the way the official UYAP editor does — fonts, styling, header,
footer, page numbers, watermark and QR — with deterministic pagination.

It exists because naïve UDF viewers print the raw text blob and lose almost
everything: the font, bold/italic/underline, the header/footer, the watermark,
and they inject phantom newlines. This renderer honours the real UDF model
instead, so none of that happens.

```ts
import { renderUdfFile } from './lib/udf';

const buf = await file.arrayBuffer();           // a .udf File/Blob
await document.fonts.ready;                       // first layout already exact
const pageCount = renderUdfFile(buf, container);  // returns number of pages
```

Live tool + visual calibration: **`/udf`** (`src/pages/udf.astro`).

---

## The UDF format (reverse-engineered)

A `.udf` is a **ZIP** with three members:

| member | purpose |
|---|---|
| `content.xml` | the document |
| `documentproperties.xml` | `uyapsicil` (watermark), `uyapdogrulamakodu` (verify code) |
| `sign.sgn` | detached signature — not needed for viewing |

`content.xml` is the important part:

```xml
<template format_id="1.7">
  <content><![CDATA[ …every visible character of the document… ]]></content>
  <properties><pageFormat mediaSizeName="1" leftMargin="70.875" … /></properties>
  <elements>
    <header startPage="2"><paragraph>…runs…</paragraph></header>
    <paragraph Alignment="3" FirstLineIndent="35.4375" resolver="hvl-default">
      <content startOffset="892" length="1213"/>      <!-- a slice of the CDATA -->
      <field   startOffset="261" length="8" fieldName="esasNumarasi"/>
      <space … /><tab … />
    </paragraph>
    <table border="borderNone"><row><cell>…<image imageData="…b64 PNG…"/></cell></row></table>
    <footer pageNumber-seperator="/" pageNumber-fontFace="Arial" … />
  </elements>
  <styles><style name="hvl-default" family="Times New Roman" size="12" …/></styles>
</template>
```

### The one idea that matters: the offset model

All text lives **once**, in the `<content>` CDATA ("master text"). Formatting
lives in `<elements>`, where every run points at a slice of that text via
`startOffset` + `length`. Run kinds: `content`, `field` (a merged value, but its
resolved text is already in the master text, so it renders like `content`),
`space`, `tab`, `image`.

Consequences a faithful renderer must respect:

* **Paragraph breaks are the `\n` characters** that each paragraph's runs consume
  at their end. We strip that single trailing `\n` and use the `<paragraph>`
  element as the block. Rendering the raw CDATA *and* block-wrapping paragraphs
  is what produces "random extra newlines".
* **`\t` is a tab stop, not whitespace.** Tabs are turned into spacer spans whose
  width is resolved against the paragraph's tab stops *after* layout. This is how
  the centred `T.C. / ANKARA / 27.İŞ MAHKEMESİ` titles and the aligned
  `ESAS NO : value` colon column are reproduced.
* **Styling cascades** run → paragraph → named `<style>` (via `resolver`) → default.
* Spatial values are **typographic points** (`leftMargin=70.875pt ≈ 2.5cm`).
* Alignment: `0` left · `1` centre · `2` right · `3` justify.

---

## How exact fidelity is achieved

Pagination and line breaking have to match a **Java/AWT** text engine. Two
decisions make that deterministic in the browser:

1. **Embedded, metric-locked fonts.** `public/fonts/tinmetric-*` (Liberation
   Serif/Sans, metric-compatible with Times New Roman/Arial) are shipped and
   *forced*. Same glyph advances + same available width ⇒ same line breaks, on
   every device, regardless of installed fonts. → `fonts.ts`.

2. **Font-derived integer row height.** A Java `FontMetrics.getHeight()` rounds
   ascent, descent and leading to whole device pixels *separately* and sums
   them. For the embedded serif (upm 2048, hhea 1825/-443/87) a 12pt font is
   `round(11)+round(3)+round(1) = 15pt`, not the fractional 13.8pt. Pagination
   uses this integer height (`lineHeightPt`), which is why the sample renders in
   exactly **4 pages**. → `fonts.ts`, `render.ts`.

Everything else is read straight from the document — page size/margins, header
`startPage`, footer page-number config, `uyapsicil` watermark, the
`uyapdogrulamakodu`/webID QR — with **no per-document hard-coding**. Paragraphs
that overflow a page are split at a line boundary so the next page continues
mid-paragraph, exactly like the editor.

### Calibration knobs (`RenderOptions`)

Two metrics can't be read from the file and are exposed so a document can be
dialled to a pixel match against the official editor and then locked:

| option | default | meaning |
|---|---|---|
| `lineScale` | `1` | multiplier on the integer row height |
| `defaultTabPt` | `5.1` | grid step (pt) for tabs beyond a paragraph's explicit stops |
| `fontBase` | `/fonts/` | where the woff2 files are served from |

The `/udf` tool exposes `lineScale` and `defaultTabPt` as live sliders — open a
document beside the real UYAP editor, nudge until identical, read off the value.

---

## API

```ts
renderUdfFile(buf, container, options?) → number   // parse + render, returns pages
readUdf(buf) → UdfDocument                           // parse only
renderDocument(doc, container, options?) → number    // render a parsed doc
parseUdf(contentXml, propsXml?) → UdfDocument         // parse raw XML
setFontBase(url)                                       // if not serving from /fonts/
```

Self-contained except `fflate` (unzip) and `qrcode-generator` (footer QR).
Serve the six `public/fonts/tinmetric-*.woff2` files (or point `fontBase`/your
own `@font-face` at them).

---

## Fidelity boundary (be honest)

Page **count**, page geometry, header/footer/watermark/QR, fonts, styling,
tabs, justification and paragraph splitting are reproduced and were verified
against the reference document. Exact **line-break parity** depends on glyph
advances; the embedded Liberation fonts are metric-compatible with Times New
Roman, so breaks match in the overwhelming majority of lines, but a substitute
font can still differ from real Times New Roman by a word on an occasional line.
To remove that last variable, register the genuine Times New Roman as the
`UDF Serif` family in `fonts.ts` (advances then match exactly). The `lineScale`
knob exists to lock vertical metrics if a future UYAP build changes them.
