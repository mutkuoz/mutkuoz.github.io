// Public API for the UDF viewer.
//
//   import { renderUdfFile } from './lib/udf';
//   await renderUdfFile(arrayBuffer, document.getElementById('viewer'));
//
// The core (parseUdf + renderDocument) is framework-agnostic and has no
// dependency beyond `fflate` for the ZIP step, so it drops straight into any
// app (e.g. turkhukuk.ai) that can hand it a container element.

import { unzipSync, strFromU8 } from 'fflate';
import { parseUdf } from './parse';
import { renderDocument, type RenderOptions } from './render';
import type { UdfDocument } from './types';

export { parseUdf } from './parse';
export { renderDocument, type RenderOptions } from './render';
export { setFontBase } from './fonts';
export type * from './types';

/** Read a .udf (ZIP) buffer into its parsed document model. */
export function readUdf(buffer: ArrayBuffer | Uint8Array): UdfDocument {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const files = unzipSync(bytes);
  const content = files['content.xml'];
  if (!content) throw new Error('Not a UDF file: content.xml missing');
  const props = files['documentproperties.xml'];
  return parseUdf(strFromU8(content), props ? strFromU8(props) : undefined);
}

/** Parse a .udf buffer and render it into `container`; returns page count. */
export function renderUdfFile(
  buffer: ArrayBuffer | Uint8Array,
  container: HTMLElement,
  options?: RenderOptions,
): number {
  return renderDocument(readUdf(buffer), container, options);
}
