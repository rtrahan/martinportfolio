#!/usr/bin/env node
/**
 * Copies the portfolio PDF to public/plans/portfolio.pdf so the site can load it.
 * Usage: node scripts/copy-portfolio-pdf.mjs /path/to/MBR_portfolio.pdf
 *
 * Plan pages in data (1-based): Monitor Barn 6, Post & Beam 8, Contemporary Farm House 10, Garage 12, Details 13.
 */

import { copyFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'public', 'plans');
const outPath = join(outDir, 'portfolio.pdf');

const srcPath = process.argv[2];
if (!srcPath) {
  console.error('Usage: node scripts/copy-portfolio-pdf.mjs /path/to/portfolio.pdf');
  process.exit(1);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await copyFile(srcPath, outPath);
  console.log(`Copied ${srcPath} -> ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
