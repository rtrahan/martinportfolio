# Martin Braia Rodriguez — Drafting & Design Portfolio

Portfolio site with a project gallery and detail pages: 3D building background (Apple SHARP) and tilted plan drawings (PDF/SVG) that open into a flat, zoomable viewer.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Setup

### Portfolio PDF (plans)

Copy the portfolio PDF into the site so plan modals can load it:

```bash
npm run copy-pdf -- /path/to/portfolio.pdf
```

Or manually copy your PDF to `public/plans/portfolio.pdf`. Plan page numbers are set in `src/data/projects.json` (1-based: Monitor Barn 6, Post & Beam 8, Contemporary Farm House 10, Garage 12, Details 13).

### 3D backgrounds (SHARP)

1. Run [Apple ml-sharp](https://github.com/apple/ml-sharp) on one photo per building:  
   `sharp predict -i <photo_dir> -o <output_dir>` → produces `.ply` files.
2. Convert `.ply` to `.splat` (e.g. [antimatter15/splat](https://github.com/antimatter15/splat) `convert.py`).
3. Put `.splat` files in `public/splat/` (e.g. `monitor-barn.splat`).
4. In `src/data/projects.json`, set each project’s `splatUrl` (e.g. `"/splat/monitor-barn.splat"`).

If `splatUrl` is null, the detail page shows a gradient fallback. You can set `fallbackMediaUrl` to an image or video URL for devices without WebGL.

### Adding or overriding plan assets

- **Same PDF, different page:** Edit `plans[].page` in `src/data/projects.json`.
- **Separate PDF or SVG per drawing:** Add a new entry to `plans[]` with `type: "pdf"` or `type: "svg"` and `src: "/plans/your-file.pdf"` (or `.svg`). Put the file in `public/plans/`.

## Tech

- **Framework:** Next.js (App Router), TypeScript, Tailwind
- **3D:** WebGL 3D Gaussian splat viewer (antimatter15/splat iframe when `splatUrl` is set)
- **Plans:** PDF.js for PDFs; pan/zoom via `react-zoom-pan-pinch`; SVG via `<object>`

## Deploy

Build and run:

```bash
npm run build
npm start
```

Or deploy to [Vercel](https://vercel.com) or any static/Node host.
