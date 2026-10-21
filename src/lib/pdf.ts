/** Tiny dependency-free PDF writer so demo downloads are real, local files. */

export interface PdfBlock {
  kind: 'h' | 'p';
  text: string;
}

const MAP: Record<string, string> = {
  '—': '-',
  '–': '-',
  '’': "'",
  '‘': "'",
  '“': '"',
  '”': '"',
  '•': '*',
  '·': '-',
  '…': '...',
  '×': 'x',
};

const clean = (s: string) => s.replace(/[^\x20-\x7E]/g, (c) => MAP[c] ?? '');
const esc = (s: string) => clean(s).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

function wrap(text: string, max: number): string[] {
  const words = clean(text).split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = (line + ' ' + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function buildPdf(title: string, blocks: PdfBlock[]): Blob {
  const pages: string[] = [];
  let ops: string[] = [];
  let y = 790;

  const newPage = () => {
    if (ops.length) pages.push(ops.join('\n'));
    ops = [];
    y = 790;
  };
  const text = (font: 'F1' | 'F2', size: number, str: string, x = 56) => {
    ops.push(`BT /${font} ${size} Tf ${x} ${y} Td (${esc(str)}) Tj ET`);
  };

  ops.push('0.32 0.37 0.33 rg 56 812 24 3 re f');
  text('F2', 22, title);
  y -= 30;
  text('F1', 9, 'Havenwell Concierge - fictional demo document, generated locally in your browser.');
  y -= 30;

  for (const b of blocks) {
    const isH = b.kind === 'h';
    const lines = wrap(b.text, isH ? 70 : 92);
    const lead = isH ? 20 : 15;
    if (isH) y -= 6;
    for (const l of lines) {
      if (y < 70) newPage();
      text(isH ? 'F2' : 'F1', isH ? 13 : 10.5, l);
      y -= lead;
    }
    y -= isH ? 2 : 8;
  }
  pages.push(ops.join('\n'));

  const objs: string[] = [];
  objs[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  const kids = pages.map((_, i) => `${5 + i * 2} 0 R`).join(' ');
  objs[2] = `<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>`;
  objs[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objs[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
  pages.forEach((content, i) => {
    objs[5 + i * 2] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${6 + i * 2} 0 R >>`;
    objs[6 + i * 2] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  });

  let out = '%PDF-1.4\n';
  const offsets: number[] = [];
  for (let id = 1; id < objs.length; id++) {
    offsets[id] = out.length;
    out += `${id} 0 obj\n${objs[id]}\nendobj\n`;
  }
  const xref = out.length;
  out += `xref\n0 ${objs.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objs.length; id++) out += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  out += `trailer\n<< /Size ${objs.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([out], { type: 'application/pdf' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
